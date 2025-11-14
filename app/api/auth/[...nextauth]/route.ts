// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions, type Session, type User, type Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma"; // your PrismaClient instance (see note below)

// ------------- Auth options ----------------
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter so NextAuth persists Users, Accounts, Sessions, VerificationTokens
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google OAuth provider (you already had this)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Credentials provider for email/password auth (requires the User table with hashed password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      /**
       * `authorize` is called when a user tries to sign in with email/password.
       * Return a user object (with at minimum an `id` and `email`) if authentication succeeds,
       * otherwise return null to indicate failure.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null; // no user or no password set (maybe OAuth-only)

        // compare hashed password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // return the minimal user object expected by NextAuth
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
        } as User;
      },
    }),
  ],

  pages: {
    signIn: "/login", // your custom sign-in page
    error: "/login",  // error redirect
  },

  callbacks: {
    /**
     * signIn runs on every sign in. We use it to update lastLogin (and it can be used
     * to block sign-ins if needed). Returning true allows sign-in to proceed.
     */
    async signIn({ user, account }: { user: User; account?: Account | null }) {
  console.log("🔍 SignIn callback - User ID:", user.id, "Provider:", account?.provider); // ← ADD THIS LINE
  
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
  } catch (err) {
    console.error("Failed to update lastLogin:", err);
  }

  return true;
},

    /**
     * jwt callback: called when a JWT is created or updated.
     * We persist `provider` on the token when an account is present so session can expose it.
     */
    async jwt({ token, user, account }: { token: JWT; user?: User | undefined; account?: Account | null }) {
      console.log("🧩 JWT callback:", { token, user, account });

      // On initial sign in, account will be present
      if (account) {
        // store provider (e.g. 'google' or 'credentials')
        (token as any).provider = account.provider;
      }

      // If user is present (first sign-in), ensure sub is set (NextAuth usually handles this)
      return token;
    },

    /**
     * session callback: called when a session is checked/created.
     * We attach id and provider info to session.user for easy client access.
     */
async session({ session, user }) {
    console.log("⚙️ session() callback triggered (DB session mode)");

    if (session?.user && user?.id) {
      session.user.id = user.id;
    }

    console.log("🧩 Final session object:", session);
    return session;
  },

  },

  // recommended: secure secret
  secret: process.env.NEXTAUTH_SECRET,
  // (optional) session strategy: "database" or "jwt". With PrismaAdapter the default DB session is used.
  // session: { strategy: "database" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

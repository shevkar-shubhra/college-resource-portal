import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

// Extend the default Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id: string // now TS knows 'id' exists
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    // You can add custom user fields here if needed
    role?: string
    collegeId?: string
  }
}

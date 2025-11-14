// components/login/LoginForm.tsx
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // <-- NO options passed here (TypeScript happy)
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redirect inside useEffect to avoid render-time navigation loops
  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  async function handleEmailLogin() {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result && (result as any).error) {
        alert("Invalid email or password");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check console.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignIn() {
    signIn("google", { callbackUrl: "/dashboard" });
  }
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coep.jpg-4x8dn9LCjVgizBJr8dMct43kABz523.jpeg')",
          filter: "grayscale(100%) contrast(1.2)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-4xl">
        <Card className="overflow-hidden shadow-2xl border-0 bg-transparent">
          <div className="grid lg:grid-cols-2 min-h-[500px]">
            {/* Left Panel */}
            <div
              className={cn(
                "flex flex-col items-center justify-center p-8 text-white transition-all duration-500",
                isLogin ? "bg-slate-800/90 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm text-slate-800"
              )}
            >
              {isLogin ? (
                <>
                  <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
                  <p className="text-slate-300 mb-8">Enter your personal details to use all of site features</p>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-slate-800 px-8 py-2 rounded-full bg-transparent"
                    onClick={() => setIsLogin(false)}
                  >
                    SIGN UP
                  </Button>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-4">Hello, Friend!</h1>
                  <p className="text-slate-600 mb-8">Register to use all of site features</p>
                  <Button
                    variant="outline"
                    className="border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white px-8 py-2 rounded-full bg-transparent"
                    onClick={() => setIsLogin(true)}
                  >
                    SIGN IN
                  </Button>
                </>
              )}
            </div>

            {/* Right Panel */}
            <div
              className={cn(
                "flex flex-col items-center justify-center p-8 transition-all duration-500",
                isLogin ? "bg-white/95 backdrop-blur-sm" : "bg-slate-800/90 backdrop-blur-sm"
              )}
            >
              <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-green-600 mr-2" />
                    <span className="text-2xl font-bold font-serif text-slate-800 dark:text-white">EduPortal</span>
                  </div>
                  <h2 className={cn("text-2xl font-bold mb-2", isLogin ? "text-slate-800" : "text-white")}>
                    {isLogin ? "Sign In" : "Create Account"}
                  </h2>
                  <p className={cn("text-sm", isLogin ? "text-slate-600" : "text-slate-300")}>
                    {isLogin ? "use your Email/MIS password" : "use your Email/MIS for registration"}
                  </p>
                </div>

                {/* Form */}
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailLogin();
                  }}
                >
                  {!isLogin && (
                    <>
                      <Input
                        type="text"
                        placeholder="Username"
                        className="bg-slate-100 border-0 text-slate-800 placeholder:text-slate-500"
                        required
                      />
                      <Input
                        type="text"
                        placeholder="MIS"
                        className="bg-slate-100 border-0 text-slate-800 placeholder:text-slate-500"
                        required
                      />
                    </>
                  )}

                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-slate-100 border-0 text-slate-800 placeholder:text-slate-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="bg-slate-100 border-0 text-slate-800 placeholder:text-slate-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {!isLogin && (
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      className="bg-slate-100 border-0 text-slate-800 placeholder:text-slate-500"
                      required
                    />
                  )}

                  {isLogin && (
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                      >
                        Forget Password?
                      </button>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="space-y-2">
                    {/* Email/password login */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-full transition-all duration-300"
                    >
                      {loading ? "Please wait..." : isLogin ? "SIGN IN" : "SIGN UP"}
                    </Button>

                    {/* Google OAuth */}
                    <Button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-full transition-all duration-300"
                    >
                      {isLogin ? "SIGN IN WITH GOOGLE" : "SIGN UP WITH GOOGLE"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input, { PasswordInput } from "@/components/ui/InputField";
import Link from "next/link";
import { HashLoader } from "react-spinners";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/chat",
      });
    } catch {
      toast.error("Google sign-in failed.");
      setGoogleLoading(false);
    }
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Invalid email or password");
        } else {
          toast.error("Sign-in failed: " + result.error, {
            position: "top-center",
            duration: 2000,
          });
        }
        setEmail("");
        setPassword("");
      } else {
        toast.success("successful");
        router.push("/chat");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <div className="scale-y-[-1] sm:scale-y-[1] absolute inset-0 auth-gradient"></div>

      <div className="z-10 w-[350px] flex justify-center sm:w-md bg-black/40 mx-auto p-6 border border-white/20 rounded-xl shadow-md space-y-4">
        <div className="w-full">
          <h1 className="text-2xl font-medium tracking-[-0.05em] text-center">
            Welcome to Visura
          </h1>

          <form
            onSubmit={handleCredentialsLogin}
            className="mt-8 space-y-4 w-full"
          >
            <Input
              title="Email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <PasswordInput
              title="Password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer btn-gradient text-white py-2 rounded-lg hover:scale-105 hover:bg-blue-400 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? <HashLoader size={16} color="white" /> : "Sign in"}
            </button>
          </form>
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full cursor-pointer flex justify-center bg-white hover:bg-gray-300 transition-all duration-300 text-black mt-2 py-2 rounded-lg disabled:opacity-50"
          >
            <span>
              <img
                alt="google-icon"
                src="/googleicon.svg"
                className="mr-4 w-6 h-6"
              />
            </span>
            <span className="font-medium">
              {" "}
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          <div className="mt-6 text-center text-sm">
            <p className="text-white">
              Create an account?{" "}
              <Link
                href="/signup"
                className="text-blue-300 text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input, { PasswordInput } from "@/components/ui/InputField";
import Link from "next/link";
import { HashLoader } from "react-spinners";
import { CreateUserSchema } from "@/types/userSchema";
import { signUp } from "@/api/signup";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      await signIn("google", {
        callbackUrl: "/chat",
      });
    } catch (err) {
      toast.error("Google sign-in failed.");
    }
    setGoogleLoading(false);
  };

  const handleCredentialsSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = CreateUserSchema.safeParse({ email, password, name });
    const newErrors: { [key: string]: string } = {};
    if (!result.success) {
      result.error.issues.forEach((element) => {
        if (!newErrors[element.path[0]])
          newErrors[element.path[0]] = element.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      setLoading(true);
      await signUp({ name, email, password });
      setLoading(false);
      toast.success("User Signed up Successfully,Please Signin");
      router.push("/signin");
    } catch (err: any) {
      setEmail("");
      setPassword("");
      setName("");
      toast.error(err.message || "Error Signing up");
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black flex justify-center items-center">
      <div className="scale-y-[-1] sm:scale-y-[1]  absolute inset-0 auth-gradient"></div>
      <div className="w-[350px] z-50 flex justify-center sm:w-md bg-black/40 mx-auto p-6 border border-white/20 rounded-xl shadow-md space-y-4">
        <div className="w-full">
          <h1 className="text-2xl font-medium tracking-[-0.05em] text-center">
            Welcome to Visura
          </h1>

          <form
            onSubmit={handleCredentialsSignup}
            className="space-y-4 mt-8 w-full"
          >
            <Input
              title="Name"
              type="string"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              error={errors.name}
            />
            <Input
              title="Email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              error={errors.email}
            />

            <PasswordInput
              title="Password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              error={errors.password}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer btn-gradient text-white py-2 rounded-lg hover:scale-105 hover:bg-blue-400 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? <HashLoader size={16} color="white" /> : "Sign up"}
            </button>
          </form>
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full cursor-pointer flex justify-center bg-white hover:bg-gray-300 transition-all duration-300 text-black mt-2 py-2 rounded-lg disabled:opacity-50"
          >
            <span>
              <img src="/googleicon.svg" className="mr-4 w-6 h-6" />
            </span>
            <span className="font-medium">
              {" "}
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          <div className="mt-6 text-center text-sm">
            <p className="text-white">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-300 text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

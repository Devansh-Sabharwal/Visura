"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const Err = searchParams.get("error");

  useEffect(() => {
    if (Err === "sessionExpired") {
      toast.error("Session expired. Please sign in again.", {
        position: "top-center",
      });
    }
  }, [Err]);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn("google", {
        callbackUrl: "/", // Let it redirect after successful login
      });
    } catch (err) {
      setError("Google sign-in failed.");
      setLoading(false);
    }
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      if (result?.error) {
        // Handle specific error cases
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password");
        } else {
          setError("Sign-in failed: " + result.error);
        }
      } else {
        // Success - redirect
        alert("successful");
        toast.success("successful");
        router.push("/chat");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-semibold text-center">Sign In</h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in with Credentials"}
        </button>
      </form>

      <hr className="my-4" />

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
}

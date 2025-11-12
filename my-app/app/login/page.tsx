// app/login/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) alert(error.message);
    else router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Log In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to post events and discover leftover food around campus.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0BA698] hover:bg-[#08957d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0BA698]"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center text-sm text-gray-400">
              <Link
                href="/reset-password"
                className="text-[#0BA698] hover:text-[#08957d]"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

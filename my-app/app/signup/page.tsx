"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Create auth account
    const { data: signupData, error: signupError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName }, // store in user metadata
        },
      }
    );
    if (signupError) {
      alert(signupError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    alert("Account created! Please check your email to verify your account.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join Spark! Bytes to share and find leftover food events on campus.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="first-name" className="sr-only">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="last-name" className="sr-only">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                required
              />
            </div>

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
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                required
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
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0BA698] hover:bg-[#08957d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0BA698]"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

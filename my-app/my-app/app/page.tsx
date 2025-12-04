"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Landing() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleExploreEvents = () => {
    if (user) {
      router.push("/events");
    } else {
      router.push("/login");
    }
  };

  const handleCreateEvent = () => {
    if (user) {
      router.push("/create-event");
    } else {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] flex items-center justify-center px-6 py-12">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] flex items-center justify-center px-6 py-12">
      <div className="relative max-w-3xl w-full text-center text-white animate-fade-in">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#0ea5a4] via-transparent to-transparent opacity-20 blur-2xl" />

        <h1 className="text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
          Spark! Bytes
        </h1>
        <div className="w-24 h-1 bg-cyan-500 mx-auto mb-6 rounded-full" />

        <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto">
          Discover tasty pop-ups, food events, and campus gatherings — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={handleExploreEvents}
            className="px-6 py-3 w-48 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold rounded-lg shadow-lg hover:scale-105 transition"
          >
            Explore Events
          </button>
          <button
            onClick={handleCreateEvent}
            className="px-6 py-3 w-48 border border-gray-600 text-white rounded-lg hover:bg-white/10 transition"
          >
            Create an Event
          </button>
        </div>

        <button
          onClick={() => router.push("/about")}
          className="text-gray-400 hover:text-cyan-400 transition text-sm"
        >
          Learn more about Spark! Bytes
        </button>

        {/* Debug info removed - now handled in Navbar via UserMenu */}
      </div>
    </main>
  );
}

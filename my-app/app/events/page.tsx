"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Events from "../components/Events";

export default function EventsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-[#071130] to-[#021428] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#071130] to-[#021428] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto text-center animate-fade-in">
        {/* Header */}
        <h2 className="text-4xl font-extrabold mb-2 tracking-tight">Events</h2>
        <div className="w-16 h-1 bg-cyan-500 mx-auto mb-6 rounded-full" />
        <p className="text-gray-400 text-lg mb-10">
          Browse and filter upcoming food events across campus
        </p>

        {/* Events Component */}
        <div className="bg-[#0f172a] rounded-lg shadow-lg p-4">
          <Events />
        </div>
      </div>
    </main>
  );
}

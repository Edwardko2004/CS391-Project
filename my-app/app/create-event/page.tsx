"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Tags from "../components/Tags";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../components/MapPicker"), {
  ssr: false,
});

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [coords, setCoords] = useState({
    lat: null as number | null,
    lng: null as number | null,
  });
  const [form, setForm] = useState({
    title: "",
    location: "",
    capacity: "",
    status: "open",
    description: "",
    organizer: "",
    tags: [] as string[],
    date: "",
    time: "",
    time_length: "",
  });

  const handleMapSelect = (lat: number, lng: number, address: string) => {
    setCoords({ lat, lng });
    setForm({ ...form, location: address });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Character limit for description (300 characters max)
    if (name === "description") {
      if (value.length > 300) {
        return; // Don't update if exceeds limit
      }
    }

    setForm({ ...form, [name]: value });
  };

  const descriptionCharCount = useMemo(() => {
    return form.description.length;
  }, [form.description]);

  const tagArray = useMemo(() => {
    return form.tags;
  }, [form.tags]);

  const eventDateTime = useMemo(() => {
    if (!form.date || !form.time) return null;
    // create in local timezone
    const d = new Date(`${form.date}T${form.time}`);
    if (isNaN(d.getTime())) return null;
    return d;
  }, [form.date, form.time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("events").insert([
        {
          title: form.title || null,
          location: form.location || null,
          latitude: coords.lat,
          longitude: coords.lng,
          capacity: form.capacity ? parseInt(form.capacity) : null,
          status: form.status,
          created_at: new Date().toISOString(),
          description: form.description || null,
          organizer: form.organizer || null,
          tags: tagArray,
          time: eventDateTime ? eventDateTime.toISOString() : null,
          time_length: form.time_length ? parseInt(form.time_length) : null,
        },
      ]);

      if (error) throw error;

      // success
      alert("Event created successfully!");
      setForm({
        title: "",
        location: "",
        capacity: "",
        status: "open",
        description: "",
        organizer: "",
        tags: [] as string[],
        date: "",
        time: "",
        time_length: "",
      });
    } catch (err: any) {
      console.error("Error creating event:", err);
      alert("Error creating event: " + (err.message || "unknown"));
    } finally {
      setSubmitting(false);
    }
  };

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
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#071130] to-[#021428] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto text-center animate-fade-in">
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
          Create a New Event
        </h1>
        <div className="w-16 h-1 bg-cyan-500 mx-auto mb-2 rounded-full" />
        <p className="text-gray-400 text-lg mb-10">
          Share event details so others can join.
        </p>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* FORM CARD */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs text-gray-400 bg-gray-900/40 px-3 py-1 rounded-full">
                Logged in
              </div>
              <div className="text-sm text-gray-300 font-medium">
                {user.email ?? user?.user_metadata?.full_name ?? "Organizer"}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Title */}
              <div>
                <label className="text-xs text-gray-300 font-medium">
                  Event Title
                </label>
                <div className="relative mt-2">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="E.g. CAS Coffee & Code"
                    required
                    className="w-full p-3 pl-12 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  <Calendar className="absolute left-3 top-3 text-cyan-400" />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-300 font-medium">
                    Description
                  </label>
                  <span
                    className={`text-xs ${
                      descriptionCharCount >= 300
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {descriptionCharCount}/300 characters
                  </span>
                </div>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short summary + what attendees should expect"
                  rows={4}
                  className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
                />
                {descriptionCharCount >= 300 && (
                  <p className="text-xs text-red-400 mt-1">
                    Character limit reached. You cannot add more characters.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Organizer */}
                <div>
                  <label className="text-xs text-gray-300 font-medium">
                    Organizer
                  </label>
                  <div className="relative mt-2">
                    <input
                      name="organizer"
                      value={form.organizer}
                      onChange={handleChange}
                      placeholder="Organizer name"
                      className="w-full p-3 pl-10 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <Users className="absolute left-3 top-3 text-cyan-400" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs text-gray-300 font-medium">
                    Location
                  </label>
                  <div className="relative mt-2">
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="CAS Lobby"
                      required
                      className="w-full p-3 pl-10 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <MapPin className="absolute left-3 top-3 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-medium">
                    Date
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pl-10 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <Calendar className="absolute left-3 top-3 text-cyan-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium">
                    Time
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pl-10 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <Clock className="absolute left-3 top-3 text-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-medium">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    name="time_length"
                    value={form.time_length}
                    onChange={handleChange}
                    placeholder="60"
                    className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags & Status */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-xs text-gray-300 font-medium">
                    Tags
                  </label>
                  <div className="mt-2">
                    <Tags
                      tags={form.tags}
                      onChange={(selectedTags) =>
                        setForm({ ...form, tags: selectedTags })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="waitlist">Waitlist</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* PREVIEW CARD */}
          <aside className="sticky top-20">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-cyan-300">
                    Event Preview
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Live preview of what attendees will see.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {form.status === "open" ? (
                    <div className="flex items-center gap-1 text-green-300 text-sm">
                      <CheckCircle /> Open
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-300 text-sm">
                      <AlertCircle /> {form.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Card */}
              <div className="mt-6 bg-gradient-to-br from-gray-900/50 to-gray-900/30 rounded-xl p-5 border border-gray-700 overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-600 flex-shrink-0">
                    <div className="text-cyan-300 font-bold text-xl">
                      {form.title ? form.title.charAt(0).toUpperCase() : "E"}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-semibold text-white leading-tight break-words">
                      {form.title || "Untitled Event"}
                    </h4>
                    <p className="text-sm text-gray-300 mt-1 break-words">
                      {form.organizer || "Hosted by Organizer"}
                    </p>

                    <div className="mt-3 flex flex-col gap-2 text-sm text-gray-300">
                      <div className="flex items-start gap-2">
                        <Calendar
                          className="text-cyan-400 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <div className="break-words">
                          {eventDateTime
                            ? eventDateTime.toLocaleString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              })
                            : "Date & time"}
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin
                          className="text-cyan-400 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <div className="break-words">
                          {form.location || "Location"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-400 italic break-words">
                        [Description would appear here]
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="text-xs text-gray-400">Capacity</div>
                      <div className="flex-1 bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                        <div
                          style={{
                            width: "0%",
                          }}
                          className="h-full bg-cyan-400/80"
                        />
                      </div>
                      <div className="text-sm text-gray-300">
                        {form.capacity || "—"}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {tagArray.length > 0 ? (
                        tagArray.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-1 rounded-full bg-cyan-400/10 border border-cyan-600 text-cyan-100"
                          >
                            #{t}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-900/40 text-gray-400">
                          No tags yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
                <div>Created: {new Date().toLocaleDateString()}</div>
                <div className="font-medium">Preview</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

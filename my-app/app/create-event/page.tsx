"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Tags from "../components/Tags";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Hash,
  Image as ImageIcon,
} from "lucide-react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../components/MapPicker"), {
  ssr: false,
});

// Simple toast component (local to this page)
function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div
      className={`
        fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-sm font-medium
        animate-fade-in-up
        ${
          type === "success"
            ? "bg-green-600/90 text-white border border-green-500"
            : "bg-red-600/90 text-white border border-red-500"
        }
      `}
    >
      {message}
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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
    image_url: "",
    tags: [] as string[],
    date: "",
    time: "",
    time_length: "",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!error) setProfile(profileData);

      setLoading(false);
    };

    load();
  }, [router]);

  const handleMapSelect = (lat: number, lng: number, address: string) => {
    setCoords({ lat, lng });
    setForm((prev) => ({ ...prev, location: address }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 300) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const descriptionCharCount = useMemo(
    () => form.description.length,
    [form.description]
  );

  const tagArray = useMemo(() => form.tags, [form.tags]);

  const eventDateTime = useMemo(() => {
    if (!form.date || !form.time) return null;
    const d = new Date(`${form.date}T${form.time}`);
    return isNaN(d.getTime()) ? null : d;
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
          image_url: form.image_url || null,
          organizer: form.organizer || null,
          organizer_id: profile?.id || null,
          tags: tagArray,
          time: eventDateTime ? eventDateTime.toISOString() : null,
          time_length: form.time_length ? parseInt(form.time_length) : null,
        },
      ]);

      if (error) throw error;

      setToast({ message: "Event created successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);

      setForm({
        title: "",
        location: "",
        capacity: "",
        status: "open",
        description: "",
        organizer: "",
        image_url: "",
        tags: [] as string[],
        date: "",
        time: "",
        time_length: "",
      });
      setCoords({ lat: null, lng: null });
    } catch (err: any) {
      setToast({
        message: "Error: " + (err.message || "unknown"),
        type: "error",
      });
      setTimeout(() => setToast(null), 3500);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#021428] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Create a New Event
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4 rounded-full" />
          <p className="text-gray-300">Share event details so others can join</p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 items-start">
          {/* LEFT: FORM CARD */}
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl p-8 text-left">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* TITLE INPUT */}
              <div>
                <label className="text-xs text-gray-300 font-medium tracking-wide">
                  Event Title
                </label>
                <div className="relative mt-2">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="E.g. CAS Coffee & Code"
                    required
                    className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Hash className="absolute left-3 top-3 text-cyan-400" size={18} />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-300 font-medium tracking-wide">
                    Description
                  </label>
                  <span
                    className={`text-xs ${
                      descriptionCharCount >= 300
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {descriptionCharCount}/300
                  </span>
                </div>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Short summary + what attendees should expect"
                  className="w-full mt-2 p-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* ORGANIZER */}
              <div>
                <label className="text-xs text-gray-300 font-medium tracking-wide">
                  Organizer
                </label>

                <div className="relative mt-2">
                  <input
                    name="organizer"
                    value={form.organizer}
                    onChange={handleChange}
                    placeholder="Organizer name"
                    className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Users className="absolute left-3 top-3 text-cyan-400" size={18} />
                </div>
              </div>

              {/* IMAGE URL */}
              <div>
                <label className="text-xs text-gray-300 font-medium tracking-wide">
                  Image URL
                </label>
                <div className="relative mt-2">
                  <input
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/event-image.jpg"
                    className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ImageIcon className="absolute left-3 top-3 text-cyan-400" size={18} />
                </div>
              </div>

              {/* CAPACITY */}
              <div>
                <label className="text-xs text-gray-300 font-medium tracking-wide">
                  Capacity
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="Max number of attendees"
                    className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Users className="absolute left-3 top-3 text-cyan-400" size={18} />
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <label className="text-xs text-gray-300 font-medium tracking-wide">
                  Location
                </label>
                <div className="mt-2">
                  <MapPicker onSelect={handleMapSelect} />
                  <div className="relative mt-3">
                    <MapPin
                      className="absolute left-3 top-3 text-cyan-400"
                      size={18}
                    />
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Click on map or search for a place"
                      className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* DATE + TIME + DURATION */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="text-xs text-gray-300 font-medium tracking-wide">
                    Date
                  </label>
                  <div className="relative mt-2">
                    <Calendar
                      className="absolute left-3 top-3 text-cyan-400"
                      size={18}
                    />
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-xs text-gray-300 font-medium tracking-wide">
                    Time
                  </label>
                  <div className="relative mt-2">
                    <Calendar
                      className="absolute left-3 top-3 text-cyan-400"
                      size={18}
                    />
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-xs text-gray-300 font-medium tracking-wide">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    name="time_length"
                    value={form.time_length}
                    onChange={handleChange}
                    placeholder="60"
                    className="w-full mt-2 p-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* TAGS + STATUS */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-xs text-gray-300 font-medium tracking-wide">
                    Tags
                  </label>
                  <div className="relative mt-2">
                    <Hash
                      className="absolute left-3 top-3 text-cyan-400"
                      size={18}
                    />
                    <div className="pl-10">
                      <Tags
                        tags={form.tags}
                        onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium tracking-wide">
                    Status
                  </label>
                  <div className="relative mt-2">
                    <Hash
                      className="absolute left-3 top-3 text-cyan-400"
                      size={18}
                    />
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="waitlist">Waitlist</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg hover:scale-[1.03] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-b-transparent border-black rounded-full"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Event"
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: PREVIEW CARD */}
          <aside className="sticky top-20">
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl p-6">
              {/* PREVIEW HEADER */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Event Preview</h3>
                  <p className="text-xs text-purple-300 mt-1">
                    Live preview of what attendees will see
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-white text-sm bg-purple-900/60 border border-purple-600 px-2 py-1 rounded-full">
                    <CheckCircle size={16} className="text-white" />
                    {form.status === "open" ? "Open" : form.status}
                  </div>
                </div>
              </div>

              {/* IMAGE PREVIEW */}
              <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="Event image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-500/10 border border-purple-600">
                    <div className="text-purple-200 font-semibold text-lg">
                      {form.title || "Event Image Preview"}
                    </div>
                  </div>
                )}
              </div>

              {/* PREVIEW BOX */}
              <div className="mt-6 bg-gray-900/70 rounded-xl p-5 border border-gray-700">
                {/* TITLE */}
                <h4 className="text-2xl font-semibold text-white leading-tight break-words">
                  {form.title || "Untitled Event"}
                </h4>

                {/* ORGANIZER */}
                <p className="text-sm text-purple-300 mt-1 break-words">
                  {form.organizer || "Hosted by Organizer"}
                </p>

                {/* DATE & LOCATION */}
                <div className="mt-3 flex flex-col gap-3 text-sm text-white">
                  <div className="flex items-start gap-2">
                    <Calendar className="text-purple-400 mt-0.5" size={16} />
                    <div>
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
                    <MapPin className="text-purple-400 mt-0.5" size={16} />
                    <div className="text-white">
                      {form.location || "Location"}
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-4">
                  <p className="text-sm text-white italic break-words">
                    {form.description || "Description would appear here"}
                  </p>
                </div>

                {/* CAPACITY */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="text-xs text-purple-300">Capacity</div>

                  <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden border border-purple-700/50">
                    <div
                      style={{
                        width: form.capacity ? `${form.capacity}%` : "0%",
                      }}
                      className="h-full bg-purple-400/80"
                    />
                  </div>

                  <div className="text-sm text-white">
                    {form.capacity || "-"}
                  </div>
                </div>

                {/* TAGS */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {tagArray.length > 0 ? (
                    tagArray.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full bg-purple-500/10 border border-purple-600 text-purple-200"
                      >
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800/60 text-gray-400">
                      No tags yet
                    </span>
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-6 flex items-center justify-between text-xs text-purple-300">
                <div>Created: {new Date().toLocaleDateString()}</div>
                <div className="font-medium text-purple-300">Preview</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Toast Renderer */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}

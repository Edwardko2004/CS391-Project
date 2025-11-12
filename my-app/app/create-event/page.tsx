"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    location: "",
    capacity: "",
    status: "open",
    description: "",
    organizer: "",
    reserved_seats: "",
    tags: "",
    date: "",
    time: "",
    time_length: "",
    
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventDateTime = new Date(`${form.date}T${form.time}`);

    const tagArray =
    form.tags.trim() !== ""
      ? form.tags.split(",").map((tag) => tag.trim())
      : [];

    const { error } = await supabase.from("events").insert([
      {
        title: form.title,
        location: form.location,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        status: form.status,
        created_at: new Date().toISOString(),
        description: form.description || null,
        organizer: form.organizer || null,
        reserved_seats: form.reserved_seats
          ? parseInt(form.reserved_seats)
          : 0,
        tags: tagArray,
        time: eventDateTime.toISOString(),
        time_length: form.time_length ? parseInt(form.time_length) : null,
      },
    ]);

    if (error) {
      console.error("Error creating event:", error);
      alert("Error creating event: " + error.message);
    } else {
      alert("Event created successfully!");
      setForm({
        title: "",
        location: "",
        capacity: "",
        status: "open",
        description: "",
        organizer: "",
        reserved_seats: "",
        tags: "",
        date: "",
        time: "",
        time_length: "",
      });
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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-800">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Create a New Event
        </h2>
        <p className="text-center text-sm text-gray-400">
          Share event details so others can join.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event Title"
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Event Description"
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
          />

          <input
            name="organizer"
            value={form.organizer}
            onChange={handleChange}
            placeholder="Organizer Name"
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (e.g. CAS Lobby)"
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
            />
            <input
              type="number"
              name="reserved_seats"
              value={form.reserved_seats}
              onChange={handleChange}
              placeholder="Reserved Seats"
              className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="time_length"
              value={form.time_length}
              onChange={handleChange}
              placeholder="Duration (minutes)"
              className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
            />
            <input
              name="status"
              value={form.status}
              onChange={handleChange}
              placeholder="Status (e.g. open)"
              className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
            />
          </div>

          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded-md"
          />

          <button
            type="submit"
            className="w-full py-2 bg-[#0BA698] text-white font-semibold rounded-md hover:bg-[#08957d]"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

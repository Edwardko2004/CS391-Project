"use client";

import { useState } from "react";

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    food: "",
    quantity: "",
    tags: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event created:", form);
    alert("Event created! (UI only)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">Create a New Event</h2>
          <p className="mt-2 text-center text-sm text-gray-400">Share leftover food or campus event details so others can join.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="title" className="sr-only">Event Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                placeholder="Event title (e.g. Pizza Night at Warren Towers)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="sr-only">Date</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="time" className="sr-only">Time</label>
                <input
                  id="time"
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="sr-only">Location</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                placeholder="Location (e.g. CAS Lobby)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="food" className="sr-only">Food Description</label>
              <input
                id="food"
                name="food"
                value={form.food}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                placeholder="Food description (e.g. Cheese Pizza, Soda, Cookies)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="quantity" className="sr-only">Quantity Available</label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                placeholder="Quantity available (e.g. 50)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="tags" className="sr-only">Dietary Tags</label>
              <input
                id="tags"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 bg-gray-800 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#0BA698] focus:border-[#0BA698] sm:text-sm"
                placeholder="Dietary tags (e.g. vegetarian, gluten-free)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0BA698] hover:bg-[#08957d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0BA698]"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

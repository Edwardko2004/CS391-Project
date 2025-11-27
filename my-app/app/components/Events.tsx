"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Input, Select, DatePicker, Spin } from "antd";
import EventsHandler from "./EventsHandler";
import { Event } from "../types/types";
import Tags from "./Tags";
import dayjs, { Dayjs } from "dayjs";

const { Search } = Input;

const sortFunctions: Record<string, (a: Event, b: Event) => number> = {
  soonest: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  latest: (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  fullest: (a, b) =>
    b.reservations / b.capacity - a.reservations / a.capacity,
  emptiest: (a, b) =>
    a.reservations / a.capacity - b.reservations / b.capacity,
};

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [doFetch, setDoFetch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("soonest");
  const [minDate, setMinDate] = useState<string | null>(null);
  const [maxDate, setMaxDate] = useState<string | null>(null);

  useEffect(() => {
    if (!doFetch) return;
    setIsLoading(true);
    setDoFetch(false);

    async function fetchData() {
      let query = supabase
        .from("events")
        .select(`*, reservations(count)`)
        .or(
          `title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,organizer.ilike.%${searchQuery}%`
        );

      if (tags.length > 0) query = query.contains("tags", tags);
      if (minDate) query = query.gte("time", minDate);
      if (maxDate) query = query.lte("time", maxDate);

      const { data, error } = await query;

      if (error) {
        console.error("ERROR:", error);
      } else {
        console.log(JSON.stringify(data, null, 2));
        const events: Event[] = data.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          tags: event.tags,
          location: event.location,
          organizer: event.organizer,
          status: event.status,
          reservations: event.reservations?.[0]?.count ?? 0,
          capacity: event.capacity,
          time: event.time,
          time_length: event.time_length,
          created_at: event.created_at
        }));

        setEvents(events.sort(sortFunctions[sortBy]) || []);
      }

      console.log(data, error);

      setIsLoading(false);
    }

    fetchData();
  }, [doFetch]);

  const handleSearch = (search: string) => {
    setSearchQuery(search);
    setDoFetch(true);
  };

  const handleTags = (tags: string[]) => {
    setTags(tags);
    setDoFetch(true);
  };

  const handleSortSelect = (sort: string) => {
    setSortBy(sort);
    setDoFetch(true);
  };

  const handleMinDate = (_: Dayjs, dateString: string | string[]) => {
    setMinDate(
      Array.isArray(dateString) ? dateString.join(" to ") : dateString
    );
    setDoFetch(true);
  };

  const handleMaxDate = (_: Dayjs, dateString: string | string[]) => {
    setMaxDate(
      Array.isArray(dateString) ? dateString.join(" to ") : dateString
    );
    setDoFetch(true);
  };

  return (
    <div className="px-6 py-8">
      <div className="bg-[#1F2937] p-6 rounded-lg mb-6 shadow-md space-y-4">
        <Search
          placeholder="Search for events, organizers, or locations"
          onSearch={handleSearch}
          allowClear
          enterButton
          className="w-full"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            value={sortBy}
            onChange={handleSortSelect}
            options={[
              { value: "soonest", label: "Sort by soonest" },
              { value: "latest", label: "Sort by latest" },
              { value: "emptiest", label: "Sort by emptiest" },
              { value: "fullest", label: "Sort by fullest" },
            ]}
            className="w-full"
          />
          <DatePicker
            showTime
            onChange={handleMinDate}
            placeholder="Start time"
            className="w-full"
          />
          <DatePicker
            showTime
            onChange={handleMaxDate}
            placeholder="End time"
            className="w-full"
          />
          <Tags tags={tags} onChange={handleTags} />
        </div>
      </div>
      <EventsHandler events={events} loading={isLoading} />
    </div>
  );
}

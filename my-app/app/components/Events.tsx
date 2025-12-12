// components/Events.tsx
// the base foundation of the events page, handles the API list call

"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Input,
  Select,
  DatePicker,
  Switch,
  Pagination,
  ConfigProvider,
} from "antd";
import EventsHandler from "./EventsHandler";
import { Event } from "../lib/types";
import EventsTags from "./EventsTags";
import dayjs, { Dayjs } from "dayjs";

const { Search } = Input;

// table providing the sorting functions for the listing
const sortFunctions: Record<string, (a: Event, b: Event) => number> = {
  soonest: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  latest: (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  fullest: (a, b) => b.reservations / b.capacity - a.reservations / a.capacity,
  emptiest: (a, b) => a.reservations / a.capacity - b.reservations / a.capacity,
};

// Events component
export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [doFetch, setDoFetch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("soonest");
  const [minDate, setMinDate] = useState<string | null>(null);
  const [maxDate, setMaxDate] = useState<string | null>(null);
  const [showOld, setShowOld] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
      if (!showOld) query = query.gte("time", new Date().toISOString());

      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data, error } = await query;

      if (error) {
        console.error("ERROR:", error);
      } else {
        let events: Event[] = data.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          tags: event.tags,
          location: event.location,
          organizer: event.organizer,
          status: event.status,
          longitude: event.longitude,
          latitude: event.latitude,
          organizer_id: event.organizer_id,
          reservations: event.reservations?.[0]?.count ?? 0,
          capacity: event.capacity,
          time: event.time,
          time_length: event.time_length,
          created_at: event.created_at,
          image_url: event.image_url,
        }));

        setTotal(events.length);

        events = events.sort(sortFunctions[sortBy]);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        events = events.slice(start, end);

        setEvents(events || []);
      }

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

  const handleSwitch = (b: boolean) => {
    setShowOld(b);
    setDoFetch(true);
  };

  const handlePagination = (p: number, s: number) => {
    setPage(p);
    setPageSize(s);
    setDoFetch(true);
  };

  return (
    <div className="px-6 py-8">
      {/* Local AntD theming just for filter controls */}
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#1f2937", // dark input bg
            colorBorder: "#374151", // border
            colorText: "#e5e7eb", // text
            colorTextPlaceholder: "#9ca3af", // placeholder
            borderRadius: 8,
            colorPrimary: "#2eabf2", // main accent
          },
          components: {
            Input: {
              colorBgContainer: "#1f2937",
              colorBorder: "#374151",
              colorText: "#e5e7eb",
              colorTextPlaceholder: "#9ca3af",
              activeBorderColor: "#2eabf2",
              hoverBorderColor: "#2eabf2",
              borderRadius: 8,
            },
            Button: {
              colorPrimary: "#2eabf2", // Search button
              colorPrimaryHover: "#53c7ff",
              colorPrimaryActive: "#1d95d6",
              borderRadius: 8,
            },
            Select: {
              colorBgContainer: "#1f2937",
              colorBorder: "#374151",
              colorText: "#e5e7eb",
              borderRadius: 8,
            },
            DatePicker: {
              colorBgContainer: "#1f2937",
              colorBorder: "#374151",
              colorText: "#e5e7eb",
              borderRadius: 8,
            },
          },
        }}
      >
        <div
          className="bg-gradient-to-b
            from-[#0f172a]
            via-[#0b1220]
            to-[#021428]
            p-6
            rounded-lg
            mb-6
            shadow-md
            space-y-4
            border
            border-[#374151]"
        >
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
            <EventsTags tags={tags} onChange={handleTags} />

            {/* Tailwind toggle that matches Settings page */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOld}
                  onChange={(e) => handleSwitch(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="
                    w-11 h-6 
                    bg-gray-700 
                    rounded-full 
                    peer-focus:outline-none
                    peer
                    peer-checked:after:translate-x-full
                    peer-checked:after:border-white
                    after:content-[''] 
                    after:absolute 
                    after:top-[2px] 
                    after:left-[2px] 
                    after:bg-white 
                    after:border 
                    after:border-gray-300 
                    after:rounded-full 
                    after:h-5 
                    after:w-5 
                    after:transition-all
                    peer-checked:bg-[#2eabf2]
                  "
                ></div>
              </label>
              <span className="text-sm text-gray-300">
                {showOld ? "Show Old" : "Upcoming"}
              </span>
            </div>
          </div>
        </div>
      </ConfigProvider>

      <EventsHandler events={events} loading={isLoading} />

      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          total={total}
          showSizeChanger
          onChange={handlePagination}
        />
      </div>
    </div>
  );
}

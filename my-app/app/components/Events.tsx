// components/Events.tsx
// the base foundation of the events page, handles the API list call

"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Input, Select, DatePicker, Switch } from "antd";
import EventsHandler from "./EventsHandler";
import { Event } from "../lib/types";
import Tags from "./Tags";
import dayjs, { Dayjs } from "dayjs";

const { Search } = Input;

// table providing the sorting functions for the listing
const sortFunctions: Record<string, (a: Event, b: Event) => number> = {
  soonest: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  latest: (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  fullest: (a, b) =>
    b.reservations / b.capacity - a.reservations / a.capacity,
  emptiest: (a, b) =>
    a.reservations / a.capacity - b.reservations / b.capacity,
};

// Events component
export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");           // the search query for events
  const [events, setEvents] = useState<Event[]>([]);            // the list of events
  const [doFetch, setDoFetch] = useState(true);                 // checks if we need to query the DB
  const [isLoading, setIsLoading] = useState(false);            // checks if the query is ongoing
  const [tags, setTags] = useState<string[]>([]);               // list of tags to search for events
  const [sortBy, setSortBy] = useState("soonest");              // the function we want to sort by
  const [minDate, setMinDate] = useState<string | null>(null);  // the minimum date an event starts
  const [maxDate, setMaxDate] = useState<string | null>(null);  // the maximum date an event starts
  const [showOld, setShowOld] = useState(false);                // show old events that have passed

  // useeffect to initialize the first API call
  useEffect(() => {
    if (!doFetch) return; // if we dont need to fetch
    setIsLoading(true);   // set loading to true
    setDoFetch(false);    // so we dont keep fetching

    // calls the supabase API for the list of events
    async function fetchData() {
      let query = supabase
        .from("events")
        .select(`*, reservations(count)`)
        .or(
          `title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,organizer.ilike.%${searchQuery}%`
        );

      // apply the filters to the query
      if (tags.length > 0) query = query.contains("tags", tags);
      if (minDate) query = query.gte("time", minDate);
      if (maxDate) query = query.lte("time", maxDate);
      if (!showOld) query = query.gte("time", new Date().toISOString());

      // retrieve the data from the query
      const { data, error } = await query;

      if (error) {
        console.error("ERROR:", error);
      } else {
        // map the data we got into a list of events
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

        // set the events and then set events to the list
        setEvents(events.sort(sortFunctions[sortBy]) || []);
      }

      setIsLoading(false);  // we are done fetching data
    }

    fetchData();
  }, [doFetch]);

  // begin a query to the API after we input into the searchbar
  const handleSearch = (search: string) => {
    setSearchQuery(search);
    setDoFetch(true);
  };

  // begin a query to the API after we serach by tags
  const handleTags = (tags: string[]) => {
    setTags(tags);
    setDoFetch(true);
  };

  // begin a query to the API after we search by sorting
  const handleSortSelect = (sort: string) => {
    setSortBy(sort);
    setDoFetch(true);
  };

  // begin a query to the API when looking for the minimum date
  const handleMinDate = (_: Dayjs, dateString: string | string[]) => {
    setMinDate(
      Array.isArray(dateString) ? dateString.join(" to ") : dateString
    );
    setDoFetch(true);
  };

  // begin a query to the API when looking for the maximum date
  const handleMaxDate = (_: Dayjs, dateString: string | string[]) => {
    setMaxDate(
      Array.isArray(dateString) ? dateString.join(" to ") : dateString
    );
    setDoFetch(true);
  };

  // begin a query to show old events that have passed
  const handleSwitch = (b: boolean) => {
    setShowOld(b);
    setDoFetch(true);
  }

  // return the final component
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
          <Switch checkedChildren="Show Old" unCheckedChildren="New Only" onChange={handleSwitch}/>
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

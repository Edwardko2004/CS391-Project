// components/EventsHandler.tsx
// handles the list of event cards, as well as the reservation of said events

import React from "react";
import { Row, Spin } from "antd";
import { Event, Profile } from "../lib/types";
import EventCard from "./EventCard";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSupabaseAuth } from "../lib/SupabaseProvider";

// props for the event list
interface EventsHandlerProp {
  events: Event[];
  loading: boolean;
}

// returns a grid/list of eventcards and manages them
const EventsHandler: React.FC<EventsHandlerProp> = ({ events, loading }) => {
  // return something else if we are loading (placeholder component)
  if (loading) {
    return (
      <main className="flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </main>
    );
  }

  // if there are no events found, tell the user (placeholder component)
  if (events.length == 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        No events found. Try adjusting your filters.
      </div>
    );
  }

  // return the full component
  return (
    <>
      <Row gutter={[16, 16]}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </Row>
    </>
  );
};

export default EventsHandler;

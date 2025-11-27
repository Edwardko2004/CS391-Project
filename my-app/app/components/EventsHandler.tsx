import React from "react";
import { Row, Space, Spin, Typography } from "antd";
import { Event, Profile } from "../types/types";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";

import { supabase } from "../lib/supabaseClient";
import { useSupabaseAuth } from "../lib/SupabaseProvider";

// props for the event list
interface EventsHandlerProp {
    events: Event[];
    loading: boolean;
}

// returns a grid/list of eventcards and manages them
const EventsHandler: React.FC<EventsHandlerProp> = ({ events, loading }) => {
    const {user} = useSupabaseAuth();
    const [profile, setProfile] = useState<Profile | null>(null);

    // handle creating a reservation when clicking on a card
    const handleReserve = async (e: Event) => {
        const fetchProfile = async () => {
            if (user) {
                const {data, error} = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (error) {
                    console.error('Error fetching profile:', error);
                    setProfile(null);
                } else {
                    setProfile(data);
                }
            } else {
                setProfile(null);
            }
        }

        fetchProfile();

        if (profile != null) {
            const {error} = await supabase.from("reservations").insert([
                {
                    event_id: e.id,
                    profile_id: profile.id,
                },
            ]);

            if (error) {
                console.error("Error creating reservation:", error);
                alert("Issue creating reservation");
            } else {
                alert("Seat reserved successfully!");
            }
        }
    }

    // return something else if we are loading (placeholder component)
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        )
    }

    // if there are no events found, tell the user (placeholder component)
    if (events.length == 0) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
                No events found. Try adjusting your filters.
            </div>
        )
    }

    // actual content
    return (
        <Row gutter={[16, 16]}>
            {events.map((event) =>
                <EventCard 
                    key={event.id} 
                    event={event} 
                    handleReserve={handleReserve}
                />
            )}
        </Row>
    );
}

export default EventsHandler;
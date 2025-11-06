"use client"
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Input, Tag } from "antd";
import EventList from "./EventList";
import { Event } from "../types/types";

const { Search } = Input;

export default function Events() {
    const [searchQuery, setSearchQuery] = useState('')  // search query for database
    const [events, setEvents] = useState<Event[]>([]);  // list of events from supabase
    const [doFetch, setDoFetch] = useState(true);       // temporary solution for dependency array
    const [isLoading, setIsLoading] = useState(false);  // if the query is still loading
    
    useEffect(() => {
        if (!doFetch) return;   // do not query if we dont have to

        setIsLoading(true);
        setDoFetch(false);

        // fetches data by querying supabase database
        async function fetchData() {
            const {data, error} = await supabase
            .from('events')
            .select('*')
            .or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,organizer.ilike.%${searchQuery}%`);

            if (error) {
                console.error('ERROR:', error);
            } else{
                setEvents(data||[]);
            }

            setIsLoading(false);
        }

        fetchData()
    }, [doFetch])

    // function to handle search query
    const handleSearch = (search: string) => {
        setSearchQuery(search);
        setDoFetch(true);
    }

    return (
        <div style={{padding:'64px'}}>
            {/*search bar*/}
            <Search 
                style={{padding:16}}
                placeholder="Search for events, organizations, or locations"
                onSearch={handleSearch}
                allowClear
                enterButton
            />
            {/*tags (not implemented yet)*/}
            {/*event listing, pass events into the list to display*/}
            <EventList events={events} loading={isLoading} />
        </div>
    )
}
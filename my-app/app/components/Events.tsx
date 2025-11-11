"use client"
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Input } from "antd";
import EventList from "./EventList";
import { Event } from "../types/types";
import Tags from "./Tags";

const { Search } = Input;

export default function Events() {
    const [searchQuery, setSearchQuery] = useState('')  // search query for database
    const [events, setEvents] = useState<Event[]>([]);  // list of events from supabase
    const [doFetch, setDoFetch] = useState(true);       // temporary solution for dependency array
    const [isLoading, setIsLoading] = useState(false);  // if the query is still loading
    const [tags, setTags] = useState<string[]>([]);     // tags used for category searching
    
    useEffect(() => {
        if (!doFetch) return;   // do not query if we dont have to

        setIsLoading(true);
        setDoFetch(false);

        // fetches data by querying supabase database
        async function fetchData() {
            let query = supabase.from('events').select('*')
            .or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,organizer.ilike.%${searchQuery}%`);

            if (tags.length > 0) {
                query = query.contains("categories", tags);
            }

            const {data, error} = await query;

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

    const handleTags = (tags: string[]) => {
        setTags(tags);
        setDoFetch(true);
    }

    return (
        <div style={{padding:'64px', paddingTop:0}}>
            {/*search bar*/}
            <Search 
                style={{padding:16}}
                placeholder="Search for events, organizations, or locations"
                onSearch={handleSearch}
                allowClear
                enterButton
            />
            {/*tags*/}
            <Tags tags={tags} onChange={handleTags} />
            {/*event listing, pass events into the list to display*/}
            <EventList events={events} loading={isLoading} />
        </div>
    )
}
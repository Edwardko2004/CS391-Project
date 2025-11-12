"use client"
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Input, Select, DatePicker } from "antd";
import EventList from "./EventList";
import { Event } from "../types/types";
import Tags from "./Tags";
import dayjs, { Dayjs } from 'dayjs';

const now: Dayjs = dayjs();
const { Search } = Input;

// the corresponding sorting functions
const sortFunctions: Record<string, (a: Event, b: Event) => number> = {
    "soonest": (a: Event, b: Event) => new Date(a.time).getMinutes() - new Date(b.time).getMinutes(),
    "latest": (a: Event, b: Event) => new Date(b.time).getMinutes() - new Date(a.time).getMinutes(),
    "fullest": (a: Event, b: Event) => (b.reserved_seats / b.capacity) - (a.reserved_seats / a.capacity),
    "emptiest": (a: Event, b: Event) => (a.reserved_seats / a.capacity) - (b.reserved_seats / b.capacity),
}

export default function Events() {
    const [searchQuery, setSearchQuery] = useState('')  // search query for database
    const [events, setEvents] = useState<Event[]>([]);  // list of events from supabase
    const [doFetch, setDoFetch] = useState(true);       // temporary solution for dependency array
    const [isLoading, setIsLoading] = useState(false);  // if the query is still loading
    const [tags, setTags] = useState<string[]>([]);     // tags used for category searching
    const [sortBy, setSortBy] = useState("soonest");    // sortby type for the query
    const [minDate, setMinDate] = useState<string|null>(null);         // the minimum date for events
    const [maxDate, setMaxDate] = useState<string|null>(null);         // the maximum date for events
    
    useEffect(() => {
        if (!doFetch) return;   // do not query if we dont have to

        setIsLoading(true);
        setDoFetch(false);

        // fetches data by querying supabase database
        async function fetchData() {
            let query = supabase.from('events').select('*')
            .or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,organizer.ilike.%${searchQuery}%`);

            if (tags.length > 0) {
                query = query.contains('tags', tags);
            }

            if (minDate) {
                query = query.gte('time', minDate);
            }

            if (maxDate) {
                query = query.lte('time', maxDate);
            }

            const {data, error} = await query;

            if (error) {
                console.error('ERROR:', error);
            } else {
                setEvents(data.sort(sortFunctions[sortBy])||[]);
            }

            setIsLoading(false);
        }

        fetchData();
    }, [doFetch])

    // function to handle search query
    const handleSearch = (search: string) => {
        setSearchQuery(search);
        setDoFetch(true);
    }

    // handle the tag system to query
    const handleTags = (tags: string[]) => {
        console.log("handling tags")
        setTags(tags);
        setDoFetch(true);
    }

    // handle the sort select component
    const handleSortSelect = (sort: string) => {
        setSortBy(sort);
        setDoFetch(true);
    }

    // handle the mindate changes
    const handleMinDate = (date: Dayjs, dateString: string | string[]): void => {
        if (Array.isArray(dateString)) {
            setMinDate(dateString.join(' to '));
        } else {
            setMinDate(dateString);
        }
        setDoFetch(true);
    }

    // handle the mindate changes
    const handleMaxDate = (date: Dayjs, dateString: string | string[]): void => {
        if (Array.isArray(dateString)) {
            setMaxDate(dateString.join(' to '));
        } else {
            setMaxDate(dateString);
        }
        setDoFetch(true);
    }

    return (
        <div style={{padding:'64px', paddingTop:0}}>
            {/*querying systems*/}
            {/*im not gonna bother styling it for now, ill leave it up to the frontend developers -aidan*/}
            <Search 
                placeholder="Search for events, organizations, or locations"
                onSearch={handleSearch}
                allowClear
                enterButton
            />
            <Select
                defaultValue="soonest"
                value={sortBy}
                onChange={handleSortSelect}
                options={[
                    { value: 'soonest', label: 'Sort by soonest' },
                    { value: 'latest', label: 'Sort by latest' },
                    { value: 'emptiest', label: 'Sort by emptiest' },
                    { value: 'fullest', label: 'Sort by fullest' },
                ]}
            />
            <DatePicker
                showTime
                onChange={handleMinDate}
                placeholder="Minimum time"
            />
            <DatePicker
                showTime
                onChange={handleMaxDate}
                placeholder="Maximum time"
            />
            <Tags tags={tags} onChange={handleTags} />
            {/*event listing, pass events into the list to display*/}
            <EventList events={events} loading={isLoading} />
        </div>
    )
}
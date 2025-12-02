// components/UserReservedEvents.tsx
// provides a listing of all events reserved by a user

import * as Type from "../lib/types";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Table } from "antd";

// props for the reserved list
interface ReservedEventsProp {
    profile: Type.Profile | null;
}

// UserReservedEvents component
const UserReservedEvents: React.FC<ReservedEventsProp> = ({ profile }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [doQuery, setDoQuery] = useState(true);

    // useeffect to initialize the API call
    useEffect(() => {
        // async function that makes the call
        async function fetchData() {
            // dont make call if profile is null or we dont have to
            if (profile === null || doQuery === false) return;

            setLoading(true);
            setDoQuery(false);

            // find all reservations with the user and attach the event to it
            let query = supabase
                .from('reservations')
                .select('*, events(*)')
                .eq('profile_id', profile.id);

            // fetch the data
            const {data, error} = await query;

            console.log(data);

            if (error) {
                console.error(error);
            } else {
                // turn data into the list of events and set it
                const list: Event[] = data.map(r => r.events)
                setEvents(list);
            }

            setLoading(false);
        }

        fetchData()
    }, [doQuery])

    // return the final component
    return (
        <Table
            loading={loading}
            dataSource={events}
            columns = {[
                {
                    title: "Title",
                    dataIndex: "title",
                },
                {
                    title: "Time",
                    dataIndex: "time",
                }
            ]}
            rowKey={"id"}
            pagination={false}
        />
    )
}

export default UserReservedEvents;
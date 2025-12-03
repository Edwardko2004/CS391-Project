// components/UserReservedEvents.tsx
// provides a listing of all events reserved by a user

import * as Type from "../lib/types";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Table, Tabs } from "antd";

const {TabPane} = Tabs;

// props for the reserved list
interface ReservedEventsProp {
    profile: Type.Profile | null;
}

// UserReservedEvents component
const UserReservedEvents: React.FC<ReservedEventsProp> = ({ profile }) => {
    const [events, setEvents] = useState<Type.Event[]>([]);
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
                const list: Type.Event[] = data.map(r => r.events)
                setEvents(list);
            }

            setLoading(false);
        }

        fetchData()
    }, [doQuery])

    const now = new Date();
    const past = events.filter((e: Type.Event) => new Date(e.time) < now);
    const upcoming = events.filter((e: Type.Event) => new Date(e.time) >= now);

    // return the final component
    return (
        <Tabs
            type="card"
            defaultActiveKey="1"
        >
            <TabPane tab="Upcoming" key="1">
                <Table
                    loading={loading}
                    dataSource={upcoming}
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
            </TabPane>
            <TabPane tab="Past" key="2">
                <Table
                    loading={loading}
                    dataSource={past}
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
            </TabPane>
        </Tabs>
    )
}

export default UserReservedEvents;
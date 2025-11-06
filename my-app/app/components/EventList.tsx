import React from "react";
import { Row, Space, Spin, Typography } from "antd";
import { Event } from "../types/types";
import EventCard from "./EventCard";

// props for the event list
interface EventListProp {
    events: Event[];
    loading: boolean;
}

// returns a grid/list of eventcards
const EventList: React.FC<EventListProp> = ({ events, loading }) => {
    // return something else if we are loading (placeholder component)
    if (loading) {
        return (
            <Space style={{width: '100%', justifyContent: 'center'}}>
                <Spin size="large"/>
            </Space>
        )
    }

    // if there are no events found, tell the user (placeholder component)
    if (events.length == 0) {
        return (
            <Space style={{width: '100%', justifyContent: 'center'}}>
                No events found!
            </Space>
        )
    }

    // actual content
    return (
        <Row gutter={[16, 16]}>
            {events.map((event) =>
                <EventCard key={event.id} event={event} />
            )}
        </Row>
    );
}

export default EventList;
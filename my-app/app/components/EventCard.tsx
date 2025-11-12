import React from "react";
import { Card, Col, Typography, Button, Progress, Row, Tag } from "antd";
import { Event } from "../types/types";
import { CheckCircleOutlined, ClockCircleOutlined, FireOutlined, StopOutlined } from "@ant-design/icons";
import { format } from "path";
import tags from "../lib/tag";

// store some style data for specific event status
const availabilityInfo = {
    high: {
        color: "#10b981",
        label: "Plenty Available",
        icon: CheckCircleOutlined,
    },
    medium: {
        color: "#f59e0b",
        label: "Limited Seats",
        icon: ClockCircleOutlined,
    },
    low: {
        color: "#ef4444",
        label: "Almost Gone!",
        icon: FireOutlined,
    },
    out: {
        color: "#6b7280",
        label: "Fully Reserved",
        icon: StopOutlined,
    },
}

// return string representation of event status
const getAvailability = (percent: number) => {
    if (percent < 60) return "high";
    if (percent < 80) return "medium";
    if (percent < 100) return "low";

    return "out"
}

const getFoodColor = (tag: string) => {
    return tags[tag as keyof typeof tags] || tags.other;
};

// props for the event card
interface EventCardProp {
    event: Event;
}

// a single card that displays information about an event
const EventCard: React.FC<EventCardProp> = ({ event }) => {
    const reservedPercent = (event.reserved_seats / event.capacity) * 100;
    const availability = availabilityInfo[getAvailability(reservedPercent)];
    const seatsLeft = event.capacity - event.reserved_seats;
    const date = new Date(event.time);

    // set of tags applicable to the event
    const TagList = () => {
        return (
            <div style={{marginBottom:8}}>
                {event.tags.map((tag, index) => (
                    <Tag
                        key={index}
                        color={getFoodColor(tag).color}
                    >
                        {tag}
                    </Tag>
                ))}
            </div>
        )
    }

    // component giving information of the status of an event
    const EventStatus = () => {
        return (
            <>
                <Row justify="space-between" style={{ width: '100%' }}>
                    <Col>
                        <Typography.Text style={{color:availability.color}}>
                            <availability.icon /> {availability.label}
                        </Typography.Text>
                    </Col>
                    <Col>
                        <Typography.Text style={{color:"#97a5adff"}}>
                            {event.reserved_seats} / {event.capacity} reserved
                        </Typography.Text>
                    </Col>
                </Row>
                <Progress 
                    percent={reservedPercent}
                    strokeColor={availability.color}
                    showInfo={false}
                    trailColor="#1F2937"
                />
            </>
        )
    }

    // component for status icon
    const StatusIcon = () => {
        return (
            <Tag icon={<availability.icon />} color={availability.color}>
                {seatsLeft} seats left
            </Tag>
        )
    }

    // component for displaying event info
    const EventInfo = () => {
        const formatted_date = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });

        const formatted_time = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        const end_date = new Date(event.time);
        end_date.setMinutes(end_date.getMinutes() + event.time_length);

        const formatted_endtime = end_date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        return (
            <Typography.Paragraph style={{color:"#FFFFFF"}}>
                <br />
                <p>{event.description}</p>
                <p><strong className="cardinfo">Organizer: </strong>{event.organizer}</p>
                <p><strong className="cardinfo">Location: </strong>{event.location}</p>
                <p>
                    <strong className="cardinfo">Time: </strong>
                    {formatted_date}, {formatted_time} to {formatted_endtime}
                </p>
            </Typography.Paragraph>
        )
    }

    return (
        <Col xs={24} sm={12} md={8}>
            <Card
                styles={{
                    body: { backgroundColor: '#111827' },
                    header: { backgroundColor: '#1F2937', color: "#ffffff" },
                }}
                title={event.title}
                extra={<StatusIcon />}
            >
                <TagList />
                <EventStatus />
                <EventInfo />
                <Button block>
                    Reserve a seat
                </Button>
            </Card>
        </Col>
    );
}

export default EventCard;
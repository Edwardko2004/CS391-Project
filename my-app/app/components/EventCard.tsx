import React from "react";
import { Card, Col, Typography, Button, Progress, Row, Tag } from "antd";
import { Event } from "../types/types";
import { CheckCircleOutlined, ClockCircleOutlined, FireOutlined, StopOutlined } from "@ant-design/icons";

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

// props for the event card
interface EventCardProp {
    event: Event;
}

// a single card that displays information about an event
const EventCard: React.FC<EventCardProp> = ({ event }) => {
    const reservedPercent = (event.reserved_seats / event.capacity) * 100;
    const availability = availabilityInfo[getAvailability(reservedPercent)];
    const seatsLeft = event.capacity - event.reserved_seats;

    // set of tags applicable to the event
    const TagList = () => {
        return (
            <div style={{marginBottom:8}}>
                {event.categories.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
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
        return (
            <Typography.Paragraph style={{color:"#FFFFFF"}}>
                <br />
                <p>{event.description}</p>
                <p><strong className="cardinfo">Organizer: </strong>{event.organizer}</p>
                <p><strong className="cardinfo">Location: </strong>{event.location}</p>
                <p><strong className="cardinfo">Time: </strong>{event.time}</p>
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
                variant="borderless"
                hoverable={true}
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
// components/EventCard.tsx
// component that renders a single event card for the events listing

import React from "react";
import { Card, Col, Typography, Button, Progress, Row, Tag } from "antd";
import { Event } from "../lib/types";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  StopOutlined,
} from "@ant-design/icons";
import tags from "../lib/tag";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { availabilityInfo, getAvailability } from "../lib/cardUtil";

// returns the color of an existing tag
const getFoodColor = (tag: string) => {
  return tags[tag as keyof typeof tags] || tags.other;
};

// the properties to pass into an event card
interface EventCardProp {
  event: Event;
  handleReserve: (e: Event) => void;
}

// EventCard component
const EventCard: React.FC<EventCardProp> = ({ event, handleReserve }) => {
  const reservedPercent = (event.reservations / event.capacity) * 100;      // percent of an event's capacity
  const availability = availabilityInfo[getAvailability(reservedPercent)];  // info and styling of availiability
  const date = new Date(event.time);    // date object storing the event's date
  const router = useRouter();           // router to redirect the page to the detailed page

  // shows the list of tags associated with this event
  const TagList = () => (
    <div style={{ marginBottom: 8 }}>
      {event.tags.map((tag, index) => (
        <Tag key={index} color={getFoodColor(tag).color}>
          {tag}
        </Tag>
      ))}
    </div>
  );

  // provides info of the availability of the event
  const EventStatus = () => (
    <>
      <Row justify="space-between" style={{ width: "100%" }}>
        <Col>
          <Typography.Text style={{ color: availability.color }}>
            <availability.icon /> {availability.label}
          </Typography.Text>
        </Col>
        <Col>
          <Typography.Text style={{ color: "#97a5adff" }}>
            {event.reservations} / {event.capacity} reserved
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
  );

  // icon with availability info of an event
  const StatusIcon = () => (
    <Tag icon={<availability.icon />} color={availability.color}>
      {event.capacity - event.reservations} seats left
    </Tag>
  );

  // provide info on the date, time, location, and organizer of the event
  const EventInfo = () => {
    // reformat the time and date into something more readable
    const formatted_date = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const formatted_time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // find the end time by adding event length to starting time
    const end_date = new Date(event.time);
    end_date.setMinutes(end_date.getMinutes() + event.time_length);

    const formatted_endtime = end_date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <Typography.Paragraph style={{ color: "#FFFFFF" }}>
        <br />
        <p>{event.description}</p>
        <p>
          <strong className="cardinfo">Organizer: </strong>
          {event.organizer}
        </p>
        <p>
          <strong className="cardinfo">Location: </strong>
          {event.location}
        </p>
        <p>
          <strong className="cardinfo">Time: </strong>
          {formatted_date}, {formatted_time} to {formatted_endtime}
        </p>
      </Typography.Paragraph>
    );
  };

  // handle reservations when clicking on the card's reserve button
  const handleButtonClick = () => {
    handleReserve(event);
  };

  // handle showing the detail view of the event when clicking on its card
  const handleCardClick = () => {
    router.push(`/events/${event.id}`)
  };

  // return the full component
  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        className="bg-[#111827] border border-[#2A2A2A] text-white rounded-lg shadow-md transition-transform hover:scale-[1.02]"
        title={<span className="text-white font-semibold">{event.title}</span>}
        onClick={handleCardClick}
        extra={<StatusIcon />}
      >
        <TagList />
        <EventStatus />
        <EventInfo />
        <Button
          block
          className="bg-[#0BA698] text-white font-semibold hover:bg-[#08957d] mt-4"
          onClick={handleButtonClick}
        >
          Reserve a seat
        </Button>
      </Card>
    </Col>
  );
};

export default EventCard;
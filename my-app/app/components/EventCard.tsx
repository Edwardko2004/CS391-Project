import React from "react";
import { Card, Col, Typography, Button, Progress, Row, Tag } from "antd";
import { Event } from "../types/types";
import { CheckCircleOutlined, ClockCircleOutlined, FireOutlined, StopOutlined } from "@ant-design/icons";
import tags from "../lib/tag";

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
};

const getAvailability = (percent: number) => {
  if (percent < 60) return "high";
  if (percent < 80) return "medium";
  if (percent < 100) return "low";
  return "out";
};

const getFoodColor = (tag: string) => {
  return tags[tag as keyof typeof tags] || tags.other;
};

interface EventCardProp {
  event: Event;
  handleReserve: (e: Event) => void;
}

const EventCard: React.FC<EventCardProp> = ({ event, handleReserve }) => {
  const reservedPercent = (event.reserved_seats / event.capacity) * 100;
  const availability = availabilityInfo[getAvailability(reservedPercent)];
  const seatsLeft = event.capacity - event.reserved_seats;
  const date = new Date(event.time);

  const TagList = () => (
    <div style={{ marginBottom: 8 }}>
      {event.tags.map((tag, index) => (
        <Tag key={index} color={getFoodColor(tag).color}>
          {tag}
        </Tag>
      ))}
    </div>
  );

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
  );

  const StatusIcon = () => (
    <Tag icon={<availability.icon />} color={availability.color}>
      {seatsLeft} seats left
    </Tag>
  );

  const EventInfo = () => {
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

  const handleClick = () => {
    handleReserve(event);
  }

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        className="bg-[#111827] border border-[#2A2A2A] text-white rounded-lg shadow-md transition-transform hover:scale-[1.02]"
        title={<span className="text-white font-semibold">{event.title}</span>}
        extra={<StatusIcon />}
      >
        <TagList />
        <EventStatus />
        <EventInfo />
        <Button 
          block
          className="bg-[#0BA698] text-white font-semibold hover:bg-[#08957d] mt-4"
          onClick={handleClick}
        >
          Reserve a seat
        </Button>
      </Card>
    </Col>
  );
};

export default EventCard;

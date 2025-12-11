// components/EventCard.tsx
// Renders a single event card styled like the CreateEvent preview card

import React from "react";
import { Card, Col, Typography, Button, Progress, Row } from "antd";
import { Event } from "../lib/types";
import { useRouter } from "next/navigation";
import { availabilityInfo, getAvailability } from "../lib/cardUtil";

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const router = useRouter();

  const reservedPercent =
    event.capacity && event.capacity > 0
      ? (event.reservations / event.capacity) * 100
      : 0;

  const availability =
    availabilityInfo[
      getAvailability(reservedPercent, new Date().toISOString() > event.time)
    ];

  const seatsLeft =
    event.capacity && event.capacity > 0
      ? event.capacity - event.reservations
      : null;

  const seatsLabel =
    seatsLeft === null ? "Seats TBD" : `${seatsLeft} seats left`;

  const date = new Date(event.time);
  const mainTag = event.tags?.[0];

  const handleCardClick = () => {
    router.push(`/events/${event.id}`);
  };

  const EventStatus = () => (
    <>
      <Row justify="space-between" style={{ width: "100%", marginBottom: 8 }}>
        <Col>
          <Typography.Text style={{ color: "#86efac", fontWeight: 600 }}>
            <availability.icon /> {availability.label}
          </Typography.Text>
        </Col>
        <Col>
          <Typography.Text style={{ color: "#94a3b8" }}>
            {event.reservations} / {event.capacity ?? "—"} reserved{" "}
            {seatsLeft !== null && `(${seatsLeft} left)`}
          </Typography.Text>
        </Col>
      </Row>

      <Progress
        percent={reservedPercent}
        strokeColor="#86efac"
        trailColor="#1e293b"
        showInfo={false}
        style={{ marginBottom: 12 }}
      />
    </>
  );

  const EventInfo = () => {
    const formattedStartDateTime = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const endDate = new Date(event.time);
    endDate.setMinutes(endDate.getMinutes() + event.time_length);

    const formattedEndTime = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <Typography.Paragraph
        style={{
          color: "#bfc7d5",
          marginBottom: 0,
          marginTop: 10,
          fontSize: 13,
        }}
      >
        <p className="mb-2 line-clamp-3">{event.description}</p>

        <p className="mb-1">
          <strong className="text-white">Location:</strong> {event.location}
        </p>

        <p className="mb-0">
          <strong className="text-white">Time:</strong> {formattedStartDateTime}{" "}
          – {formattedEndTime}
        </p>
      </Typography.Paragraph>
    );
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        onClick={handleCardClick}
        className="
          bg-gradient-to-br from-gray-900/50 to-gray-900/30
          border border-gray-700
          rounded-xl
          text-white
          shadow-xl
          transition-transform
          hover:scale-[1.02]
          overflow-hidden
        "
        cover={
          event.image_url && (
            <img
              src={event.image_url}
              alt="Event"
              draggable={false}
              style={{
                height: 135,
                objectFit: "cover",
                borderTopLeftRadius: "0.75rem", // rounded-xl
                borderTopRightRadius: "0.75rem",
              }}
            />
          )
        }
      >
        {/* CENTERED HEADER */}
        <div className="flex flex-col items-center text-center gap-4 mb-6">
          {/* Seats pill – now same dark-blue theme */}
          <span
            className="
              inline-flex items-center whitespace-nowrap px-4 py-1.5 rounded-full
              bg-emerald-900/20 text-emerald-200
              text-xs font-semibold
              border border-emerald-700/40
            "
          >
            {seatsLabel}
          </span>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white leading-tight break-words">
            {event.title}
          </h3>

          {/* Tag pill – updated to match */}
          {mainTag && (
            <span
              className="
      inline-flex items-center px-3 py-1 rounded-full
      bg-blue-900/30 text-cyan-200
      border border-blue-500/40
      text-[11px] uppercase tracking-[0.18em] font-medium
    "
            >
              {mainTag.toUpperCase()}
            </span>
          )}
        </div>

        {/* Availability + bar */}
        <EventStatus />

        {/* Info */}
        <EventInfo />

        {/* Button */}
        <Button
          block
          className="
            bg-gradient-to-r from-cyan-500 to-blue-500
            text-black font-semibold
            mt-4 py-5
            rounded-lg shadow-lg
            hover:scale-[1.02]
            transition
            border-none
          "
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          View Details
        </Button>
      </Card>
    </Col>
  );
};

export default EventCard;

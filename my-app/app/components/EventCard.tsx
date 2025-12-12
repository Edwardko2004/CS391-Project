// components/EventCard.tsx
import React from "react";
import { Card, Col, Typography, Button, Progress, Row, Tag } from "antd";
import { Event } from "../lib/types";
import tags from "../lib/tag";
import { useRouter } from "next/navigation";
import { availabilityInfo, getAvailability } from "../lib/cardUtil";

const PLACEHOLDER_IMAGES = [
  "https://www.uab.edu/reporter/images/migration/articles/article-images/rep_food_trucks_2018_550px_150dpi.jpg",
  "https://images.squarespace-cdn.com/content/v1/518a9d87e4b0288d5ff8b768/1507043507440-BE3QD42ATRUTEN8JNU1Y/LTL_1602_Vassar_ACDC_6_9357.jpg",
  "https://oaklandpostonline.com/wp-content/uploads/2023/09/oakland-university-hillcrest-hall-11-1200x959-1.jpg",
];

const pickPlaceholder = (id: string | number) => {
  const s = String(id ?? "");
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
};

const { Text } = Typography;

const getFoodColor = (tag: string) =>
  tags[tag as keyof typeof tags] || tags.other;

interface EventCardProp {
  event: Event;
}

const EventCard: React.FC<EventCardProp> = ({ event }) => {
  const router = useRouter();
  const reservedPercent =
    event.capacity && event.capacity > 0
      ? (event.reservations / event.capacity) * 100
      : 0;

  const availability =
    availabilityInfo[
      getAvailability(reservedPercent, new Date().toISOString() > event.time)
    ];

  const date = new Date(event.time);

  // TAGS – unified cyan theme pills
  const TagList = () => (
    <div className="mb-2 flex flex-wrap gap-2 justify-center">
      {event.tags.map((tag, index) => (
        <Tag
          key={index}
          bordered={false}
          style={{
            borderRadius: 9999, // pill shape
            padding: "2px 10px",
            fontSize: 11,
            fontWeight: 500,
            backgroundColor: "rgba(34, 211, 238, 0.18)", // cyan-500/20 vibe
            color: "rgb(165, 243, 252)", // text-cyan-300-ish
          }}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );

  // CLEAN availability bar — NO BOX AROUND IT
  const EventStatus = () => (
    <div className="mt-2 mb-3">
      <Row justify="space-between" align="middle" style={{ width: "100%" }}>
        <Col>
          <Text
            className="text-xs font-medium"
            style={{
              // custom color just for "Plenty Available"
              color:
                availability.label === "Plenty Available"
                  ? "#2eabf2" // soft mint / teal
                  : availability.color, // fallback for other statuses
            }}
          >
            <availability.icon /> {availability.label}
          </Text>
        </Col>
        <Col>
          <Text className="text-xs" style={{ color: "#97a5adff" }}>
            {event.reservations} / {event.capacity} reserved
          </Text>
        </Col>
      </Row>

      <Progress
        percent={reservedPercent}
        strokeColor="#2eabf2"
        trailColor="#1F2937"
        showInfo={false}
      />
    </div>
  );

  // GRADIENT PILL (used for seats AND button)
  const gradientStyle: React.CSSProperties = {
    background: "linear-gradient(to right, rgb(34 211 238), rgb(59 130 246))",
    color: "#000",
    fontWeight: 600,
    borderRadius: 9999,
  };

  const StatusIcon = () => (
    <Tag
      bordered={false}
      style={{
        background: "#3B82F6",
        color: "#000",
        fontWeight: 600,
        borderRadius: 9999,
        padding: "4px 14px",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      icon={<availability.icon size={14} />}
    >
      {event.capacity - event.reservations} seats left
    </Tag>
  );

  // DESCRIPTION
  const EventInfo = () => {
    const formatted_date = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const formatted_time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const end = new Date(event.time);
    end.setMinutes(end.getMinutes() + event.time_length);
    const formatted_end = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <Typography.Paragraph
        className="space-y-1 text-sm"
        style={{ color: "#97a5adff" }}
      >
        <p>{event.description}</p>
        <p>
          <strong className="cardinfo2">Location: </strong>
          <span className="cardinfo">{event.location}</span>
        </p>
        <p>
          <strong className="cardinfo2">Time: </strong>
          <span className="cardinfo">
            {formatted_date}, {formatted_time} - {formatted_end}
          </span>
        </p>
      </Typography.Paragraph>
    );
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        className="spark-card eventcard rounded-lg text-white shadow-xl hover:scale-[1.02] transition-transform"
        onClick={() => router.push(`/events/${event.id}`)}
        cover={
          (event.image_url || true) && (
            <img
              src={
                event.image_url && event.image_url.trim() !== ""
                  ? event.image_url
                  : pickPlaceholder(event.id)
              }
              draggable={false}
              style={{
                height: 120, // slightly taller header image
                width: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.src = pickPlaceholder(event.id);
              }}
            />
          )
        }
      >
        <div className="space-y-4">
          {/* Seats pill */}
          <div className="flex justify-center">
            <StatusIcon />
          </div>

          {/* Title */}
          <h3 className="text-lg text-white font-semibold text-center">
            {event.title}
          </h3>

          {/* Tags */}
          <div className="mt-1">
            <TagList />
          </div>

          {/* Availability bar */}
          <div className="mt-2">
            <EventStatus />
          </div>

          {/* Description */}
          <div className="mt-2 mb-2">
            <EventInfo />
          </div>

          {/* BUTTON — using SAME exact gradient as seats pill */}
          <Button
            className="w-full py-3 font-semibold transition hover:opacity-90 mt-3"
            style={{
              ...gradientStyle,
              border: "none",
            }}
            onClick={() => router.push(`/events/${event.id}`)}
          >
            View Details
          </Button>
        </div>
      </Card>
    </Col>
  );
};

export default EventCard;

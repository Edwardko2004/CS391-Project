"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Card, Tag, Typography, Row, Col, Progress, Button, Spin } from "antd";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { Event } from "../../types/types";
import tags from "../../lib/tag";

const availabilityInfo = {
  high: {
    color: "#10b981",
    label: "Plenty Available",
  },
  medium: {
    color: "#f59e0b",
    label: "Limited Seats",
  },
  low: {
    color: "#ef4444",
    label: "Almost Gone!",
  },
  out: {
    color: "#6b7280",
    label: "Fully Reserved",
  },
} as const;

type AvailabilityKey = keyof typeof availabilityInfo;

const getAvailabilityKey = (percent: number): AvailabilityKey => {
  if (percent < 60) return "high";
  if (percent < 80) return "medium";
  if (percent < 100) return "low";
  return "out";
};

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setLoading(true);
      setLoadError(null);

      // If your id column is numeric, uncomment the Number() version:
      // const numericId = Number(id);
      // if (Number.isNaN(numericId)) {
      //   setLoadError("Invalid event id");
      //   setLoading(false);
      //   return;
      // }

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id) // or .eq("id", numericId) if your DB id is integer
        .single();

      if (error || !data) {
        console.error("Error loading event", error);
        setLoadError("Could not load event.");
        setLoading(false);
        return;
      }

      setEvent(data as Event);
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (!id) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Spin spinning tip="Loading event..." size="large">
          <div style={{ width: 0, height: 0 }}></div>
        </Spin>
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-4">
          <Link href="/" className="text-teal-400 hover:text-teal-300">
            ← Back to all events
          </Link>
          <Card className="bg-[#111827] border border-[#2A2A2A] text-white rounded-lg shadow-md">
            <Typography.Title level={3} style={{ color: "white" }}>
              Event not found
            </Typography.Title>
            <Typography.Paragraph style={{ color: "#e5e7eb" }}>
              We couldn’t load this event. It may have been removed or the link
              might be incorrect.
            </Typography.Paragraph>
          </Card>
        </div>
      </div>
    );
  }

  const reservedPercent = (event.reserved_seats / event.capacity) * 100;
  const availabilityKey = getAvailabilityKey(reservedPercent);
  const availability = availabilityInfo[availabilityKey];
  const seatsLeft = event.capacity - event.reserved_seats;

  const date = new Date(event.time);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedStart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const endDate = new Date(event.time);
  endDate.setMinutes(endDate.getMinutes() + event.time_length);

  const formattedEnd = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        <Link href="/" className="text-teal-400 hover:text-teal-300">
          ← Back to all events
        </Link>

        <Card
          className="bg-[#111827] border border-[#2A2A2A] rounded-lg shadow-md"
          styles={{
            body: { color: "white" },
          }}
        >
          <Typography.Title level={2} style={{ color: "white" }}>
            {event.title}
          </Typography.Title>

          {/* Tags */}
          <div className="mb-3">
            {event.tags?.map((tag: string, idx: number) => (
              <Tag key={idx} color={tags[tag]?.color ?? tags.other.color}>
                {tag}
              </Tag>
            ))}
          </div>

          {/* Status / capacity */}
          <Row justify="space-between" style={{ marginBottom: 8 }}>
            <Col>
              <Typography.Text style={{ color: availability.color }}>
                {availability.label}
              </Typography.Text>
            </Col>
            <Col>
              <Typography.Text style={{ color: "#97a5adff" }}>
                {event.reserved_seats} / {event.capacity} reserved ({seatsLeft}{" "}
                seats left)
              </Typography.Text>
            </Col>
          </Row>

          <Progress
            percent={reservedPercent}
            strokeColor={availability.color}
            showInfo={false}
            trailColor="#1F2937"
          />

          {/* Main content */}
          <div className="mt-6 space-y-3">
            <Typography.Paragraph style={{ color: "#e5e7eb" }}>
              {event.description}
            </Typography.Paragraph>

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
              {formattedDate}, {formattedStart} – {formattedEnd}
            </p>
          </div>

          {/* Reserve button (hook up to your reserve logic later) */}
          <Button
            className="bg-[#0BA698] text-white font-semibold hover:bg-[#08957d] mt-6"
            block
          >
            Reserve a seat
          </Button>
        </Card>
      </div>
    </div>
  );
}

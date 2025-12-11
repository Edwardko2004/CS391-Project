"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Card, Tag, Typography, Row, Col, Progress, Button, Modal } from "antd";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { Event, Profile } from "../../lib/types";
import tags from "../../lib/tag";
import { availabilityInfo, getAvailability } from "../../lib/cardUtil";
import { useSupabaseAuth } from "@/app/lib/SupabaseProvider";
import QRCode from "qrcode";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
});

export async function generateQrFromCode(code: string) {
  return await QRCode.toDataURL(code);
}

export default function EventDetailPage() {
  
  const params = useParams();
  const id = params?.id as string | undefined;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  // modal + confirmation code
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [coords, setCoords] = useState(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  
  

  // handle creating a reservation when clicking on a card
  const handleReserve = async () => {
    if (!user) {
      Modal.error({
        title: "Login required",
        content: "You must be logged in to reserve a seat.",
      });
      return;
    }

    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profileData) {
      Modal.error({
        title: "Profile Error",
        content: "Could not load your profile.",
      });
      return;
    }

    if (!event) {
      Modal.error({
        title: "Error",
        content: "Event not loaded.",
      });
      return;
    }

    // Insert reservation and return code
    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          event_id: event.id,
          profile_id: profileData.id,
        },
      ])
      .select()
      .single();

    if (error) {
      Modal.error({
        title: "Reservation Failed",
        content: error.message,
      });
      return;
    }
    
    setConfirmationCode(data.confirmation_code);

    const qr = await generateQrFromCode(data.confirmation_code);
    setQrImage(qr);

    setShowModal(true);
  };

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("events")
        .select(`*, reservations(count)`)
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error loading event", error);
        setLoadError("Could not load event.");
        setLoading(false);
        return;
      }

    const e = {
      id: data.id,
      title: data.title,
      description: data.description,
      tags: data.tags,
      location: data.location,
      organizer: data.organizer,
      organizer_id: data.organizer_id,
      status: data.status,
      latitude: data.latitude,      
      longitude: data.longitude,    
      reservations: data.reservations?.[0]?.count ?? 0,
      capacity: data.capacity,
      time: data.time,
      time_length: data.time_length,
      created_at: data.created_at,
      image_url: data.image_url,
    };

      setEvent(e);
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (!id) notFound();

  if (loading) {
    return (
      <main className="flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </main>
    );
  }

  if (loadError || !event) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-4">
          <Link href="/events" className="text-teal-400 hover:text-teal-300">
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

  const reservedPercent = (event.reservations / event.capacity) * 100;
  const availability =
    availabilityInfo[
      getAvailability(reservedPercent, new Date().toISOString() > event.time)
    ];
  const seatsLeft = event.capacity - event.reservations;
  const inactive = new Date().toISOString() > event.time || seatsLeft == 0;

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
        <Link href="/events" className="text-teal-400 hover:text-teal-300">
          ← Back to all events
        </Link>

        <Card
          className="bg-[#111827] border border-[#2A2A2A] rounded-lg shadow-md"
          styles={{
            body: { color: "white" },
          }}
          cover={
            event.image_url && (
              <img src={event.image_url} alt="image" draggable={false} />
            )
          }
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
                {event.reservations} / {event.capacity} reserved ({seatsLeft}{" "}
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
          {/* Map Section */}
          {event.latitude && event.longitude ? (
            <MapComponent
              lat={event.latitude}
              lng={event.longitude}
              locationName={event.location}
            />
          ) : (
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700 text-gray-300">
              <p>📍 Map is not available for this event.</p>
              <p className="text-sm opacity-75">This event was created before map support was added.</p>
            </div>
          )}

          {/* Reserve button */}
          <Button
            className="bg-[#0BA698] text-white font-semibold hover:bg-[#08957d] mt-6"
            block
            onClick={handleReserve}
            disabled={inactive}
          >
            Reserve a seat
          </Button>

          {/* Confirmation modal */}
          <Modal
            title="Reservation Confirmed"
            open={showModal}
            onOk={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
          >
            <p>Your seat has been reserved!</p>

            <p>
              <strong>Confirmation Code: </strong>
              <code style={{ fontSize: "1.15rem" }}>{confirmationCode}</code>
            </p>

            {qrImage && (
              <div className="flex justify-center mt-4">
                <img 
                  src={qrImage} 
                  alt="QR Code" 
                  className="w-48 h-48 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </Modal>
        </Card>
      </div>
    </div>
  );
}

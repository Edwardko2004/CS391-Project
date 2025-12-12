"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Progress, Modal } from "antd";
import { Calendar, MapPin, Users } from "lucide-react";

import { supabase } from "../../lib/supabaseClient";
import { Event } from "../../lib/types";
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
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  // modal + confirmation code
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [coords, setCoords] = useState(null);

  // ---------------- RESERVATION HANDLER ----------------
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

  // ---------------- FETCH EVENT ----------------
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

  if (!id) {
    notFound();
  }

  // ---------------- LOADING / ERROR STATES ----------------
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-[#071130] to-[#021428] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading event...</p>
        </div>
      </main>
    );
  }

  if (loadError || !event) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-[#071130] to-[#021428] text-white px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link
            href="/events"
            className="inline-flex items-center text-white text-sm"
          >
            ← Back to all events
          </Link>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <h1 className="text-s2xl font-bold mb-2">Event not found</h1>
            <p className="text-gray-300">
              We couldn't load this event. It may have been removed or the link
              might be incorrect.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------- DERIVED VALUES ----------------
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

  const inactive =
    new Date().toISOString() > event.time ||
    (seatsLeft !== null && seatsLeft <= 0);

  const date = new Date(event.time);

  // Condensed date/time like we used on cards (no weekday)
  const formattedStart = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
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

  const gradientStyle: React.CSSProperties = {
    background: "linear-gradient(to right, rgb(34 211 238), rgb(59 130 246))",
    color: "#000",
    fontWeight: 600,
    borderRadius: 9999,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#071130] to-[#021428] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto animate-fade-in">
        {/* Back link */}
        <div className="mb-4">
          <Link
            href="/events"
            className="inline-flex items-center text-white text-sm"
          >
            ← Back to all events
          </Link>
        </div>

        {/* HEADER TITLE */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            {event.title}
          </h1>
          <p className="text-sm text-gray-400">
            Hosted by{" "}
            <span className="text-gray-200 font-medium">
              {event.organizer || "Organizer"}
            </span>
          </p>
        </header>

        {/* MAIN CARD (glass, like create-event preview) */}
        <section className="bg-white/5 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {/* Optional image */}
          {event.image_url && (
            <div className="h-52 w-full overflow-hidden border-b border-gray-700">
              <img
                src={event.image_url}
                alt="Event image"
                draggable={false}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 space-y-6">
            {/* Top row: tags + status + capacity */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {event.tags?.length ? (
                  event.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="
                      text-[11px] px-2.5 py-1 rounded-full
                      bg-[#07142A] border border-[#1f2937]
                      text-slate-100 uppercase tracking-[0.18em]
                    "
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">
                    No tags for this event
                  </span>
                )}
              </div>

              {/* Status + capacity */}
              <div className="flex flex-col items-start md:items-end gap-1 text-sm">
                <span
                  className="text-[11px] px-3 py-1 rounded-full font-medium uppercase tracking-[0.18em] border"
                  style={{
                    backgroundColor: "#050B18", // same deep navy glass
                    borderColor: "#c9a46d", // soft amber border
                    color: "#fef3c7", // warm light text
                  }}
                >
                  {availability.label.toUpperCase()}
                </span>
                <span className="text-slate-300 text-xs md:text-sm">
                  {event.reservations} / {event.capacity ?? "—"} reserved
                  {seatsLeft !== null && ` • ${seatsLeft} seats left`}
                </span>
              </div>
            </div>

            {/* Capacity bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Capacity</span>
                <span>{Math.round(reservedPercent)}% full</span>
              </div>
              <Progress
                percent={reservedPercent}
                strokeColor="#86efac" // emerald-500
                showInfo={false}
                trailColor="#020617"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                About this event
              </h2>
              <p className="text-slate-100/90 leading-relaxed">
                {event.description || "No description provided."}
              </p>
            </div>

            {/* Details rows */}
            <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-100">
              <div className="flex items-start gap-3">
                <Calendar className="text-sky-300 mt-0.5" size={18} />
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-[0.16em] mb-0.5">
                    Date & Time
                  </div>
                  <div>
                    {formattedStart} – {formattedEnd}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-sky-300 mt-0.5" size={18} />
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-[0.16em] mb-0.5">
                    Location
                  </div>
                  <div>{event.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="text-sky-300 mt-0.5" size={18} />
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-[0.16em] mb-0.5">
                    Organizer
                  </div>
                  <div>{event.organizer || "Organizer"}</div>
                </div>
              </div>
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
            <div className="pt-2">
              <button
                onClick={handleReserve}
                disabled={inactive}
                style={{
                  ...gradientStyle,
                  border: "none",
                }}
                className={`w-full py-3 rounded-lg font-semibold shadow-lg transition cursor-pointer ${
                  inactive
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                    : "bg-white text-black hover:scale-[1.02]"
                }`}
              >
                {inactive ? "Event Closed" : "Reserve a seat"}
              </button>
            </div>
          </div>
        </section>
      </div>

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
    </main>
  );
}

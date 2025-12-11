// lib/supabaseQueries.ts
// provide data for supabase queries on profile

import { supabase } from './supabaseClient';

// get the list of upcoming reservations
export async function getUserUpcomingReservations(userId: string) {
  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      event: events!inner (*)
    `)
    .eq("profile_id", userId)
    .gt("event.time", new Date().toISOString());

  return {data, error}
}

// get the list of previous reservations
export async function getUserPastReservations(userId: string) {
  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      event: events!inner (*)
    `)
    .eq("profile_id", userId)
    .lt("event.time", new Date().toISOString());

  return {data, error}
}

export async function getUserUpcomingHostedEvents(userId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      reservations (*)
    `)
    .eq("organizer_id", userId)
    .gt("time", new Date().toISOString())

  return {data, error}
}

export async function getUserPastHostedEvents(userId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      reservations (*)
    `)
    .eq("organizer_id", userId)
    .lt("time", new Date().toISOString())

  return {data, error}
}

export async function checkInReservation(reservationId: number) {
  const { data, error } = await supabase
    .from('reservations')
    .update({
      is_checked_in: true,
      checked_in_at: new Date().toISOString()
    })
    .eq('id', reservationId)
    .select()
    .single();

  return { data, error };
}

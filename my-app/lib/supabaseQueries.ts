import { supabase } from './supabaseClient';

// get the list of upcoming reservations of a user
export async function getUserUpcomingReservations(userId: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      events!inner (
        title,
        time,
        location,
        organizer,
        status
      )
    `)
    .eq('profile_id', userId)
    .gte('events.time', new Date().toISOString())
    .order('events.time', { ascending: true });

  return { data, error };
}

// get the list of previous reservations of a user
export async function getUserPastReservations(userId: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      events!inner (
        title,
        time,
        location,
        organizer,
        status
      )
    `)
    .eq('profile_id', userId)
    .lt('events.time', new Date().toISOString())
    .order('events.time', { ascending: false });

  return { data, error };
}

// get the list of upcoming events hosted by a user
export async function getUserUpcomingHostedEvents(userId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      reservations:event_id (*)
    `)
    .eq("organizer_id", userId)
    .gt("time", new Date().toISOString());

  return { data, error };
}

// get the list of previous events hosted by a user
export async function getUserPastHostedEvents(userId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      reservations:event_id (*)
    `)
    .eq("organizer_id", userId)
    .lt("time", new Date().toISOString());

  return { data, error };
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

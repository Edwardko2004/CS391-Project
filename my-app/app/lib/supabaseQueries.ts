import { supabase } from './supabaseClient';

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

export async function getUserUpcomingHostedEvents(userId: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      reservations (
        id,
        profile_id,
        confirmation_code,
        is_checked_in,
        checked_in_at,
        profiles (
          first_name,
          last_name,
          email
        )
      )
    `)
    .eq('organizer_id', userId)
    .gte('time', new Date().toISOString())
    .order('time', { ascending: true });

  return { data, error };
}

export async function getUserPastHostedEvents(userId: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      reservations (
        id,
        profile_id,
        confirmation_code,
        is_checked_in,
        checked_in_at,
        profiles (
          first_name,
          last_name,
          email
        )
      )
    `)
    .eq('organizer_id', userId)
    .lt('time', new Date().toISOString())
    .order('time', { ascending: false });

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

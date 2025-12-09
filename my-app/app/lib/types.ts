// types/types.ts
// defines the database models into typescript types

// define the Event type and its fields
export interface Event {
    id: number;
    title: string;
    description: string;
    tags: string[];
    location: string;
    organizer: string;
    status: string;
    latitude: number,      // <-- NEW
    longitude: number,
    reservations: number;
    capacity: number;
    time: string;
    time_length: number;
    created_at: string;
    image_url: string;
}

// define the Profile type and its fields
export interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

// define the Reservation type and its fields
export interface Reservation {
    id: number;
    event_id: number;
    profile_id: number;
    created_at: string;
}
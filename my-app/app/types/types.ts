// define the Event type and its fields
export interface Event {
    id: number;
    title: string;
    description: string;
    tags: string[];
    location: string;
    organizer: string;
    status: string;
    reservations: number;
    capacity: number;
    time: string;
    time_length: number;
    created_at: string;
}

// define the Profile type and its fields
export interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}
// define the Event type and its fields
export interface Event {
    id: number;
    title: string;
    description: string;
    tags: string[];
    location: string;
    organizer: string;
    status: string;
    reserved_seats: number;
    capacity: number;
    time: string;
    time_length: number;
    create_at: string;
}
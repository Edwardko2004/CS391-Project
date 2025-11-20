export interface Event {
  id: string;
  title: string;
  location: string;
  capacity: number;
  status: string;
  organizer?: string;
  time?: string;
  tags?: string[];
  reserved_seats?: number;
}

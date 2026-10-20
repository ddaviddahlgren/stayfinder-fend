export interface User {
  id: string;
  email?: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  image_url: string | null;
  created_at: string;
}

export type NewProperty = Omit<Property, "id" | "owner_id" | "created_at">;

export type PropertySort = "price_asc" | "price_desc";

export interface PropertyFilters {
  location?: string;
  max_price?: number;
  guests?: number;
  sort?: PropertySort;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  property_id: string;
  user_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: BookingStatus;
  created_at: string;
}

export type NewBooking = Pick<
  Booking,
  "guest_name" | "guest_email" | "check_in" | "check_out" | "guests"
>;

export type BookingUpdate = Partial<NewBooking> & { status?: BookingStatus }
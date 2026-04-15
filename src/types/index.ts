export type VehicleCategory = "economy" | "suv" | "luxury" | "minivan";
export type Transmission = "automatic" | "manual";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  year: number;
  category: VehicleCategory;
  daily_price: number;
  transmission: Transmission;
  seats: number;
  fuel_type: string;
  description: string | null;
  images: string[];
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  reference: string;
  vehicle_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_date: string;
  return_date: string;
  extras: Record<string, boolean>;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  vehicle?: Vehicle;
}

export interface BookingExtras {
  insurance: boolean;
  gps: boolean;
  child_seat: boolean;
}

export const EXTRA_PRICES: Record<keyof BookingExtras, number> = {
  insurance: 15,
  gps: 8,
  child_seat: 5,
};

export const EXTRA_LABELS: Record<keyof BookingExtras, string> = {
  insurance: "Full Insurance",
  gps: "GPS Navigation",
  child_seat: "Child Seat",
};

export const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  economy: "Economy",
  suv: "SUV",
  luxury: "Luxury",
  minivan: "Minivan",
};
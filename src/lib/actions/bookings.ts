"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { BookingExtras } from "@/types"

export interface CreateBookingInput {
  vehicle_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pickup_date: string
  return_date: string
  extras: BookingExtras
  total_price: number
  notes?: string
}

export async function createBooking(input: CreateBookingInput) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      vehicle_id: input.vehicle_id,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      pickup_date: input.pickup_date,
      return_date: input.return_date,
      extras: input.extras,
      total_price: input.total_price,
      notes: input.notes || null,
    })
    .select("reference")
    .single()

  if (error) {
    return { error: error.message }
  }

  redirect(`/booking/confirmation?ref=${data.reference}`)
}

export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled"
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/bookings")
  return { success: true }
}

export async function getBookedDates(vehicleId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("pickup_date, return_date")
    .eq("vehicle_id", vehicleId)
    .neq("status", "cancelled")

  if (error) return []
  return data || []
}
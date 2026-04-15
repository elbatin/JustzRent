"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface VehicleInput {
  name: string
  brand: string
  year: number
  category: string
  daily_price: number
  transmission: string
  seats: number
  fuel_type: string
  description?: string
  images: string[]
  is_available: boolean
}

export async function createVehicle(input: VehicleInput) {
  const supabase = await createClient()

  const { error } = await supabase.from("vehicles").insert(input)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/vehicles")
  revalidatePath("/fleet")
  redirect("/admin/vehicles")
}

export async function updateVehicle(id: string, input: Partial<VehicleInput>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("vehicles")
    .update(input)
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/vehicles")
  revalidatePath("/fleet")
  revalidatePath(`/vehicles/${id}`)
  redirect("/admin/vehicles")
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("vehicles").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/vehicles")
  revalidatePath("/fleet")
  return { success: true }
}

export async function getAllVehicles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return []
  return data || []
}

export async function getVehicleById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}
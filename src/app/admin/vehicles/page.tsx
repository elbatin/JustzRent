import { createClient } from "@/lib/supabase/server"
import { VehiclesClient } from "@/components/admin/vehicles-client"
import type { Vehicle } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vehicles | Admin",
}

export default async function AdminVehiclesPage() {
  try {
    const supabase = await createClient()
    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false })
    return <VehiclesClient vehicles={(vehicles as Vehicle[]) || []} />
  } catch {
    return <VehiclesClient vehicles={[]} />
  }
}
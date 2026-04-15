import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { VehicleCard } from "@/components/vehicle-card"
import { VehicleFilters } from "@/components/vehicle-filters"
import type { Vehicle } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Fleet",
  description: "Browse our full range of rental vehicles — Economy, SUV, Luxury, and Minivan.",
}

interface FleetPageProps {
  searchParams: Promise<{
    category?: string | string[]
    transmission?: string | string[]
    maxPrice?: string
    sort?: string
    from?: string
    to?: string
  }>
}

async function getVehicles(filters: Awaited<FleetPageProps["searchParams"]>): Promise<Vehicle[]> {
  try {
    const supabase = await createClient()
    let query = supabase.from("vehicles").select("*").eq("is_available", true)

    const categories = filters.category
      ? Array.isArray(filters.category)
        ? filters.category
        : [filters.category]
      : []

    const transmissions = filters.transmission
      ? Array.isArray(filters.transmission)
        ? filters.transmission
        : [filters.transmission]
      : []

    if (categories.length > 0) {
      query = query.in("category", categories)
    }

    if (transmissions.length > 0) {
      query = query.in("transmission", transmissions)
    }

    if (filters.maxPrice) {
      query = query.lte("daily_price", Number(filters.maxPrice))
    }

    const sort = filters.sort || "price_asc"
    if (sort === "price_desc") {
      query = query.order("daily_price", { ascending: false })
    } else if (sort === "name_asc") {
      query = query.order("name", { ascending: true })
    } else {
      query = query.order("daily_price", { ascending: true })
    }

    const { data } = await query
    return (data as Vehicle[]) || []
  } catch {
    return []
  }
}

export default async function FleetPage({ searchParams }: FleetPageProps) {
  const filters = await searchParams
  const vehicles = await getVehicles(filters)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-1">Available Now</p>
        <h1 className="text-3xl md:text-4xl font-bold">Our Fleet</h1>
        <p className="text-muted-foreground mt-2">
          Find the perfect vehicle for your journey.
        </p>
      </div>

      <div className="flex gap-8">
        <Suspense fallback={null}>
          <VehicleFilters totalCount={vehicles.length} />
        </Suspense>

        <div className="flex-1">
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground max-w-sm">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
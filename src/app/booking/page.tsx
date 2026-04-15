import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookingForm } from "@/components/booking-form"
import type { Vehicle, BookingExtras } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Complete Your Booking",
}

interface BookingPageProps {
  searchParams: Promise<{
    vehicleId?: string
    from?: string
    to?: string
    extras?: string
    total?: string
  }>
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams

  if (!params.vehicleId || !params.from || !params.to) {
    redirect("/fleet")
  }

  let vehicle = null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", params.vehicleId)
      .single()
    if (error || !data) redirect("/fleet")
    vehicle = data
  } catch {
    redirect("/fleet")
  }
  if (!vehicle) redirect("/fleet")

  const v = vehicle as Vehicle

  const extrasStr = params.extras ? params.extras.split(",") : []
  const extras: BookingExtras = {
    insurance: extrasStr.includes("insurance"),
    gps: extrasStr.includes("gps"),
    child_seat: extrasStr.includes("child_seat"),
  }

  const total = params.total ? Number(params.total) : v.daily_price

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-1">
          Step 1 of 2
        </p>
        <h1 className="text-3xl font-bold">Complete Your Booking</h1>
        <p className="text-muted-foreground mt-2">
          Fill in your details to confirm your reservation.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            1
          </div>
          <span className="text-sm font-medium">Your Details</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="text-sm text-muted-foreground">Confirmation</span>
        </div>
      </div>

      <BookingForm
        vehicle={v}
        from={params.from}
        to={params.to}
        extras={extras}
        total={total}
      />
    </div>
  )
}
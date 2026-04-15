import { createClient } from "@/lib/supabase/server"
import { Car, CalendarCheck, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, statusColor } from "@/lib/utils"
import Link from "next/link"
import type { Metadata } from "next"
import type { Booking } from "@/types"

export const metadata: Metadata = {
  title: "Admin Dashboard | JustzRent",
}

export default async function AdminDashboardPage() {
  let totalVehicles = 0
  let allBookings: Booking[] = []

  try {
    const supabase = await createClient()
    const [{ count }, { data: bookings }] = await Promise.all([
      supabase.from("vehicles").select("*", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("*, vehicle:vehicles(name, brand)")
        .order("created_at", { ascending: false })
        .limit(10),
    ])
    totalVehicles = count || 0
    allBookings = (bookings || []) as Booking[]
  } catch {
    // env vars missing or DB error — show empty state
  }

  const pendingCount = allBookings.filter((b) => b.status === "pending").length
  const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length
  const cancelledCount = allBookings.filter((b) => b.status === "cancelled").length

  const stats = [
    {
      label: "Total Vehicles",
      value: totalVehicles || 0,
      icon: Car,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending Bookings",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Confirmed",
      value: confirmedCount,
      icon: CalendarCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Cancelled",
      value: cancelledCount,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your rental business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Link
              href="/admin/bookings"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {allBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No bookings yet.
            </p>
          ) : (
            <div className="space-y-3">
              {allBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {booking.reference}
                      </span>
                      <Badge className={statusColor(booking.status) + " text-xs"}>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mt-0.5">{booking.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.vehicle
                        ? `${(booking.vehicle as any).brand} ${(booking.vehicle as any).name}`
                        : "Vehicle removed"}{" "}
                      · {formatDate(booking.pickup_date)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-sm">{formatCurrency(booking.total_price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
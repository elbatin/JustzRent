import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate, statusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { BookingStatusButtons } from "@/components/admin/booking-status-buttons"
import type { Booking } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bookings | Admin",
}

export default async function AdminBookingsPage() {
  let allBookings: Booking[] = []
  try {
    const supabase = await createClient()
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*, vehicle:vehicles(name, brand, images)")
      .order("created_at", { ascending: false })
    allBookings = (bookings || []) as Booking[]
  } catch {
    // show empty state
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {allBookings.length} total booking{allBookings.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Reference
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                  Vehicle
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                  Dates
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Total
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {allBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                allBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {booking.reference}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{booking.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                        <p className="text-xs text-muted-foreground">{booking.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm">
                        {booking.vehicle
                          ? `${(booking.vehicle as any).brand} ${(booking.vehicle as any).name}`
                          : <span className="text-muted-foreground italic">Removed</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>From: <span className="text-foreground">{formatDate(booking.pickup_date)}</span></p>
                        <p>To: <span className="text-foreground">{formatDate(booking.return_date)}</span></p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-sm">
                        {formatCurrency(booking.total_price)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColor(booking.status) + " text-xs capitalize"}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusButtons
                        bookingId={booking.id}
                        currentStatus={booking.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
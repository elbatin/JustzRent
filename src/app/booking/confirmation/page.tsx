import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, Calendar, Car, Mail, Phone, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"
import { EXTRA_LABELS, CATEGORY_LABELS } from "@/types"
import type { Booking, BookingExtras } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Booking Confirmed",
}

interface ConfirmationPageProps {
  searchParams: Promise<{ ref?: string }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { ref } = await searchParams

  if (!ref) redirect("/fleet")

  let booking = null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("bookings")
      .select("*, vehicle:vehicles(*)")
      .eq("reference", ref)
      .single()
    if (error || !data) redirect("/fleet")
    booking = data
  } catch {
    redirect("/fleet")
  }
  if (!booking) redirect("/fleet")

  const b = booking as Booking
  const extras = (b.extras || {}) as unknown as BookingExtras
  const activeExtras = (Object.keys(extras) as Array<keyof BookingExtras>).filter(
    (k) => extras[k]
  )

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-5">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your reservation has been received. We&apos;ll contact you shortly to confirm the details.
        </p>
      </div>

      {/* Reference Number */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-6 text-center mb-8">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Booking Reference
        </p>
        <p className="text-4xl font-bold tracking-widest text-primary">{b.reference}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Save this reference number for your records
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden mb-6">
        {/* Vehicle Image */}
        {b.vehicle?.images?.[0] && (
          <div className="relative h-48">
            <Image
              src={b.vehicle.images[0]}
              alt={`${b.vehicle.brand} ${b.vehicle.name}`}
              fill
              className="object-cover"
              sizes="672px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <p className="font-bold text-lg">
                {b.vehicle.brand} {b.vehicle.name}
              </p>
              <p className="text-sm opacity-80">
                {CATEGORY_LABELS[b.vehicle.category]} · {b.vehicle.year}
              </p>
            </div>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Pending Confirmation
            </Badge>
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup Date</p>
                <p className="text-sm font-semibold">{formatDate(b.pickup_date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Return Date</p>
                <p className="text-sm font-semibold">{formatDate(b.return_date)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Car className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">{b.customer_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{b.customer_email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{b.customer_phone}</span>
            </div>
          </div>

          {/* Extras */}
          {activeExtras.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Extras Included
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeExtras.map((k) => (
                    <Badge key={k} variant="secondary">
                      {EXTRA_LABELS[k]}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Paid</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(b.total_price)}
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 text-sm text-blue-700 dark:text-blue-300">
        <p className="font-semibold mb-1">What happens next?</p>
        <p>
          Our team will review your booking and send a confirmation to{" "}
          <strong>{b.customer_email}</strong> within a few hours.
          You can also reach us via WhatsApp for quick assistance.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Home
          </Button>
        </Link>
        <Link href="/fleet" className="flex-1">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            Browse More Cars <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
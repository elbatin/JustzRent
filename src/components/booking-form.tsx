"use client"

import { useState, useTransition } from "react"
import { User, Mail, Phone, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBooking } from "@/lib/actions/bookings"
import type { Vehicle, BookingExtras } from "@/types"
import { formatCurrency, calculateDays, calculateTotal, formatDate } from "@/lib/utils"
import { EXTRA_LABELS } from "@/types"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { parseISO } from "date-fns"

interface BookingFormProps {
  vehicle: Vehicle
  from: string
  to: string
  extras: BookingExtras
  total: number
}

export function BookingForm({ vehicle, from, to, extras, total }: BookingFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const fromDate = parseISO(from)
  const toDate = parseISO(to)
  const days = calculateDays(fromDate, toDate)
  const { basePrice, extrasPrice } = calculateTotal(vehicle, fromDate, toDate, extras)

  const activeExtras = (Object.keys(extras) as Array<keyof BookingExtras>).filter(
    (k) => extras[k]
  )

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createBooking({
        vehicle_id: vehicle.id,
        customer_name: formData.get("name") as string,
        customer_email: formData.get("email") as string,
        customer_phone: formData.get("phone") as string,
        pickup_date: from,
        return_date: to,
        extras,
        total_price: total,
        notes: (formData.get("notes") as string) || undefined,
      })

      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Customer Info Form */}
      <div>
        <h2 className="text-xl font-bold mb-6">Your Information</h2>
        <form action={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="mb-1.5 block">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                required
                placeholder="John Doe"
                className="pl-9"
                minLength={2}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="mb-1.5 block">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="mb-1.5 block">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+90 555 000 0000"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="mb-1.5 block">Special Requests (optional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any special requests or notes..."
                className="pl-9 min-h-[100px] resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Confirm Booking — ${formatCurrency(total)}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By booking you agree to our terms and conditions.
          </p>
        </form>
      </div>

      {/* Booking Summary */}
      <div>
        <h2 className="text-xl font-bold mb-6">Booking Summary</h2>
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          {/* Vehicle */}
          <div className="relative h-44">
            <Image
              src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"}
              alt={`${vehicle.brand} ${vehicle.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <p className="font-bold text-lg">{vehicle.brand} {vehicle.name}</p>
              <p className="text-sm opacity-80 capitalize">{vehicle.category} · {vehicle.year}</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/40 rounded-lg">
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p className="text-sm font-semibold mt-0.5">{formatDate(from)}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <p className="text-xs text-muted-foreground">Return</p>
                <p className="text-sm font-semibold mt-0.5">{formatDate(to)}</p>
              </div>
            </div>

            {/* Duration */}
            <p className="text-sm text-muted-foreground text-center">
              Duration: <span className="font-semibold text-foreground">{days} day{days > 1 ? "s" : ""}</span>
            </p>

            <Separator />

            {/* Extras */}
            {activeExtras.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Extras</p>
                {activeExtras.map((k) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span>{EXTRA_LABELS[k]}</span>
                    <span className="text-muted-foreground">+€{extrasPrice > 0 ? (extrasPrice / activeExtras.length).toFixed(0) : 0}/total</span>
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{formatCurrency(vehicle.daily_price)} × {days} days</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
              {extrasPrice > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Extras total</span>
                  <span>{formatCurrency(extrasPrice)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Shield, Navigation, Baby } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, calculateDays } from "@/lib/utils"
import { EXTRA_PRICES, EXTRA_LABELS } from "@/types"
import type { Vehicle, BookingExtras } from "@/types"
import { format, parseISO } from "date-fns"

interface PriceCalculatorProps {
  vehicle: Vehicle
  initialFrom?: string
  initialTo?: string
}

const extraIcons = {
  insurance: Shield,
  gps: Navigation,
  child_seat: Baby,
}

export function PriceCalculator({
  vehicle,
  initialFrom,
  initialTo,
}: PriceCalculatorProps) {
  const router = useRouter()
  const today = format(new Date(), "yyyy-MM-dd")
  const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd")

  const [from, setFrom] = useState(initialFrom || today)
  const [to, setTo] = useState(initialTo || tomorrow)
  const [extras, setExtras] = useState<BookingExtras>({
    insurance: false,
    gps: false,
    child_seat: false,
  })

  const fromDate = parseISO(from)
  const toDate = parseISO(to)
  const isValid = toDate > fromDate
  const days = isValid ? calculateDays(fromDate, toDate) : 0
  const basePrice = days * vehicle.daily_price
  const extrasPrice = isValid
    ? (Object.keys(extras) as Array<keyof BookingExtras>)
        .filter((k) => extras[k])
        .reduce((sum, k) => sum + EXTRA_PRICES[k] * days, 0)
    : 0
  const total = basePrice + extrasPrice

  function toggleExtra(key: keyof BookingExtras) {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleBooking() {
    if (!isValid) return
    const extrasStr = Object.entries(extras)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",")
    const params = new URLSearchParams({
      vehicleId: vehicle.id,
      from,
      to,
      ...(extrasStr ? { extras: extrasStr } : {}),
      total: String(total),
    })
    router.push(`/booking?${params.toString()}`)
  }

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-5 sticky top-24">
      <div>
        <h2 className="font-bold text-lg">Book This Vehicle</h2>
        <p className="text-sm text-muted-foreground">
          Starting from{" "}
          <span className="text-primary font-semibold">
            {formatCurrency(vehicle.daily_price)}
          </span>{" "}
          / day
        </p>
      </div>

      <Separator />

      {/* Date Selection */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
            Pickup Date
          </Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              type="date"
              className="pl-9"
              value={from}
              min={today}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
            Return Date
          </Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              type="date"
              className="pl-9"
              value={to}
              min={from || today}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Extras */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Optional Extras</h3>
        <div className="space-y-2.5">
          {(Object.keys(extras) as Array<keyof BookingExtras>).map((key) => {
            const Icon = extraIcons[key]
            return (
              <div
                key={key}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id={key}
                    checked={extras[key]}
                    onCheckedChange={() => toggleExtra(key)}
                  />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor={key} className="text-sm cursor-pointer font-normal">
                    {EXTRA_LABELS[key]}
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground">
                  +{formatCurrency(EXTRA_PRICES[key])}/day
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Price Breakdown */}
      {isValid && days > 0 ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              {formatCurrency(vehicle.daily_price)} × {days} day{days > 1 ? "s" : ""}
            </span>
            <span>{formatCurrency(basePrice)}</span>
          </div>
          {extrasPrice > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Extras</span>
              <span>{formatCurrency(extrasPrice)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-destructive">
          Please select valid pickup and return dates.
        </p>
      )}

      <Button
        onClick={handleBooking}
        disabled={!isValid || days === 0 || !vehicle.is_available}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
      >
        {vehicle.is_available ? "Book Now" : "Currently Unavailable"}
      </Button>
    </div>
  )
}
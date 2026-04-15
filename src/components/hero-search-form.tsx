"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

export function HeroSearchForm() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const today = format(new Date(), "yyyy-MM-dd")
  const tomorrow = format(
    new Date(Date.now() + 86400000),
    "yyyy-MM-dd"
  )
  const [pickupDate, setPickupDate] = useState(today)
  const [returnDate, setReturnDate] = useState(tomorrow)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (pickupDate) params.set("from", pickupDate)
    if (returnDate) params.set("to", returnDate)
    router.push(`/fleet?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-2xl w-full max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Location */}
        <div className="relative">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              className="pl-9"
              placeholder="Istanbul, Turkey"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">
            Pickup Date
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              type="date"
              className="pl-9"
              value={pickupDate}
              min={today}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
        </div>

        {/* Return Date */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">
            Return Date
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              type="date"
              className="pl-9"
              value={returnDate}
              min={pickupDate || today}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 gap-2"
      >
        <Search className="h-4 w-4" />
        Search Available Cars
      </Button>
    </form>
  )
}
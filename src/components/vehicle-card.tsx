import Image from "next/image"
import Link from "next/link"
import { Users, Fuel, Settings, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, categoryColor } from "@/lib/utils"
import { CATEGORY_LABELS } from "@/types"
import type { Vehicle } from "@/types"

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const primaryImage =
    vehicle.images?.[0] ||
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"

  return (
    <Card className="group overflow-hidden border border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <Image
          src={primaryImage}
          alt={`${vehicle.brand} ${vehicle.name}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <Badge className={categoryColor(vehicle.category)}>
            {CATEGORY_LABELS[vehicle.category]}
          </Badge>
        </div>
        {!vehicle.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        {/* Title + Price */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-base leading-tight">
              {vehicle.brand} {vehicle.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{vehicle.year}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatCurrency(vehicle.daily_price)}
            </div>
            <div className="text-xs text-muted-foreground">/day</div>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50 text-center">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{vehicle.seats} seats</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50 text-center">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground capitalize">{vehicle.transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50 text-center">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground capitalize">{vehicle.fuel_type}</span>
          </div>
        </div>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i <= 4 ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
        </div>

        <Link href={`/vehicles/${vehicle.id}`}>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!vehicle.is_available}
          >
            {vehicle.is_available ? "View Details" : "Unavailable"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
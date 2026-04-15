import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ImageGallery } from "@/components/image-gallery"
import { PriceCalculator } from "@/components/price-calculator"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Fuel, Settings, Calendar, Tag, CheckCircle2 } from "lucide-react"
import { categoryColor, formatCurrency } from "@/lib/utils"
import { CATEGORY_LABELS } from "@/types"
import type { Vehicle } from "@/types"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string; to?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data } = await supabase
      .from("vehicles")
      .select("name, brand")
      .eq("id", id)
      .single()
    if (!data) return { title: "Vehicle Not Found" }
    return { title: `${data.brand} ${data.name}` }
  } catch {
    return { title: "Vehicle" }
  }
}

export default async function VehicleDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { from, to } = await searchParams

  let vehicle = null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single()
    if (error || !data) notFound()
    vehicle = data
  } catch {
    notFound()
  }

  if (!vehicle) notFound()

  const v = vehicle as Vehicle

  const specs = [
    { icon: Tag, label: "Brand", value: v.brand },
    { icon: Calendar, label: "Year", value: String(v.year) },
    { icon: Settings, label: "Transmission", value: v.transmission.charAt(0).toUpperCase() + v.transmission.slice(1) },
    { icon: Users, label: "Seats", value: `${v.seats} passengers` },
    { icon: Fuel, label: "Fuel Type", value: v.fuel_type.charAt(0).toUpperCase() + v.fuel_type.slice(1) },
    { icon: Tag, label: "Category", value: CATEGORY_LABELS[v.category] },
  ]

  const features = [
    "Air Conditioning",
    "Bluetooth Audio",
    "USB Charging Ports",
    "Cruise Control",
    v.transmission === "automatic" ? "Automatic Transmission" : "Manual Transmission",
    v.fuel_type === "electric" ? "Fast Charging Compatible" : "Fuel Efficient Engine",
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <span>
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          {" / "}
          <a href="/fleet" className="hover:text-primary transition-colors">Fleet</a>
          {" / "}
          <span className="text-foreground">{v.brand} {v.name}</span>
        </span>
      </nav>

      {/* Title + Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">{v.brand} {v.name}</h1>
        <Badge className={categoryColor(v.category)}>
          {CATEGORY_LABELS[v.category]}
        </Badge>
        <Badge variant="outline">{v.year}</Badge>
        {!v.is_available && (
          <Badge variant="destructive">Unavailable</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Gallery + Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <ImageGallery images={v.images} alt={`${v.brand} ${v.name}`} />

          {/* Description */}
          {v.description && (
            <div>
              <h2 className="font-bold text-xl mb-3">About This Vehicle</h2>
              <p className="text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          )}

          <Separator />

          {/* Specs */}
          <div>
            <h2 className="font-bold text-xl mb-4">Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/50"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <spec.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{spec.label}</div>
                    <div className="text-sm font-semibold mt-0.5">{spec.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h2 className="font-bold text-xl mb-4">Features Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Rate</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(v.daily_price)}</p>
                <p className="text-xs text-muted-foreground mt-1">per day, excluding extras</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Insurance from <strong className="text-foreground">€15/day</strong></p>
                <p>GPS from <strong className="text-foreground">€8/day</strong></p>
                <p>Child Seat from <strong className="text-foreground">€5/day</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Calculator */}
        <div className="lg:col-span-1">
          <PriceCalculator vehicle={v} initialFrom={from} initialTo={to} />
        </div>
      </div>
    </div>
  )
}
import Image from "next/image"
import Link from "next/link"
import { Shield, Clock, MapPin, Headphones, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VehicleCard } from "@/components/vehicle-card"
import { HeroSearchForm } from "@/components/hero-search-form"
import { createClient } from "@/lib/supabase/server"
import type { Vehicle } from "@/types"

export const dynamic = "force-dynamic"

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("is_available", true)
      .order("daily_price", { ascending: false })
      .limit(4)
    return (data as Vehicle[]) || []
  } catch {
    return []
  }
}

const whyUsItems = [
  {
    icon: Shield,
    title: "Full Insurance",
    description: "All vehicles come with comprehensive insurance options for complete peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our support team is available around the clock to assist you wherever you are.",
  },
  {
    icon: MapPin,
    title: "GPS Navigation",
    description: "Optional GPS navigation systems available to keep you on the right track.",
  },
  {
    icon: Headphones,
    title: "Flexible Plans",
    description: "Daily, weekly, or monthly rental options tailored to fit your schedule and budget.",
  },
]

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Business Traveler",
    rating: 5,
    text: "Exceptional service! The car was spotless and the booking process was incredibly smooth. Will definitely use JustzRent again.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    name: "James Rodriguez",
    role: "Family Vacation",
    rating: 5,
    text: "Rented the Kia Carnival for our family trip. Perfect condition, great price, and the staff was super helpful. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    name: "Emily Chen",
    role: "Solo Traveler",
    rating: 5,
    text: "The Tesla Model 3 I rented was amazing! Clean, fully charged, and such a pleasure to drive. JustzRent knows quality.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
]

export default async function HomePage() {
  const featuredVehicles = await getFeaturedVehicles()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=85"
            alt="Premium car rental"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Premium Car Rental Service
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 max-w-3xl">
            Drive Your{" "}
            <span className="text-primary">Perfect Car</span>{" "}
            Today
          </h1>
          <p className="text-lg text-white/75 mb-10 max-w-xl">
            Choose from our premium fleet of vehicles. Fast booking, competitive prices, and exceptional service guaranteed.
          </p>

          <HeroSearchForm />

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-white/70 mt-1">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-white/70 mt-1">Vehicles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">4.9</div>
              <div className="text-sm text-white/70 mt-1">Avg. Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 container mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">Our Fleet</p>
            <h2 className="text-3xl md:text-4xl font-bold">Featured Vehicles</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Handpicked premium vehicles for every type of journey.
            </p>
          </div>
          <Link href="/fleet">
            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Vehicles <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            No vehicles available at the moment.
          </div>
        )}
      </section>

      {/* Why Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything You Need</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We go above and beyond to make your rental experience seamless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUsItems.map((item) => (
              <Card key={item.title} className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mx-auto mb-5">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Don&apos;t take our word for it — hear from our satisfied customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i <= t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary/10 border-y border-primary/20">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to Hit the Road?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Browse our full fleet and find the perfect vehicle for your next adventure.
          </p>
          <Link href="/fleet">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
              Browse All Cars
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
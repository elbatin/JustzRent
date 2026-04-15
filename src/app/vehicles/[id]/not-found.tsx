import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"

export default function VehicleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
        <Car className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-3">Vehicle Not Found</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        This vehicle doesn&apos;t exist or may have been removed from our fleet.
      </p>
      <Link href="/fleet">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Browse All Vehicles
        </Button>
      </Link>
    </div>
  )
}
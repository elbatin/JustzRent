"use client"

import { useTransition } from "react"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateBookingStatus } from "@/lib/actions/bookings"
import { toast } from "sonner"

interface BookingStatusButtonsProps {
  bookingId: string
  currentStatus: string
}

export function BookingStatusButtons({
  bookingId,
  currentStatus,
}: BookingStatusButtonsProps) {
  const [isPending, startTransition] = useTransition()

  function handleUpdate(status: "confirmed" | "cancelled") {
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, status)
      if (result?.error) {
        toast.error(`Failed: ${result.error}`)
      } else {
        toast.success(
          status === "confirmed"
            ? "Booking confirmed!"
            : "Booking cancelled."
        )
      }
    })
  }

  if (currentStatus === "cancelled") {
    return (
      <span className="text-xs text-muted-foreground italic">Cancelled</span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus !== "confirmed" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs border-green-500/50 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 gap-1"
          onClick={() => handleUpdate("confirmed")}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3 w-3" />
          )}
          Confirm
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1"
        onClick={() => handleUpdate("cancelled")}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        Cancel
      </Button>
    </div>
  )
}
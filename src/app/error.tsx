"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-destructive/10 mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-semibold mb-3">Something went wrong</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        An unexpected error occurred. Please try again.
      </p>
      <Button
        onClick={reset}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Try Again
      </Button>
    </div>
  )
}
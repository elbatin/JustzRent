import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays } from "date-fns"
import type { BookingExtras, Vehicle } from "@/types"
import { EXTRA_PRICES } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function calculateDays(from: Date, to: Date): number {
  const days = differenceInDays(to, from)
  return days < 1 ? 1 : days
}

export function calculateTotal(
  vehicle: Vehicle,
  from: Date,
  to: Date,
  extras: BookingExtras
): { days: number; basePrice: number; extrasPrice: number; total: number } {
  const days = calculateDays(from, to)
  const basePrice = vehicle.daily_price * days
  const extrasPrice = (Object.keys(extras) as Array<keyof BookingExtras>)
    .filter((k) => extras[k])
    .reduce((sum, k) => sum + EXTRA_PRICES[k] * days, 0)
  return { days, basePrice, extrasPrice, total: basePrice + extrasPrice }
}

export function categoryColor(category: string): string {
  switch (category) {
    case "luxury":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "suv":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "minivan":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    default:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  }
}

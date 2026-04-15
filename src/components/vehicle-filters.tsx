"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CATEGORY_LABELS } from "@/types"

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [string, string][]
const TRANSMISSIONS = ["automatic", "manual"]
const SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
]

export function VehicleFilters({ totalCount }: { totalCount: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<string[]>(
    searchParams.getAll("category")
  )
  const [transmissions, setTransmissions] = useState<string[]>(
    searchParams.getAll("transmission")
  )
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || "200"
  )
  const [sort, setSort] = useState(searchParams.get("sort") || "price_asc")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()
    categories.forEach((c) => params.append("category", c))
    transmissions.forEach((t) => params.append("transmission", t))
    if (maxPrice && maxPrice !== "200") params.set("maxPrice", maxPrice)
    if (sort && sort !== "price_asc") params.set("sort", sort)

    const from = searchParams.get("from")
    const to = searchParams.get("to")
    if (from) params.set("from", from)
    if (to) params.set("to", to)

    router.push(`/fleet?${params.toString()}`, { scroll: false })
  }, [categories, transmissions, maxPrice, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  function toggleTransmission(trans: string) {
    setTransmissions((prev) =>
      prev.includes(trans)
        ? prev.filter((t) => t !== trans)
        : [...prev, trans]
    )
  }

  function clearFilters() {
    setCategories([])
    setTransmissions([])
    setMaxPrice("200")
    setSort("price_asc")
  }

  const hasFilters =
    categories.length > 0 ||
    transmissions.length > 0 ||
    maxPrice !== "200"

  const FilterContent = (
    <div className="space-y-5">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Sort By</h3>
        <Select value={sort} onValueChange={(v) => v && setSort(v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Category */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-2.5">
          {CATEGORIES.map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${value}`}
                checked={categories.includes(value)}
                onCheckedChange={() => toggleCategory(value)}
              />
              <Label
                htmlFor={`cat-${value}`}
                className="text-sm cursor-pointer font-normal"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Transmission */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Transmission</h3>
        <div className="space-y-2.5">
          {TRANSMISSIONS.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <Checkbox
                id={`trans-${t}`}
                checked={transmissions.includes(t)}
                onCheckedChange={() => toggleTransmission(t)}
              />
              <Label
                htmlFor={`trans-${t}`}
                className="text-sm cursor-pointer font-normal capitalize"
              >
                {t}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Max Price */}
      <div>
        <h3 className="font-semibold text-sm mb-3">
          Max Price:{" "}
          <span className="text-primary">€{maxPrice}/day</span>
        </h3>
        <input
          type="range"
          min={30}
          max={200}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>€30</span>
          <span>€200+</span>
        </div>
      </div>

      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
          onClick={clearFilters}
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters & Sort
          {hasFilters && (
            <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {categories.length + transmissions.length}
            </span>
          )}
        </Button>
        <span className="ml-4 text-sm text-muted-foreground">
          {totalCount} vehicles found
        </span>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border border-border rounded-xl p-5 mb-6">
          {FilterContent}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filters
            </h2>
            <span className="text-xs text-muted-foreground">
              {totalCount} vehicles
            </span>
          </div>
          {FilterContent}
        </div>
      </aside>
    </>
  )
}
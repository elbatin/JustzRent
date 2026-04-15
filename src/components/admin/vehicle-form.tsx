"use client"

import { useState, useTransition } from "react"
import { Loader2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles"
import type { Vehicle } from "@/types"
import { toast } from "sonner"

interface VehicleFormProps {
  vehicle?: Vehicle
  onClose?: () => void
}

export function VehicleForm({ vehicle, onClose }: VehicleFormProps) {
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState<string[]>(vehicle?.images || [""])
  const [category, setCategory] = useState<string>(vehicle?.category || "economy")
  const [transmission, setTransmission] = useState<string>(vehicle?.transmission || "automatic")
  const [isAvailable, setIsAvailable] = useState(vehicle?.is_available ?? true)

  function addImageField() {
    setImages((prev) => [...prev, ""])
  }

  function removeImageField(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function updateImage(index: number, value: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)))
  }

  async function handleSubmit(formData: FormData) {
    const input = {
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      year: Number(formData.get("year")),
      category,
      daily_price: Number(formData.get("daily_price")),
      transmission,
      seats: Number(formData.get("seats")),
      fuel_type: formData.get("fuel_type") as string,
      description: formData.get("description") as string,
      images: images.filter((img) => img.trim() !== ""),
      is_available: isAvailable,
    }

    startTransition(async () => {
      const result = vehicle
        ? await updateVehicle(vehicle.id, input)
        : await createVehicle(input)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(vehicle ? "Vehicle updated!" : "Vehicle created!")
        onClose?.()
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand" className="mb-1.5 block">Brand *</Label>
          <Input id="brand" name="brand" defaultValue={vehicle?.brand} required placeholder="Toyota" />
        </div>
        <div>
          <Label htmlFor="name" className="mb-1.5 block">Model Name *</Label>
          <Input id="name" name="name" defaultValue={vehicle?.name} required placeholder="Corolla" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year" className="mb-1.5 block">Year *</Label>
          <Input
            id="year"
            name="year"
            type="number"
            defaultValue={vehicle?.year || new Date().getFullYear()}
            min={2000}
            max={2030}
            required
          />
        </div>
        <div>
          <Label htmlFor="daily_price" className="mb-1.5 block">Daily Price (€) *</Label>
          <Input
            id="daily_price"
            name="daily_price"
            type="number"
            defaultValue={vehicle?.daily_price}
            min={1}
            step={0.01}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">Category *</Label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="minivan">Minivan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">Transmission *</Label>
          <Select value={transmission} onValueChange={(v) => v && setTransmission(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="seats" className="mb-1.5 block">Seats *</Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            defaultValue={vehicle?.seats || 5}
            min={2}
            max={12}
            required
          />
        </div>
        <div>
          <Label htmlFor="fuel_type" className="mb-1.5 block">Fuel Type *</Label>
          <Input
            id="fuel_type"
            name="fuel_type"
            defaultValue={vehicle?.fuel_type}
            required
            placeholder="petrol, diesel, electric, hybrid"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="mb-1.5 block">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={vehicle?.description || ""}
          placeholder="Vehicle description..."
          className="resize-none"
          rows={3}
        />
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Image URLs</Label>
          <Button type="button" variant="outline" size="sm" onClick={addImageField} className="h-7 text-xs gap-1">
            <Plus className="h-3 w-3" /> Add Image
          </Button>
        </div>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1"
              />
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeImageField(i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="is_available"
          checked={isAvailable}
          onCheckedChange={(v) => setIsAvailable(!!v)}
        />
        <Label htmlFor="is_available" className="cursor-pointer font-normal">
          Available for booking
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : vehicle ? (
            "Update Vehicle"
          ) : (
            "Create Vehicle"
          )}
        </Button>
      </div>
    </form>
  )
}
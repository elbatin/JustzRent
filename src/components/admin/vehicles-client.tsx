"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VehicleForm } from "@/components/admin/vehicle-form"
import { deleteVehicle } from "@/lib/actions/vehicles"
import { formatCurrency, categoryColor } from "@/lib/utils"
import { CATEGORY_LABELS } from "@/types"
import { toast } from "sonner"
import type { Vehicle } from "@/types"

interface VehiclesClientProps {
  vehicles: Vehicle[]
}

export function VehiclesClient({ vehicles: initialVehicles }: VehiclesClientProps) {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [createOpen, setCreateOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteVehicle(id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        setVehicles((prev) => prev.filter((v) => v.id !== id))
        toast.success("Vehicle deleted.")
      }
      setDeletingId(null)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vehicles</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} in fleet
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Vehicle Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Vehicle
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                  Details
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Price/Day
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    No vehicles found. Add your first vehicle.
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {vehicle.images?.[0] ? (
                            <Image
                              src={vehicle.images[0]}
                              alt={vehicle.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{vehicle.brand} {vehicle.name}</p>
                          <p className="text-xs text-muted-foreground">{vehicle.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge className={categoryColor(vehicle.category) + " text-xs"}>
                        {CATEGORY_LABELS[vehicle.category]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p className="capitalize">{vehicle.transmission} · {vehicle.fuel_type}</p>
                        <p>{vehicle.seats} seats</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-sm">{formatCurrency(vehicle.daily_price)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          vehicle.is_available
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs"
                        }
                      >
                        {vehicle.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={() => setEditVehicle(vehicle)}
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={deletingId === vehicle.id || isPending}
                        >
                          {deletingId === vehicle.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <VehicleForm onClose={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editVehicle} onOpenChange={(open) => !open && setEditVehicle(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {editVehicle && (
            <VehicleForm
              vehicle={editVehicle}
              onClose={() => setEditVehicle(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
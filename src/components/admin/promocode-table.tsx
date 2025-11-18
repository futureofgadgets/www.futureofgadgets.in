"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label} from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Trash2, Plus, Edit, Tag } from "lucide-react"
import LoadingButton from "../ui/loading-button"

const promoSchema = z.object({
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  discount: z.number().min(1, "Discount must be at least 1").max(100, "Discount cannot exceed 100"),
  type: z.enum(["all", "product"]),
  productIds: z.array(z.string()),
  isActive: z.boolean(),
  expiresAt: z.string().optional()
})

type PromoFormData = z.infer<typeof promoSchema>

type PromoCode = {
  id: string
  code: string
  description: string
  discount: number
  type: string
  productIds: string[]
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

type Product = {
  id: string
  name: string
}

export default function PromoCodeTable() {
  const [promocodes, setPromocodes] = useState<PromoCode[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { register, handleSubmit, control, formState: { errors }, setValue, watch, reset } = useForm<PromoFormData>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "all",
      productIds: [],
      isActive: true,
      expiresAt: ""
    }
  })

  const watchType = watch("type")
  const watchProductIds = watch("productIds")

  useEffect(() => {
    fetchPromocodes()
    fetchProducts()
  }, [])

  const fetchPromocodes = async () => {
    setIsLoading(true)
    const res = await fetch("/api/promocodes")
    const data = await res.json()
    setPromocodes(Array.isArray(data) ? data : [])
    setIsLoading(false)
  }

  const fetchProducts = async () => {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
  }

  const onSubmit = async (data: PromoFormData) => {
    setIsSubmitting(true)
    try {
      const url = editingId ? `/api/promocodes/${editingId}` : "/api/promocodes"
      const method = editingId ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.error || "Failed to save promo code")
        return
      }

      toast.success(editingId ? "Promo code updated" : "Promo code created")
      await fetchPromocodes()
      setShowDialog(false)
      resetForm()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const res = await fetch(`/api/promocodes/${deletingId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Promo code deleted")
        fetchPromocodes()
      }
    } catch (error) {
      toast.error("Failed to delete")
    } finally {
      setShowDeleteDialog(false)
      setDeletingId(null)
    }
  }

  const handleEdit = (promo: PromoCode) => {
    setEditingId(promo.id)
    reset({
      code: promo.code,
      description: promo.description,
      discount: promo.discount,
      type: promo.type as "all" | "product",
      productIds: promo.productIds,
      isActive: promo.isActive,
      expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().split('T')[0] : ""
    })
    setShowDialog(true)
  }

  const resetForm = () => {
    setEditingId(null)
    reset({
      code: "",
      description: "",
      type: "all",
      productIds: [],
      isActive: true,
      expiresAt: ""
    })
  }

  const toggleProductSelection = (productId: string) => {
    const current = watchProductIds
    setValue("productIds", current.includes(productId)
      ? current.filter(id => id !== productId)
      : [...current, productId]
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="sm:flex items-center justify-between max-w-6xl px-4 py-4 border-b border-gray-200">
          <div className="pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Promo Codes</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Manage discount codes for products and orders</p>
            <p className="text-sm sm:text-base text-gray-900">Loading...</p>
          </div>
          <Button disabled className="gap-2">
            <Plus className="w-4 h-4" />
            Add Promo Code
          </Button>
        </div>

        <div className="flex-1 p-0 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Code</TableHead>
                    <TableHead className="hidden sm:block px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Discount</TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expires</TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400 hidden sm:block" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:block px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></TableCell>
                      <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></TableCell>
                      <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                      <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sm:flex items-center justify-between max-w-6xl px-4 py-4 border-b border-gray-200">
        <div className="pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Promo Codes</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Manage discount codes for products and orders</p>
          <p className="text-sm sm:text-base text-gray-900">{promocodes.length} promo codes</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true) }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Promo Code
        </Button>
      </div>

      <div className="flex-1 p-0 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Code</TableHead>
                <TableHead className="hidden sm:block px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Discount</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expires</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
                    <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></TableCell>
                    <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></TableCell>
                    <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                    <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                    <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                    <TableCell className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                  </TableRow>
                ))
              ) : promocodes.length === 0 ? (
                <TableRow className="hover:!bg-transparent">
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center">
                      <Tag className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No promo codes yet</h3>
                      <p className="text-gray-500">Create your first promo code to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                promocodes.map((promo) => (
                <TableRow key={promo.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400 hidden sm:block" />
                      <span className="font-mono font-semibold text-sm">{promo.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:block px-6 py-4 text-sm text-gray-600">{promo.description.slice(0, 20)}...</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-semibold">{promo.discount}%</TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {promo.type === "all" ? "All Products" : `${promo.productIds.length} Products`}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${promo.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">
                    {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : "No expiry"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(promo)} className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setDeletingId(promo.id); setShowDeleteDialog(true) }} className="h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm() }}>
        <DialogContent className="max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Promo Code</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-1">Code</Label>
              <Input
                {...register("code", {
                  setValueAs: (v) => v.toUpperCase()
                })}
                placeholder="SAVE20"
              />
              {errors.code && <p className="text-xs text-red-600 mt-1">{errors.code.message}</p>}
            </div>

            <div>
              <Label className="mb-1">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Get 20% off on all products"
                className="max-w-[32vw]"
              />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <Label className="mb-1">Discount (%)</Label>
              <Input
                type="number"
                {...register("discount", { valueAsNumber: true })}
                placeholder="20"
                min="1"
                max="100"
              />
              {errors.discount && <p className="text-xs text-red-600 mt-1">{errors.discount.message}</p>}
            </div>

            <div>
              <Label className="mb-1">Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value) => { field.onChange(value); setValue("productIds", []) }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="product">Specific Products</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {watchType === "product" && (
              <div>
                <Label className="mb-1">Select Products</Label>
                <div className="border rounded p-3 max-h-48 overflow-y-auto">
                  {products.map((product) => (
                    <label key={product.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={watchProductIds.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                      <span className="text-sm">{product.name.slice(0,50)}...</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="mb-1">Expiry Date (Optional)</Label>
              <Input
                type="date"
                {...register("expiresAt")}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="w-4 h-4 cursor-pointer"
              />
              <Label htmlFor="isActive" className="cursor-pointer mb-0">Active</Label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => { setShowDialog(false); resetForm() }} disabled={isSubmitting}>
                Cancel
              </Button>
              <LoadingButton type="submit" loading={isSubmitting}>
                {editingId ? "Update" : "Create"}
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promo Code?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the promo code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"

interface AddProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductAdded: () => void
}

export function AddProductModal({ open, onOpenChange, onProductAdded }: AddProductModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    presentation: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    image: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!formData.name || !formData.presentation || !formData.price || !formData.cost) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(formData.price) <= 0 || Number.parseFloat(formData.cost) <= 0) {
      toast({
        title: "Error",
        description: "El precio y costo deben ser mayores a 0",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Crear el objeto producto
      const newProduct: Omit<Product, "id"> = {
        name: formData.name,
        presentation: formData.presentation,
        price: Number.parseFloat(formData.price),
        cost: Number.parseFloat(formData.cost),
        stock: Number.parseInt(formData.stock) || 0,
        minStock: Number.parseInt(formData.minStock) || 5,
        image: formData.image || "/placeholder.svg",
      }

      // Simular guardado en la base de datos
      const products = JSON.parse(localStorage.getItem("products") || "[]")
      const productWithId = {
        ...newProduct,
        id: Date.now().toString(),
      }
      products.push(productWithId)
      localStorage.setItem("products", JSON.stringify(products))

      toast({
        title: "Producto agregado",
        description: `${newProduct.name} ${newProduct.presentation} ha sido agregado correctamente`,
      })

      // Limpiar formulario
      setFormData({
        name: "",
        presentation: "",
        price: "",
        cost: "",
        stock: "",
        minStock: "",
        image: "",
      })

      // Cerrar modal y actualizar lista
      onOpenChange(false)
      onProductAdded()
    } catch (error) {
      console.error("Error al agregar producto:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>Complete la información del nuevo producto</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Producto *</Label>
            <Input
              id="name"
              placeholder="Ej: Pomada Mentolada"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="presentation">Presentación *</Label>
            <Input
              id="presentation"
              placeholder="Ej: 30g, 60g, 90g"
              value={formData.presentation}
              onChange={(e) => handleInputChange("presentation", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Precio de Venta *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Costo *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minStock">Stock Mínimo</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                placeholder="5"
                value={formData.minStock}
                onChange={(e) => handleInputChange("minStock", e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">URL de Imagen (Opcional)</Label>
            <Input
              id="image"
              placeholder="/images/producto.png"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-mentolarte-green hover:bg-mentolarte-green/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar Producto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

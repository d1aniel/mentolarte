"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface InventoryAlertProps {
  products?: Product[]
}

export function InventoryAlert({ products = [] }: InventoryAlertProps) {
  // Validar que tenemos datos
  if (!products || products.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Cargando productos...</div>
  }

  // Filtrar productos con stock bajo
  const lowStockProducts = products.filter((product) => product.stock <= product.minStock)

  if (lowStockProducts.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No hay productos con stock bajo</div>
  }

  return (
    <div className="space-y-4">
      {lowStockProducts.map((product) => (
        <Alert
          key={product.id}
          variant={
            product.stock === 0 ? "destructive" : product.stock <= product.minStock / 2 ? "destructive" : undefined
          }
          className={
            product.stock === 0
              ? "border-mentolarte-red"
              : product.stock <= product.minStock / 2
                ? "border-mentolarte-red"
                : "border-mentolarte-green"
          }
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {product.name} {product.presentation}
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Stock actual: {product.stock} unidades (mínimo: {product.minStock})
            </span>
            <Button
              size="sm"
              variant="outline"
              className={
                product.stock === 0 || product.stock <= product.minStock / 2
                  ? "text-mentolarte-red border-mentolarte-red hover:bg-mentolarte-red/10"
                  : "text-mentolarte-green border-mentolarte-green hover:bg-mentolarte-green/10"
              }
              onClick={() => {
                // Esta función se implementaría para abrir el diálogo de reabastecimiento
                // o redirigir a la página de inventario
                window.location.href = "/inventario"
              }}
            >
              Reabastecer
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Product, Sale } from "@/lib/types"

interface RecentSalesProps {
  sales?: Sale[]
  products?: Product[]
}

export function RecentSales({ sales = [], products = [] }: RecentSalesProps) {
  // Validar que tenemos datos
  if (!sales || !products) {
    return <div className="text-center py-4 text-muted-foreground">Cargando datos...</div>
  }

  // Obtener las 5 ventas más recientes
  const recentSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  if (recentSales.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No hay ventas registradas</div>
  }

  return (
    <div className="space-y-8">
      {recentSales.map((sale) => {
        // Obtener las iniciales del cliente
        const initials = sale.customer
          .split(" ")
          .map((name) => name.charAt(0))
          .join("")
          .toUpperCase()
          .slice(0, 2)

        // Crear descripción de productos
        const productDescription = sale.items
          .map((item) => {
            const product = products.find((p) => p.id === item.productId)
            return product ? `${product.presentation} (${item.quantity})` : `Producto (${item.quantity})`
          })
          .join(", ")

        return (
          <div key={sale.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{sale.customer}</p>
              <p className="text-sm text-muted-foreground">{productDescription}</p>
            </div>
            <div className="ml-auto font-medium">+${sale.total.toFixed(2)}</div>
          </div>
        )
      })}
    </div>
  )
}

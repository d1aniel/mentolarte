"use client"

import { useTheme } from "next-themes"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { Product, Sale } from "@/lib/types"

interface ProductPerformanceProps {
  products?: Product[]
  sales?: Sale[]
}

export function ProductPerformance({ products = [], sales = [] }: ProductPerformanceProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Validar que tenemos datos antes de procesarlos
  if (!products || !sales || products.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
        {products?.length === 0 ? "No hay productos registrados" : "Cargando datos..."}
      </div>
    )
  }

  // Calcular ventas por presentación
  const salesByPresentation = products
    .map((product) => {
      const totalSold = sales.reduce((sum, sale) => {
        const saleItem = sale.items.find((item) => item.productId === product.id)
        return sum + (saleItem ? saleItem.quantity : 0)
      }, 0)

      return {
        name: `Pomada ${product.presentation}`,
        value: totalSold,
        color: product.presentation === "30g" ? "#22c55e" : product.presentation === "60g" ? "#dc2626" : "#86efac",
      }
    })
    .filter((item) => item.value > 0) // Solo mostrar productos con ventas

  if (salesByPresentation.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
        No hay datos de ventas disponibles
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={salesByPresentation}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {salesByPresentation.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#333" : "#fff",
              color: isDark ? "#fff" : "#333",
              border: `1px solid ${isDark ? "#444" : "#ddd"}`,
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

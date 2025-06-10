"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Boxes, DollarSign, Package, TrendingUp, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryAlert } from "@/components/inventory-alert"
import { RecentSales } from "@/components/recent-sales"
import { SalesChart } from "@/components/sales-chart"
import { ProductPerformance } from "@/components/product-performance"
import { MentolarteLogo } from "@/components/mentolarte-logo"
import { useToast } from "@/components/ui/use-toast"
import type { Product, Sale } from "@/lib/types"
import { getProducts, getSales } from "./actions"
import { authService } from "@/lib/auth"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Métricas calculadas
  const [totalSales, setTotalSales] = useState(0)
  const [totalUnits, setTotalUnits] = useState(0)
  const [totalInventory, setTotalInventory] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [lowStockCount, setLowStockCount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Verificar autenticación y cargar datos
  useEffect(() => {
    if (!mounted) return

    async function initializeApp() {
      // Verificar autenticación
      if (!authService.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        // Cargar datos
        const productsData = await getProducts()
        const salesData = await getSales()

        setProducts(productsData)
        setSales(salesData)

        // Calcular métricas
        calculateMetrics(productsData, salesData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Intente nuevamente.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [mounted, router, toast])

  // Calcular métricas
  const calculateMetrics = (products: Product[], sales: Sale[]) => {
    // Total de ventas
    const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.total, 0)
    setTotalSales(totalSalesAmount)

    // Total de unidades vendidas
    const totalUnitsSold = sales.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
    }, 0)
    setTotalUnits(totalUnitsSold)

    // Total de inventario
    const totalInventoryCount = products.reduce((sum, product) => sum + product.stock, 0)
    setTotalInventory(totalInventoryCount)

    // Productos con stock bajo
    const lowStockProducts = products.filter((product) => product.stock <= product.minStock)
    setLowStockCount(lowStockProducts.length)

    // Ganancia total (estimada)
    setTotalProfit(totalSalesAmount * 0.5)
  }

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        <p className="mt-2">Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
          <MentolarteLogo showText={true} size="lg" />
          <h1 className="mt-4 text-2xl font-bold text-green-600">Sistema de Gestión</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-green-500 border-t-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card className="border-green-500 border-t-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalUnits}</div>
              <p className="text-xs text-muted-foreground">+201 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card className="border-green-500 border-t-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventario Total</CardTitle>
              <Boxes className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInventory}</div>
              <p className="text-xs text-muted-foreground">{lowStockCount} productos con stock bajo</p>
            </CardContent>
          </Card>
          <Card className="border-green-500 border-t-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancia</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalProfit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+18.7% desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-red-500 border-t-4">
            <CardHeader>
              <CardTitle>Ventas Mensuales</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <SalesChart />
            </CardContent>
          </Card>
          <Card className="col-span-3 border-red-500 border-t-4">
            <CardHeader>
              <CardTitle>Alertas de Inventario</CardTitle>
              <CardDescription>Productos con stock por debajo del mínimo establecido</CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryAlert products={products} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-red-500 border-t-4">
            <CardHeader>
              <CardTitle>Ventas Recientes</CardTitle>
              <CardDescription>Has realizado {sales.length} ventas</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales sales={sales} products={products} />
            </CardContent>
          </Card>
          <Card className="col-span-3 border-red-500 border-t-4">
            <CardHeader>
              <CardTitle>Rendimiento de Productos</CardTitle>
              <CardDescription>Comparativa de ventas por presentación</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductPerformance products={products} sales={sales} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

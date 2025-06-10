"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesChart } from "@/components/sales-chart"
import { ProductPerformance } from "@/components/product-performance"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Product, Sale } from "@/lib/types"
import { getProducts, getSales } from "../actions"

export default function EstadisticasPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  // Métricas calculadas
  const [totalSales, setTotalSales] = useState(0)
  const [totalUnits, setTotalUnits] = useState(0)
  const [averageTicket, setAverageTicket] = useState(0)
  const [monthlyGrowth, setMonthlyGrowth] = useState(0)

  // Cargar datos
  useEffect(() => {
    async function loadData() {
      try {
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

    loadData()
  }, [toast])

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

    // Ticket promedio
    const avgTicket = sales.length > 0 ? totalSalesAmount / sales.length : 0
    setAverageTicket(avgTicket)

    // Crecimiento mensual (simulado)
    setMonthlyGrowth(20.1)
  }

  // Calcular productos más vendidos
  const getTopProducts = () => {
    const productSales = products.map((product) => {
      const totalSold = sales.reduce((sum, sale) => {
        const saleItem = sale.items.find((item) => item.productId === product.id)
        return sum + (saleItem ? saleItem.quantity : 0)
      }, 0)

      return {
        ...product,
        totalSold,
      }
    })

    return productSales.sort((a, b) => b.totalSold - a.totalSold)
  }

  // Calcular rotación de inventario
  const getInventoryRotation = () => {
    return products.map((product) => {
      const totalSold = sales.reduce((sum, sale) => {
        const saleItem = sale.items.find((item) => item.productId === product.id)
        return sum + (saleItem ? saleItem.quantity : 0)
      }, 0)

      // Rotación = ventas / stock promedio (simulado)
      const rotation = product.stock > 0 ? (totalSold / product.stock) * 4.2 : 0

      return {
        ...product,
        rotation: rotation.toFixed(1),
      }
    })
  }

  // Calcular rentabilidad por producto
  const getProductProfitability = () => {
    return products.map((product) => {
      const margin = ((product.price - product.cost) / product.cost) * 100
      return {
        ...product,
        margin: margin.toFixed(0),
      }
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mentolarte-green" />
        <p className="mt-2">Cargando estadísticas...</p>
      </div>
    )
  }

  const topProducts = getTopProducts()
  const inventoryRotation = getInventoryRotation()
  const productProfitability = getProductProfitability()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-lg font-semibold md:text-2xl text-mentolarte-green">Estadísticas y Reportes</h1>

        <Tabs defaultValue="ventas" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="financiero">Financiero</TabsTrigger>
          </TabsList>

          <TabsContent value="ventas" className="mt-4 space-y-4">
            <Card className="border-mentolarte-green border-t-4">
              <CardHeader>
                <CardTitle>Ventas Mensuales</CardTitle>
                <CardDescription>Comparativa de ventas por presentación</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-mentolarte-red border-t-4">
                <CardHeader>
                  <CardTitle>Ventas por Presentación</CardTitle>
                  <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductPerformance products={products} sales={sales} />
                </CardContent>
              </Card>

              <Card className="border-mentolarte-red border-t-4">
                <CardHeader>
                  <CardTitle>Métricas de Ventas</CardTitle>
                  <CardDescription>Resumen de indicadores clave</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Ventas Totales</p>
                        <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Unidades Vendidas</p>
                        <p className="text-2xl font-bold">{totalUnits}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
                        <p className="text-2xl font-bold">${averageTicket.toFixed(2)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Ventas vs Mes Anterior</p>
                        <p className="text-2xl font-bold text-green-500">+{monthlyGrowth}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="productos" className="mt-4 space-y-4">
            <Card className="border-mentolarte-green border-t-4">
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Ranking de productos por unidades vendidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {topProducts.map((product, index) => {
                    const maxSold = Math.max(...topProducts.map((p) => p.totalSold))
                    const percentage = maxSold > 0 ? (product.totalSold / maxSold) * 100 : 0

                    return (
                      <div key={product.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {product.name} {product.presentation}
                          </p>
                          <p className="text-sm font-medium">{product.totalSold} unidades</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-mentolarte-green"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-mentolarte-red border-t-4">
              <CardHeader>
                <CardTitle>Rotación de Inventario</CardTitle>
                <CardDescription>Análisis de la rotación de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {inventoryRotation.map((product) => (
                      <div key={product.id} className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Pomada {product.presentation}</p>
                        <p className="text-xl font-bold">{product.rotation}x</p>
                        <p className="text-xs text-muted-foreground">Rotación mensual</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financiero" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-mentolarte-green border-t-4">
                <CardHeader>
                  <CardTitle>Rentabilidad por Producto</CardTitle>
                  <CardDescription>Análisis de margen de ganancia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {productProfitability.map((product) => (
                      <div key={product.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {product.name} {product.presentation}
                          </p>
                          <p className="text-sm font-medium">{product.margin}% margen</p>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-muted-foreground">Costo: ${product.cost.toFixed(2)}</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">Precio: ${product.price.toFixed(2)}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${Math.min(Number.parseInt(product.margin), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-mentolarte-red border-t-4">
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                  <CardDescription>Análisis de ingresos y ganancias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                        <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Costos Totales</p>
                        <p className="text-2xl font-bold">${(totalSales * 0.5).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Ganancia Neta</p>
                        <p className="text-2xl font-bold text-green-500">${(totalSales * 0.5).toFixed(2)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Margen de Ganancia</p>
                        <p className="text-2xl font-bold text-green-500">50.0%</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm font-medium text-muted-foreground">Tendencia de Ganancias</p>
                      <div className="mt-2 h-[120px] w-full">
                        <div className="flex h-full items-end gap-2">
                          {[40, 30, 45, 50, 60, 55, 65].map((height, i) => (
                            <div key={i} className="flex-1">
                              <div className="bg-mentolarte-green rounded-t" style={{ height: `${height}%` }}></div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <div>Ene</div>
                          <div>Feb</div>
                          <div>Mar</div>
                          <div>Abr</div>
                          <div>May</div>
                          <div>Jun</div>
                          <div>Jul</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-mentolarte-green border-t-4">
              <CardHeader>
                <CardTitle>Retorno de Inversión (ROI)</CardTitle>
                <CardDescription>Análisis del retorno de inversión por producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {productProfitability.map((product) => (
                    <div key={product.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {product.name} {product.presentation}
                        </p>
                        <p className="text-sm font-medium">ROI: {product.margin}%</p>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${Math.min(Number.parseInt(product.margin), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

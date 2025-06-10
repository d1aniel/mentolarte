"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Product, InventoryMovement } from "@/lib/types"
import { getProducts, restockProduct, getInventoryMovements } from "../actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddProductModal } from "@/components/add-product-modal" 
import { ResetDatabaseButton } from "@/components/reset-database-button"

export default function InventarioPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([])

  // Estados para el formulario de reabastecimiento
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [cost, setCost] = useState<number>(0)

  // Estados para el diálogo de reabastecimiento
  const [restockDialogOpen, setRestockDialogOpen] = useState(false)
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(null)
  const [restockQuantity, setRestockQuantity] = useState<number>(1)
  const [restockCost, setRestockCost] = useState<number>(0)

  // Agregar estos estados después de los estados existentes:
  const [addProductModalOpen, setAddProductModalOpen] = useState(false)

  // Cargar productos
  useEffect(() => {
    async function loadProducts() {
      try {
        const productsData = await getProducts()
        const movementsData = await getInventoryMovements()
        setProducts(productsData)
        setInventoryMovements(movementsData)

        if (productsData.length > 0 && !selectedProduct) {
          setSelectedProduct(productsData[0].id)
          setCost(productsData[0].cost)
        }
      } catch (error) {
        console.error("Error al cargar productos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos. Intente nuevamente.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [toast, selectedProduct])

  // Manejar cambio de producto seleccionado
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value
    setSelectedProduct(productId)

    const product = products.find((p) => p.id === productId)
    if (product) {
      setCost(product.cost)
    }
  }

  // Manejar reabastecimiento desde el formulario principal
  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Seleccione un producto para reabastecer",
        variant: "destructive",
      })
      return
    }

    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    if (cost <= 0) {
      toast({
        title: "Error",
        description: "El costo debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const result = await restockProduct(selectedProduct, quantity, cost)

      if (result.success) {
        toast({
          title: "Reabastecimiento exitoso",
          description: "El producto ha sido reabastecido correctamente",
        })

        // Actualizar la lista de productos
        const updatedProducts = await getProducts()
        setProducts(updatedProducts)

        // Limpiar el formulario
        setQuantity(1)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error al reabastecer producto:", error)
      toast({
        title: "Error",
        description: "No se pudo reabastecer el producto. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Abrir diálogo de reabastecimiento rápido
  const openRestockDialog = (product: Product) => {
    setRestockingProduct(product)
    setRestockQuantity(1)
    setRestockCost(product.cost)
    setRestockDialogOpen(true)
  }

  // Manejar reabastecimiento desde el diálogo
  const handleQuickRestock = async () => {
    if (!restockingProduct) return

    try {
      setSubmitting(true)

      const result = await restockProduct(restockingProduct.id, restockQuantity, restockCost)

      if (result.success) {
        toast({
          title: "Reabastecimiento exitoso",
          description: `${restockingProduct.name} ${restockingProduct.presentation} ha sido reabastecido correctamente`,
        })

        // Actualizar la lista de productos
        const updatedProducts = await getProducts()
        setProducts(updatedProducts)

        // Cerrar el diálogo
        setRestockDialogOpen(false)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error al reabastecer producto:", error)
      toast({
        title: "Error",
        description: "No se pudo reabastecer el producto. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Función para refrescar los productos después de agregar uno nuevo:
  const refreshProducts = async () => {
    try {
      const productsData = await getProducts()
      const movementsData = await getInventoryMovements()
      setProducts(productsData)
      setInventoryMovements(movementsData)
    } catch (error) {
      console.error("Error al refrescar productos:", error)
      toast({
        title: "Error",
        description: "No se pudieron refrescar los productos",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mentolarte-green" />
        <p className="mt-2">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl text-mentolarte-green">Inventario</h1>
          <div className="flex items-center gap-2">
            <ResetDatabaseButton onReset={refreshProducts} />
            <Button
              className="bg-mentolarte-green hover:bg-mentolarte-green/90"
              onClick={() => setAddProductModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </div>
        </div>

        <Tabs defaultValue="inventario" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="historial">Historial de Reabastecimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="inventario" className="mt-4 space-y-4">
            <div className="border shadow-sm rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Presentación</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Stock Mínimo</TableHead>
                    <TableHead>Precio Venta</TableHead>
                    <TableHead>Costo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                        No hay productos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={`${product.name} ${product.presentation}`}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                        </TableCell>
                        <TableCell>{product.presentation}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.minStock}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>${product.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          {product.stock <= product.minStock ? (
                            <Badge variant="destructive" className="bg-mentolarte-red">
                              Stock Bajo
                            </Badge>
                          ) : (
                            <Badge className="bg-mentolarte-green">En Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-mentolarte-green hover:text-green-700 hover:bg-green-50"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-mentolarte-red hover:text-red-700 hover:bg-red-50"
                            onClick={() => openRestockDialog(product)}
                          >
                            Reabastecer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Card className="border-mentolarte-green border-t-4">
              <CardHeader>
                <CardTitle>Reabastecimiento</CardTitle>
                <CardDescription>Registra la entrada de nuevos productos al inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={handleRestock}>
                  <div className="grid gap-2">
                    <label htmlFor="product">Producto</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedProduct}
                      onChange={handleProductChange}
                      disabled={submitting}
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} {product.presentation}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="quantity">Cantidad</label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="Cantidad"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                      disabled={submitting}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="cost">Costo Unitario</label>
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Costo"
                      value={cost}
                      onChange={(e) => setCost(Number.parseFloat(e.target.value) || 0)}
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      className="w-full bg-mentolarte-red hover:bg-mentolarte-red/90"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Registrar Entrada"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historial" className="mt-4">
            <Card className="border-mentolarte-red border-t-4">
              <CardHeader>
                <CardTitle>Historial de Reabastecimiento</CardTitle>
                <CardDescription>Registro de todos los movimientos de entrada al inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border shadow-sm rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Imagen</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Costo Unitario</TableHead>
                        <TableHead>Costo Total</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryMovements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No hay movimientos de inventario registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        inventoryMovements
                          .filter((movement) => movement.type === "entrada")
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((movement) => {
                            const product = products.find((p) => p.id === movement.productId)
                            return (
                              <TableRow key={movement.id}>
                                <TableCell>{new Date(movement.date).toLocaleDateString("es-ES")}</TableCell>
                                <TableCell className="font-medium">
                                  {product ? `${product.name} ${product.presentation}` : "Producto eliminado"}
                                </TableCell>
                                <TableCell>
                                  {product && (
                                    <Image
                                      src={product.image || "/placeholder.svg"}
                                      alt={`${product.name} ${product.presentation}`}
                                      width={50}
                                      height={50}
                                      className="rounded-md"
                                    />
                                  )}
                                </TableCell>
                                <TableCell>{movement.quantity}</TableCell>
                                <TableCell>${movement.cost?.toFixed(2) || "0.00"}</TableCell>
                                <TableCell>${((movement.cost || 0) * movement.quantity).toFixed(2)}</TableCell>
                                <TableCell>
                                  <Badge className="bg-mentolarte-green">Entrada</Badge>
                                </TableCell>
                              </TableRow>
                            )
                          })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Diálogo de reabastecimiento rápido */}
      <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reabastecer Producto</DialogTitle>
            <DialogDescription>
              Ingrese la cantidad y costo para reabastecer {restockingProduct?.name} {restockingProduct?.presentation}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              {restockingProduct && (
                <Image
                  src={restockingProduct.image || "/placeholder.svg"}
                  alt={`${restockingProduct.name} ${restockingProduct.presentation}`}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              )}
              <div>
                <h3 className="font-medium">
                  {restockingProduct?.name} {restockingProduct?.presentation}
                </h3>
                <p className="text-sm text-muted-foreground">Stock actual: {restockingProduct?.stock} unidades</p>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="restock-quantity">Cantidad a reabastecer</label>
              <Input
                id="restock-quantity"
                type="number"
                min="1"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Number.parseInt(e.target.value) || 0)}
                disabled={submitting}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="restock-cost">Costo unitario</label>
              <Input
                id="restock-cost"
                type="number"
                min="0"
                step="0.01"
                value={restockCost}
                onChange={(e) => setRestockCost(Number.parseFloat(e.target.value) || 0)}
                disabled={submitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRestockDialogOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              className="bg-mentolarte-green hover:bg-mentolarte-green/90"
              onClick={handleQuickRestock}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Reabastecer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AddProductModal
        open={addProductModalOpen}
        onOpenChange={setAddProductModalOpen}
        onProductAdded={refreshProducts}
      />
    </div>
  )
}

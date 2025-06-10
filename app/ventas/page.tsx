"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/hooks/use-cart"
import type { Product, Sale } from "@/lib/types"
import { getProducts, getSales, addSale } from "../actions"
import { InvoiceModal } from "@/components/invoice-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function VentasPage() {
  const { toast } = useToast()
  const { cart, total, addToCart, removeFromCart, clearCart } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [showInvoice, setShowInvoice] = useState(false)
  const [currentSale, setCurrentSale] = useState<Sale | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Cargar productos y ventas
  useEffect(() => {
    async function loadData() {
      try {
        const productsData = await getProducts()
        const salesData = await getSales()
        setProducts(productsData)
        setSales(salesData)
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

  // Manejar la selección de un producto
  const handleSelectProduct = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Sin stock",
        description: `No hay unidades disponibles de ${product.name} ${product.presentation}`,
        variant: "destructive",
      })
      return
    }

    addToCart(product, 1)
    toast({
      title: "Producto agregado",
      description: `${product.name} ${product.presentation} agregado al carrito`,
    })
  }

  // Manejar la eliminación de un producto del carrito
  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
    toast({
      title: "Producto eliminado",
      description: "Producto eliminado del carrito",
    })
  }

  // Completar la venta
  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agregue productos al carrito para completar la venta",
        variant: "destructive",
      })
      return
    }

    if (!customerName.trim()) {
      toast({
        title: "Nombre de cliente requerido",
        description: "Ingrese el nombre del cliente para completar la venta",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // Crear objeto de venta
      const sale: Omit<Sale, "id"> = {
        date: new Date(),
        customer: customerName,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.subtotal,
        })),
        total,
      }

      // Guardar la venta
      const result = await addSale(sale)

      if (result.success && result.sale) {
        // Mostrar la factura
        setCurrentSale(result.sale)
        setShowInvoice(true)

        toast({
          title: "Venta completada",
          description: `Venta registrada correctamente con ID: ${result.sale?.id}`,
        })

        // Limpiar el carrito y el nombre del cliente
        clearCart()
        setCustomerName("")

        // Actualizar la lista de ventas
        const updatedSales = await getSales()
        setSales(updatedSales)

        // Actualizar la lista de productos (para reflejar el nuevo stock)
        const updatedProducts = await getProducts()
        setProducts(updatedProducts)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error al completar la venta:", error)
      toast({
        title: "Error",
        description: "No se pudo completar la venta. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelSale = () => {
    if (cart.length === 0) {
      toast({
        title: "No hay productos",
        description: "No hay productos en el carrito para cancelar",
        variant: "destructive",
      })
      return
    }
    setShowCancelDialog(true)
  }

  const confirmCancelSale = () => {
    clearCart()
    setCustomerName("")
    setShowCancelDialog(false)
    toast({
      title: "Compra cancelada",
      description: "Se ha cancelado la compra y limpiado el carrito",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mentolarte-green" />
        <p className="mt-2">Cargando datos...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="nueva-venta" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nueva-venta">Nueva Venta</TabsTrigger>
            <TabsTrigger value="historial">Historial de Ventas</TabsTrigger>
          </TabsList>
          <TabsContent value="nueva-venta" className="mt-4">
            <Card className="border-mentolarte-green border-t-4">
              <CardHeader>
                <CardTitle>Nueva Venta</CardTitle>
                <CardDescription>Registra una nueva venta de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="customer">Nombre del Cliente</label>
                      <Input
                        id="customer"
                        placeholder="Ingrese el nombre del cliente"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className={`p-4 border ${
                          product.stock <= 0
                            ? "border-gray-300 opacity-60"
                            : "border-mentolarte-green hover:shadow-md transition-shadow cursor-pointer"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={`${product.name} ${product.presentation}`}
                            width={120}
                            height={120}
                            className="mb-4"
                          />
                          <h3 className="font-medium text-center">
                            {product.name} {product.presentation}
                          </h3>
                          <p className="text-mentolarte-red font-bold mt-2">${product.price.toFixed(2)}</p>
                          <p
                            className={`text-sm mt-1 ${product.stock <= product.minStock ? "text-mentolarte-red" : "text-muted-foreground"}`}
                          >
                            Stock: {product.stock} unidades
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 border-mentolarte-green text-mentolarte-green hover:bg-mentolarte-green hover:text-white"
                            onClick={() => handleSelectProduct(product)}
                            disabled={product.stock <= 0}
                          >
                            {product.stock <= 0 ? "Sin Stock" : "Seleccionar"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="border shadow-sm rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Imagen</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Precio Unitario</TableHead>
                          <TableHead>Subtotal</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              No hay productos en el carrito
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {cart.map((item) => (
                              <TableRow key={item.product.id}>
                                <TableCell className="font-medium">
                                  {item.product.name} {item.product.presentation}
                                </TableCell>
                                <TableCell>
                                  <Image
                                    src={item.product.image || "/placeholder.svg"}
                                    alt={`${item.product.name} ${item.product.presentation}`}
                                    width={50}
                                    height={50}
                                    className="rounded-md"
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => {
                                        const newQuantity = Math.max(1, item.quantity - 1)
                                        addToCart(item.product, newQuantity - item.quantity)
                                      }}
                                    >
                                      -
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => {
                                        if (item.quantity < item.product.stock) {
                                          addToCart(item.product, 1)
                                        } else {
                                          toast({
                                            title: "Stock insuficiente",
                                            description: `Solo hay ${item.product.stock} unidades disponibles`,
                                            variant: "destructive",
                                          })
                                        }
                                      }}
                                      disabled={item.quantity >= item.product.stock}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell>${item.product.price.toFixed(2)}</TableCell>
                                <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-mentolarte-red hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleRemoveFromCart(item.product.id)}
                                  >
                                    Eliminar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={4} className="text-right font-bold">
                                Total:
                              </TableCell>
                              <TableCell className="font-bold">${total.toFixed(2)}</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="w-full md:w-auto border-mentolarte-red text-mentolarte-red hover:bg-mentolarte-red hover:text-white"
                      size="lg"
                      onClick={handleCancelSale}
                      disabled={submitting || cart.length === 0}
                    >
                      Cancelar Compra
                    </Button>
                    <Button
                      className="w-full md:w-auto bg-mentolarte-red hover:bg-mentolarte-red/90"
                      size="lg"
                      onClick={handleCompleteSale}
                      disabled={submitting || cart.length === 0}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Completar Venta
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="historial" className="mt-4">
            <Card className="border-mentolarte-red border-t-4">
              <CardHeader>
                <CardTitle>Historial de Ventas</CardTitle>
                <CardDescription>Registro de todas las ventas realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border shadow-sm rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Venta</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Imágenes</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No hay ventas registradas
                          </TableCell>
                        </TableRow>
                      ) : (
                        sales.map((sale) => {
                          // Encontrar los productos correspondientes a esta venta
                          const saleProducts = sale.items.map((item) => {
                            const product = products.find((p) => p.id === item.productId)
                            return {
                              ...item,
                              product,
                            }
                          })

                          return (
                            <TableRow key={sale.id}>
                              <TableCell className="font-medium">#{sale.id}</TableCell>
                              <TableCell>{new Date(sale.date).toLocaleDateString("es-ES")}</TableCell>
                              <TableCell>{sale.customer}</TableCell>
                              <TableCell>
                                {saleProducts.map((item, idx) => (
                                  <span key={idx}>
                                    {item.product?.name} {item.product?.presentation} ({item.quantity})
                                    {idx < saleProducts.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  {saleProducts.map(
                                    (item, idx) =>
                                      item.product && (
                                        <Image
                                          key={idx}
                                          src={item.product.image || "/placeholder.svg"}
                                          alt={`${item.product.name} ${item.product.presentation}`}
                                          width={30}
                                          height={30}
                                          className="rounded-md"
                                        />
                                      ),
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>${sale.total.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-mentolarte-green hover:text-green-700 hover:bg-green-50"
                                >
                                  Ver Detalles
                                </Button>
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
      <InvoiceModal open={showInvoice} onOpenChange={setShowInvoice} sale={currentSale} products={products} />

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar compra?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todos los productos del carrito. ¿Está seguro de que desea cancelar la compra?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelSale} className="bg-mentolarte-red hover:bg-mentolarte-red/90">
              Sí, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

"use client"

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
import { MentolarteLogo } from "@/components/mentolarte-logo"
import type { Sale, Product } from "@/lib/types"

interface InvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: Sale | null
  products: Product[]
}

export function InvoiceModal({ open, onOpenChange, sale, products }: InvoiceModalProps) {
  const [printing, setPrinting] = useState(false)

  if (!sale) return null

  const handlePrint = () => {
    setPrinting(true)
    window.print()
    setTimeout(() => setPrinting(false), 1000)
  }

  const handleDownload = () => {
    // En una implementación real, aquí se generaría un PDF
    const invoiceContent = document.getElementById("invoice-content")
    if (invoiceContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Factura ${sale.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .invoice-details { margin-bottom: 20px; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .items-table th { background-color: #f2f2f2; }
                .total { text-align: right; font-weight: bold; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${invoiceContent.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Factura #{sale.invoiceNumber}</DialogTitle>
          <DialogDescription>Factura generada para la venta realizada</DialogDescription>
        </DialogHeader>

        <div id="invoice-content" className="space-y-6 p-6 bg-white text-black">
          {/* Header */}
          <div className="text-center border-b pb-6">
            <div className="flex justify-center mb-4">
              <MentolarteLogo showText={false} className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold text-mentolarte-green">MENTOLARTE</h1>
            <p className="text-sm text-gray-600">Alivio hecho con amor</p>
            <p className="text-sm text-gray-600">WhatsApp: 320 805 0684 | Instagram: @MentolArte.co</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Datos de la Factura:</h3>
              <p>
                <strong>Número:</strong> {sale.invoiceNumber}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(sale.date).toLocaleDateString("es-ES")}
              </p>
              <p>
                <strong>Hora:</strong> {new Date(sale.date).toLocaleTimeString("es-ES")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cliente:</h3>
              <p>
                <strong>Nombre:</strong> {sale.customer}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="font-semibold mb-4">Productos:</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Producto</th>
                  <th className="border border-gray-300 p-2 text-center">Cantidad</th>
                  <th className="border border-gray-300 p-2 text-right">Precio Unit.</th>
                  <th className="border border-gray-300 p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, index) => {
                  const product = products.find((p) => p.id === item.productId)
                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {product ? `${product.name} ${product.presentation}` : "Producto"}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 p-2 text-right">${item.price.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2 text-right">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${sale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>IVA (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between py-2 border-t font-bold text-lg">
                  <span>Total:</span>
                  <span>${sale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>¡Gracias por su compra!</p>
            <p>Mentolarte - Pomadas mentoladas de calidad</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={printing}>
            {printing ? "Imprimiendo..." : "Imprimir"}
          </Button>
          <Button className="bg-mentolarte-green hover:bg-mentolarte-green/90" onClick={handleDownload}>
            Descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

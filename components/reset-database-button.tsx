"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ResetDatabaseButtonProps {
  onReset: () => void
}

export function ResetDatabaseButton({ onReset }: ResetDatabaseButtonProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    try {
      setLoading(true)

      // Productos iniciales
      const initialProducts = [
        {
          id: "1",
          name: "Pomada Mentolada",
          presentation: "30g",
          price: 25.0,
          cost: 12.5,
          stock: 50,
          minStock: 20,
          image: "/images/pomada-30g.png",
        },
        {
          id: "2",
          name: "Pomada Mentolada",
          presentation: "60g",
          price: 40.0,
          cost: 20.0,
          stock: 35,
          minStock: 15,
          image: "/images/pomada-60g.png",
        },
        {
          id: "3",
          name: "Pomada Mentolada",
          presentation: "90g",
          price: 55.0,
          cost: 27.5,
          stock: 25,
          minStock: 10,
          image: "/images/pomada-90g.png",
        },
      ]

      // Ventas iniciales
      const initialSales = [
        {
          id: "1001",
          date: new Date("2025-01-15"),
          customer: "Juan Martínez",
          items: [
            { productId: "1", quantity: 3, price: 25.0, subtotal: 75.0 },
            { productId: "2", quantity: 1, price: 40.0, subtotal: 40.0 },
          ],
          total: 115.0,
          invoiceNumber: "FAC-1001-0001",
        },
        {
          id: "1002",
          date: new Date("2025-01-14"),
          customer: "Laura Rodríguez",
          items: [{ productId: "3", quantity: 2, price: 55.0, subtotal: 110.0 }],
          total: 110.0,
          invoiceNumber: "FAC-1002-0002",
        },
      ]

      // Resetear localStorage
      localStorage.setItem("products", JSON.stringify(initialProducts))
      localStorage.setItem("sales", JSON.stringify(initialSales))
      localStorage.setItem("inventory_movements", JSON.stringify([]))
      localStorage.setItem("customers", JSON.stringify([]))

      toast({
        title: "Base de datos reseteada",
        description: "Los datos han sido restaurados a su estado inicial",
      })

      // Llamar la función de callback para refrescar los datos
      onReset()
    } catch (error) {
      console.error("Error al resetear la base de datos:", error)
      toast({
        title: "Error",
        description: "No se pudo resetear la base de datos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-mentolarte-red border-mentolarte-red">
          <RotateCcw className="mr-2 h-4 w-4" />
          Resetear DB
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Resetear Base de Datos?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará todos los datos actuales y restaurará los productos y ventas iniciales. Esta acción no
            se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={loading}
            className="bg-mentolarte-red hover:bg-mentolarte-red/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reseteando...
              </>
            ) : (
              "Sí, resetear"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

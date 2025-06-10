import type { Product, Sale } from "./types"

export function initializeDatabase() {
  if (typeof window === "undefined") return

  // Productos iniciales
  const initialProducts: Product[] = [
    {
      id: "1",
      name: "Pomada Mentolada",
      presentation: "30g",
      price: 25.0,
      cost: 12.5,
      stock: 50,
      minStock: 20,
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "2",
      name: "Pomada Mentolada",
      presentation: "60g",
      price: 40.0,
      cost: 20.0,
      stock: 35,
      minStock: 15,
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "3",
      name: "Pomada Mentolada",
      presentation: "90g",
      price: 55.0,
      cost: 27.5,
      stock: 25,
      minStock: 10,
      image: "/placeholder.svg?height=120&width=120",
    },
  ]

  // Ventas iniciales
  const initialSales: Sale[] = [
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

  // Verificar e inicializar productos
  const existingProducts = localStorage.getItem("products")
  if (!existingProducts) {
    localStorage.setItem("products", JSON.stringify(initialProducts))
    console.log("✅ Productos iniciales cargados")
  }

  // Verificar e inicializar ventas
  const existingSales = localStorage.getItem("sales")
  if (!existingSales) {
    localStorage.setItem("sales", JSON.stringify(initialSales))
    console.log("✅ Ventas iniciales cargadas")
  }

  // Inicializar otros datos
  if (!localStorage.getItem("inventory_movements")) {
    localStorage.setItem("inventory_movements", JSON.stringify([]))
  }

  if (!localStorage.getItem("customers")) {
    localStorage.setItem("customers", JSON.stringify([]))
  }
}

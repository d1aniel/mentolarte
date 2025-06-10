// Tipos para la aplicación Mentolarte

export interface Product {
  id: string
  name: string
  presentation: string // 30g, 60g, 90g
  price: number
  cost: number
  stock: number
  minStock: number
  image: string
}

export interface Sale {
  id: string
  date: Date
  customer: string
  items: SaleItem[]
  total: number
  invoiceNumber: string // Nuevo campo para número de factura
}

export interface SaleItem {
  productId: string
  quantity: number
  price: number
  subtotal: number
}

export interface InventoryMovement {
  id: string
  date: Date
  productId: string
  quantity: number
  type: "entrada" | "salida"
  cost?: number // Solo para entradas
  reason?: string // Razón del movimiento
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
}

// Estado de la aplicación
export interface CartItem {
  product: Product
  quantity: number
  subtotal: number
}

// Nuevo tipo para facturas
export interface Invoice {
  id: string
  invoiceNumber: string
  date: Date
  customer: string
  items: SaleItem[]
  subtotal: number
  tax: number
  total: number
  saleId: string
}

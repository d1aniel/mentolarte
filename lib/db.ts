import type { Product, Sale, InventoryMovement, Customer } from "./types"

// Esta es una implementación temporal usando localStorage
// En producción, esto se reemplazaría con una conexión real a la base de datos

// Función para simular un retraso de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Productos iniciales
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Pomada Mentolada",
    presentation: "30g",
    price: 25.0,
    cost: 12.5,
    stock: 50, // Aumentado el stock inicial
    minStock: 20,
    image: "/images/pomada-30g.png",
  },
  {
    id: "2",
    name: "Pomada Mentolada",
    presentation: "60g",
    price: 40.0,
    cost: 20.0,
    stock: 35, // Aumentado el stock inicial
    minStock: 15,
    image: "/images/pomada-60g.png",
  },
  {
    id: "3",
    name: "Pomada Mentolada",
    presentation: "90g",
    price: 55.0,
    cost: 27.5,
    stock: 25, // Mantenido el stock
    minStock: 10,
    image: "/images/pomada-90g.png",
  },
]

// Clase para manejar la persistencia de datos
export class Database {
  private static instance: Database

  private constructor() {
    // Inicializar datos si no existen
    if (typeof window !== "undefined") {
      // Forzar la inicialización de productos si no existen o están vacíos
      const existingProducts = localStorage.getItem("products")
      if (!existingProducts || JSON.parse(existingProducts).length === 0) {
        localStorage.setItem("products", JSON.stringify(initialProducts))
      }

    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  // Métodos para productos
  async getProducts(): Promise<Product[]> {
    await delay(300) // Simular latencia de red
    if (typeof window !== "undefined") {
      const products = localStorage.getItem("products")
      return products ? JSON.parse(products) : []
    }
    return []
  }

  async getProduct(id: string): Promise<Product | null> {
    await delay(200)
    if (typeof window !== "undefined") {
      const products = await this.getProducts()
      return products.find((p) => p.id === id) || null
    }
    return null
  }

  async addProduct(product: Omit<Product, "id">): Promise<Product> {
    await delay(300)
    if (typeof window !== "undefined") {
      const products = await this.getProducts()
      const newProduct = {
        ...product,
        id: Date.now().toString(),
      }
      localStorage.setItem("products", JSON.stringify([...products, newProduct]))
      return newProduct
    }
    throw new Error("No se pudo agregar el producto")
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    await delay(300)
    if (typeof window !== "undefined") {
      const products = await this.getProducts()
      const index = products.findIndex((p) => p.id === id)
      if (index !== -1) {
        const updatedProduct = { ...products[index], ...product }
        products[index] = updatedProduct
        localStorage.setItem("products", JSON.stringify(products))
        return updatedProduct
      }
      throw new Error("Producto no encontrado")
    }
    throw new Error("No se pudo actualizar el producto")
  }

  async deleteProduct(id: string): Promise<void> {
    await delay(300)
    if (typeof window !== "undefined") {
      const products = await this.getProducts()
      const filteredProducts = products.filter((p) => p.id !== id)
      localStorage.setItem("products", JSON.stringify(filteredProducts))
    }
  }

  // Métodos para ventas
  async getSales(): Promise<Sale[]> {
    await delay(300)
    if (typeof window !== "undefined") {
      const sales = localStorage.getItem("sales")
      return sales ? JSON.parse(sales) : []
    }
    return []
  }

  async addSale(sale: Omit<Sale, "id">): Promise<Sale> {
    await delay(300)
    if (typeof window !== "undefined") {
      const sales = await this.getSales()

      // Generar número de factura único
      const invoiceNumber = `FAC-${Date.now()}-${(sales.length + 1).toString().padStart(4, "0")}`

      const newSale = {
        ...sale,
        id: (1000 + sales.length + 1).toString(),
        invoiceNumber, // Agregar número de factura
      }

      // Actualizar stock de productos
      for (const item of sale.items) {
        const product = await this.getProduct(item.productId)
        if (product) {
          await this.updateProduct(item.productId, {
            stock: product.stock - item.quantity,
          })

          // Registrar movimiento de inventario
          await this.addInventoryMovement({
            date: new Date(),
            productId: item.productId,
            quantity: item.quantity,
            type: "salida",
          })
        }
      }

      localStorage.setItem("sales", JSON.stringify([...sales, newSale]))
      return newSale
    }
    throw new Error("No se pudo agregar la venta")
  }

  // Métodos para movimientos de inventario
  async getInventoryMovements(): Promise<InventoryMovement[]> {
    await delay(300)
    if (typeof window !== "undefined") {
      const movements = localStorage.getItem("inventory_movements")
      return movements ? JSON.parse(movements) : []
    }
    return []
  }

  async addInventoryMovement(movement: Omit<InventoryMovement, "id">): Promise<InventoryMovement> {
    await delay(300)
    if (typeof window !== "undefined") {
      const movements = await this.getInventoryMovements()
      const newMovement = {
        ...movement,
        id: Date.now().toString(),
      }
      localStorage.setItem("inventory_movements", JSON.stringify([...movements, newMovement]))
      return newMovement
    }
    throw new Error("No se pudo agregar el movimiento de inventario")
  }

  // Métodos para clientes
  async getCustomers(): Promise<Customer[]> {
    await delay(300)
    if (typeof window !== "undefined") {
      const customers = localStorage.getItem("customers")
      return customers ? JSON.parse(customers) : []
    }
    return []
  }

  async addCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
    await delay(300)
    if (typeof window !== "undefined") {
      const customers = await this.getCustomers()
      const newCustomer = {
        ...customer,
        id: Date.now().toString(),
      }
      localStorage.setItem("customers", JSON.stringify([...customers, newCustomer]))
      return newCustomer
    }
    throw new Error("No se pudo agregar el cliente")
  }
}

// Exportar una instancia de la base de datos
export const db = Database.getInstance()

"use server"

import { db } from "@/lib/db"
import type { Product, Sale, InventoryMovement } from "@/lib/types"
import { revalidatePath } from "next/cache"

// Acciones para productos
export async function getProducts() {
  try {
    return await db.getProducts()
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return []
  }
}

export async function addProduct(product: Omit<Product, "id">) {
  try {
    const newProduct = await db.addProduct(product)
    revalidatePath("/inventario")
    return { success: true, product: newProduct }
  } catch (error) {
    console.error("Error al agregar producto:", error)
    return { success: false, error: "No se pudo agregar el producto" }
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const updatedProduct = await db.updateProduct(id, product)
    revalidatePath("/inventario")
    return { success: true, product: updatedProduct }
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    return { success: false, error: "No se pudo actualizar el producto" }
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.deleteProduct(id)
    revalidatePath("/inventario")
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return { success: false, error: "No se pudo eliminar el producto" }
  }
}

// Acciones para ventas
export async function getSales() {
  try {
    return await db.getSales()
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    return []
  }
}

export async function addSale(sale: Omit<Sale, "id">) {
  try {
    const newSale = await db.addSale(sale)
    revalidatePath("/ventas")
    revalidatePath("/inventario")
    revalidatePath("/")
    return { success: true, sale: newSale }
  } catch (error) {
    console.error("Error al agregar venta:", error)
    return { success: false, error: "No se pudo completar la venta" }
  }
}

// Acciones para inventario
export async function addInventoryMovement(movement: Omit<InventoryMovement, "id">) {
  try {
    // Si es una entrada, actualizar el stock
    if (movement.type === "entrada") {
      const product = await db.getProduct(movement.productId)
      if (product) {
        await db.updateProduct(movement.productId, {
          stock: product.stock + movement.quantity,
        })
      }
    }

    const newMovement = await db.addInventoryMovement(movement)
    revalidatePath("/inventario")
    return { success: true, movement: newMovement }
  } catch (error) {
    console.error("Error al registrar movimiento de inventario:", error)
    return { success: false, error: "No se pudo registrar el movimiento" }
  }
}

// Acciones para movimientos de inventario
export async function getInventoryMovements() {
  try {
    return await db.getInventoryMovements()
  } catch (error) {
    console.error("Error al obtener movimientos de inventario:", error)
    return []
  }
}

// Acción para reabastecer producto
export async function restockProduct(productId: string, quantity: number, cost: number) {
  try {
    // Obtener el producto
    const product = await db.getProduct(productId)
    if (!product) {
      return { success: false, error: "Producto no encontrado" }
    }

    // Actualizar el stock
    await db.updateProduct(productId, {
      stock: product.stock + quantity,
    })

    // Registrar el movimiento de inventario
    await db.addInventoryMovement({
      date: new Date(),
      productId,
      quantity,
      type: "entrada",
      cost,
    })

    revalidatePath("/inventario")
    return { success: true }
  } catch (error) {
    console.error("Error al reabastecer producto:", error)
    return { success: false, error: "No se pudo reabastecer el producto" }
  }
}

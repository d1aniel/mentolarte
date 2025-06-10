"use client"

import { useState, useEffect } from "react"
import type { Product, CartItem } from "@/lib/types"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  // Calcular el total cuando cambia el carrito
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
    setTotal(newTotal)
  }, [cart])

  // Agregar un producto al carrito
  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevCart.findIndex((item) => item.product.id === product.id)

      if (existingItemIndex >= 0) {
        // Actualizar la cantidad si ya existe
        const updatedCart = [...prevCart]
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: newQuantity,
          subtotal: product.price * newQuantity,
        }
        return updatedCart
      } else {
        // Agregar nuevo item si no existe
        return [
          ...prevCart,
          {
            product,
            quantity,
            subtotal: product.price * quantity,
          },
        ]
      }
    })
  }

  // Eliminar un producto del carrito
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  // Actualizar la cantidad de un producto
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            subtotal: item.product.price * quantity,
          }
        }
        return item
      })
    })
  }

  // Limpiar el carrito
  const clearCart = () => {
    setCart([])
  }

  return {
    cart,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}

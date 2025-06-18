'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CartItem, MenuItem } from '@/types/menu'
import { CartContext } from '@/context/cart-context'


interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kekoffee-cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        console.log('📦 Loading cart from localStorage:', parsedCart)
        setCartItems(parsedCart)
      }
    } catch (error) {
      console.error('❌ Error loading cart from localStorage:', error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('kekoffee-cart', JSON.stringify(cartItems))
        console.log('💾 Saved cart to localStorage:', cartItems)
      } catch (error) {
        console.error('❌ Error saving cart to localStorage:', error)
      }
    }
  }, [cartItems, isInitialized])

  const addToCart = useCallback((menu: MenuItem) => {
    if (typeof menu.id !== 'number') {
      console.error('❌ Menu ID tidak valid:', menu)
      return
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.menu.id === menu.id)
      if (existingItem) {
        return prev.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          id: Date.now(),
          menu,
          price: menu.price,
          quantity: 1,
          note: '',
        },
      ]
    })
  }, [])

  const updateQuantity = useCallback((menuId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.menu.id !== menuId))
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.menu.id === menuId ? { ...item, quantity } : item
        )
      )
    }
  }, [])

  const removeItem = useCallback((menuId: number) => {
    setCartItems((prev) => prev.filter((item) => item.menu.id !== menuId))
  }, [])

  const updateNote = useCallback((menuId: number, note: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.menu.id === menuId ? { ...item, note } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * item.quantity,
      0
    )
  }, [cartItems])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        updateNote,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

import { createContext, useContext } from 'react'
import { CartItem, MenuItem } from '@/types/menu'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (menu: MenuItem) => void
  updateQuantity: (menuId: number, quantity: number) => void
  removeItem: (menuId: number) => void
  updateNote: (menuId: number, note: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

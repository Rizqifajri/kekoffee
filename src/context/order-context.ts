import { createContext } from 'react'

export type OrderItem = {
  menu: string
  quantity: number
  note?: string
}

export type OrderData = {
  name: string
  table: string
  notes?: string
  orderType: 'dine-in' | 'takeaway'
  paymentMethod: 'cash' | 'ewallet'
  orderItems: OrderItem[]
}

export type OrderContextType = {
  orderItems: OrderItem[]
  setOrderItems: (items: OrderItem[]) => void
  submitOrder: (data: Omit<OrderData, 'orderItems'>) => Promise<string | null>
  clearOrder: () => void
}

export const OrderContext = createContext<OrderContextType | null>(null)

'use client'

import { OrderData, OrderContext, OrderItem } from '@/context/order-context'
import { useState, useCallback } from 'react'


export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  const submitOrder = useCallback(
    async (data: Omit<OrderData, 'orderItems'>): Promise<string | null> => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, orderItems }),
        })

        if (!res.ok) {
          console.error('Gagal submit order')
          return null
        }

        const result = await res.json()
        return result.id
      } catch (err) {
        console.error('Submit Order Error:', err)
        return null
      }
    },
    [orderItems]
  )

  const clearOrder = () => setOrderItems([])

  return (
    <OrderContext.Provider
      value={{ orderItems, setOrderItems, submitOrder, clearOrder }}
    >
      {children}
    </OrderContext.Provider>
  )
}

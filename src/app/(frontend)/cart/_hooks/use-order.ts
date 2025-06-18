import { OrderContext } from '@/context/order-context'
import { useContext } from 'react'


export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}

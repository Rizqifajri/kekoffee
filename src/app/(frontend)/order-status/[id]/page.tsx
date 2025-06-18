'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Clock, LoaderCircle, CheckCircle } from 'lucide-react'

interface Order {
  id: string
  name?: string
  status: string
  table?: string
  paymentstatus?: string
}

export default function OrderStatus() {
  const { id: orderId } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  const fetchOrder = async () => {
    console.log('orderId:', orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      const data = await res.json()
      console.log('Response:', data)

      if (!res.ok || !data?.id) throw new Error('Pesanan tidak ditemukan')

      setOrder(data)
    } catch (err) {
      console.error('❌ Error:', err)
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  if (orderId) fetchOrder()
}, [orderId])


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin h-10 w-10 text-amber-500" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-600">
        Pesanan tidak ditemukan.
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-amber-600 mb-4">Status Pesanan</h1>

        <div className="mb-6">
          <p className="text-gray-600">Nomor Pesanan Anda:</p>
          <p className="text-lg font-bold text-gray-900">{order.id}</p>
          {order.name && <p className="text-sm text-gray-500">Atas nama: {order.name}</p>}
          <p>Status Pembayaran : <span className="text-lg font-bold text-gray-900">{order.paymentstatus}</span></p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 mb-6">
          {order.status === 'pending' && (
            <>
              <LoaderCircle className="animate-spin text-amber-500 h-8 w-8" />
              <p className="text-lg text-gray-800 capitalize">Menunggu...</p>
            </>
          )}
          {order.status === 'completed' && (
            <>
              <CheckCircle className="text-green-500 h-8 w-8" />
              <p className="text-lg text-green-600 capitalize">Selesai</p>
            </>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            Estimasi waktu: 10–15 menit
          </div>
        </div>

        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Tunggu hingga pesanan Anda siap. Terima kasih!</p>
      </div>
    </div>
  )
}

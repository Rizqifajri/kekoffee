
import { getPayloadClient } from '@/lib/payload-client'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayloadClient()

    const order = await payload.findByID({
      collection: 'orders',
      id: params.id,
    })

    if (!order) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (err) {
    console.error('Error fetching order:', err)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}

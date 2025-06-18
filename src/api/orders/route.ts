import { getPayloadClient } from '@/lib/payload-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const orders = await payload.find({
      collection: 'orders',
    })

    return NextResponse.json(orders)
  } catch (err) {
    console.error('Error fetching orders:', err)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const payload = await getPayloadClient()

    const order = await payload.create({
      collection: 'orders',
      data: body,
    })

    return NextResponse.json({ doc: order }, { status: 200 })
  } catch (error) {
    console.error('Gagal buat order:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}


// src/api/orderItems/route.ts

import { getPayloadClient } from '@/lib/payload-client'
import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const body = await req.json()

    const created = await payload.create({
      collection: 'orderItems',
      data: body,
    })

    return NextResponse.json({ doc: created }, { status: 200 })
  } catch (error) {
    console.error('❌ Gagal buat order item:', error)
    return NextResponse.json({ message: 'Gagal membuat order item' }, { status: 500 })
  }
}

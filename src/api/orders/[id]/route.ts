import { getPayloadClient } from '@/lib/payload-client'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/orders/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const payload = await getPayloadClient()

  try {
    const order = await payload.findByID({
      collection: 'orders',
      id: params.id,
    })

    if (!order) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ message: 'Gagal mengambil pesanan' }, { status: 500 })
  }
}

// DELETE /api/orders/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const payload = await getPayloadClient()

  try {
    const deleted = await payload.delete({
      collection: 'orders',
      id: params.id,
    })

    return NextResponse.json({ message: 'Pesanan berhasil dihapus', deleted })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ message: 'Gagal menghapus pesanan' }, { status: 500 })
  }
}

// PATCH /api/orders/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const payload = await getPayloadClient()
  const body = await req.json()

  try {
    const updated = await payload.update({
      collection: 'orders',
      id: params.id,
      data: body,
    })

    return NextResponse.json({ message: 'Pesanan berhasil diperbarui', updated })
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ message: 'Gagal memperbarui pesanan' }, { status: 500 })
  }
}

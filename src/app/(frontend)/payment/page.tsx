'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CreditCard, MapPin, Clock, CheckCircle, ListOrdered } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useCart } from '../cart/_hooks/use-carts'
import Image from 'next/image'
import QR from '@/assets/qr-code.png'

const createOrderItem = async ({
  desc,
  menu,
  quantity,
  note,
}: {
  desc: string
  menu: string
  quantity: number
  note?: string | null
}) => {
  const res = await fetch('/api/orderItems', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ desc, menu, quantity, note }),
  })

  const data = await res.json()
  if (!res.ok || !data?.doc?.id) {
    throw new Error('Gagal menyimpan order item')
  }
  return data.doc.id
}

export default function PaymentPage() {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()

  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [orderType, setOrderType] = useState('dine-in')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [table, setTable] = useState('')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.menu.price) || 0
    return sum + price * item.quantity
  }, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSubmitOrder = async () => {
    if (!table.trim()) {
      alert('Mohon masukkan nomor meja.')
      return
    }

    setIsProcessing(true)
    try {
      const orderItemIDs: string[] = []

      for (const item of cartItems) {
        const id = await createOrderItem({
          desc: `${item.menu.name} x ${item.quantity}`,
          //@ts-ignore
          menu: item.menu.id,
          quantity: item.quantity,
          note: item.note || null,
        })
        orderItemIDs.push(id)
      }

      const orderPayload = {
        table: table.trim(),
        name: name.trim() || null,
        type: orderType,
        payment: paymentMethod,
        status: 'pending',
        totalPrice: total,
        notes: notes.trim() || null,
        items: orderItemIDs,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const orderData = await res.json()
      if (!res.ok) throw new Error(orderData.message || 'Gagal membuat pesanan')

      setOrderId(orderData.doc.id) // ✅ simpan ID asli dari backend
      clearCart()
      setOrderComplete(true)
    } catch (err) {
      console.error('Gagal membuat pesanan:', err)

      if (err instanceof Error) {
        alert(`Terjadi kesalahan: ${err.message}`)
      } else {
        alert('Terjadi kesalahan yang tidak diketahui.')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderComplete && orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h2>
            <p className="text-gray-600 mb-4">
              Terima kasih telah memesan di KeKoffee. Pesanan Anda sedang diproses.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Nomor Pesanan</p>
              <p className="text-lg font-bold text-amber-600">ORD-{orderId}</p>{' '}
              {/* ✅ tampilkan ORD- di UI */}
            </div>
            <div className="space-y-2">
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                <Link href="/">Kembali ke Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/menu">Pesan Lagi</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/order-status/${orderId}`}>
                  <ListOrdered className="w-4 h-4 mr-2" />
                  Lihat Status Pesanan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <CreditCard className="h-8 w-8 text-amber-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Tipe Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={orderType} onValueChange={setOrderType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dine-in" id="dine-in" />
                    <Label htmlFor="dine-in">Makan di Tempat</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="takeaway" id="takeaway" />
                    <Label htmlFor="takeaway">Take Away</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Pelanggan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="table">No Meja</Label>
                  <Input
                    id="table"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    placeholder="Masukkan Nomer Meja Anda"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan Nama"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan khusus"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Tunai</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ewallet" id="ewallet" />
                    <Label htmlFor="ewallet">QRIS / eWallet</Label>
                  </div>
                </RadioGroup>
                {paymentMethod === 'ewallet' && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-700">Scan QRIS:</p>
                    <div className="bg-white p-4 rounded-lg inline-block shadow">
                      <Image src={QR} alt="QRIS" width={180} height={180} className="mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Total: Rp {total.toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.menu.name}</p>
                      <span className="text-sm text-gray-600">
                        {item.quantity}x Rp {Number(item.menu.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <span className="font-medium">
                      Rp {(item.quantity * Number(item.menu.price)).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Pajak (10%)</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-amber-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center text-amber-800">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Estimasi 10-15 menit</span>
                  </div>
                </div>
                <Button
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="lg"
                >
                  {isProcessing ? 'Memproses...' : 'Konfirmasi Pesanan'}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/cart">Kembali ke Keranjang</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

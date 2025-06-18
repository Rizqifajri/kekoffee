"use client"

import { useState } from "react"
import Link from "next/link"
import { Coffee, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "./_hooks/use-carts"

export default function CartPage() {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    updateNote,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart()

  // Debug logs (bisa dihapus nanti)
  console.log("🛒 Cart Items:", cartItems)

  // Tidak perlu merge lagi karena data menu sudah ada di cartItem.menu
  const displayItems = cartItems

  const subtotal = displayItems.reduce((sum, item) => sum + item.menu.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <ShoppingCart className="h-8 w-8 text-amber-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
        </div>

        {displayItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Keranjang Kosong</h2>
              <p className="text-gray-600 mb-6">Belum ada item dalam keranjang Anda</p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/menu">Mulai Belanja</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {displayItems.map((item) => (
                <Card key={item.menu.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <Coffee className="h-8 w-8 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.menu.name}</h3>
                          <p className="text-amber-600 font-medium">Rp {item.menu.price.toLocaleString()}</p>
                          {item.note && (
                            <p className="text-sm text-gray-500 mt-1">Catatan: {item.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.menu.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.menu.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.menu.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pajak (10%)</span>
                    <span>Rp {tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-amber-600">Rp {total.toLocaleString()}</span>
                  </div>
                  <Button asChild className="w-full bg-amber-600 hover:bg-amber-700" size="lg">
                    <Link href="/payment">Lanjut ke Pembayaran</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/menu">Tambah Item Lain</Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full mt-2"
                    onClick={clearCart}
                  >
                    Kosongkan Keranjang
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Coffee, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { useMenu } from '@/hooks/use-menus'
import { Input } from '@/components/ui/input'
import { useCart } from '../cart/_hooks/use-carts'

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('all')
  const {
    cartItems,
    addToCart,
    getTotalItems,
  } = useCart()

  const {
    items,
    loading,
    error,
    searchQuery,
    selectedCategory,
    handleSearchChange,
    handleCategoryChange,
    clearFilters,
  } = useMenu()

  useEffect(() => {
    if (activeTab === 'all') {
      handleCategoryChange(null)
    } else {
      handleCategoryChange(activeTab)
    }
  }, [activeTab, handleCategoryChange])

  const getQuantityInCart = (menuId: number) => {
    const item = cartItems.find((item) => item.menu.id === menuId)
    return item ? item.quantity : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Menu KeKoffee</h1>
          <p className="text-lg text-gray-600">
            Pilih dari berbagai kopi premium dan makanan lezat kami
          </p>
        </div>

        {/* Search input */}
        <div className="mb-6 max-w-md mx-auto">
          <Input
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">Semua Menu</TabsTrigger>
            <TabsTrigger value="drink">Minuman</TabsTrigger>
            <TabsTrigger value="food">Makanan</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Memuat menu...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Tidak ada menu ditemukan.</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video flex items-center justify-center relative">
                      {item?.thumbnail?.url ? (
                        <Image
                          width={500}
                          height={500}
                          src={item?.thumbnail?.url}
                          alt={item.name}
                          className="object-cover rounded-xl w-full h-[300px] p-2"
                        />
                      ) : (
                        <Coffee className="h-16 w-16 text-amber-600" />
                      )}
                      {item.popular && (
                        <Badge className="absolute top-2 right-2 bg-red-500">Popular</Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4">{item?.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-amber-600">
                          Rp {item.price.toLocaleString()}
                        </span>
                        <Button
                          onClick={() => addToCart(item)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah
                        </Button>
                      </div>
                      {getQuantityInCart(item.id) > 0 && (
                        <div className="mt-2 text-center">
                          <Badge variant="secondary">
                            {getQuantityInCart(item.id)} item dalam keranjang
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 shadow-lg">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Lihat Keranjang ({getTotalItems()})
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

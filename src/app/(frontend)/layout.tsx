
import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Headers } from '@/components/headers'
import { CartProvider } from '@/providers/cart-provider'
import { OrderProvider } from '@/providers/order-provider'
// import './styles.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KeKoffee - Cafe & Coffee Shop',
  description: 'Nikmati kopi berkualitas tinggi dan makanan ringan lezat di KeKoffee',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <main>
          <CartProvider>
            <OrderProvider>
              <Headers />
              {children}
            </OrderProvider>
          </CartProvider>
        </main>
      </body>
    </html>
  )
}

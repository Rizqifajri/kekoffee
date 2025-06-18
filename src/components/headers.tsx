import {  Coffee } from "lucide-react";
import Link from "next/link";

export const Headers = () => {
  return (
    <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">KeKoffee</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/menu" className="text-gray-700 hover:text-amber-600 transition-colors">
                Menu
              </Link>
              <Link href="/cart" className="text-amber-600 font-medium">
                Cart
              </Link>
            </nav>
          </div>
        </div>
      </header>
  )
}
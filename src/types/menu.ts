export interface MenuItem {
  id: number
  name: string
  price: number
  category: string
  description: string
  popular: boolean
  thumbnail: {
    id: number
    url: string
    filename: string
    mimeType: string
    width: number
    height: number
  }
  is_available: boolean
  updatedAt: string
  createdAt: string
}

export interface OrderItem {
  id: number
  order_id: {
    id: number
    table: string
    status: string
    updatedAt: string
    createdAt: string
  }
  menu_id: MenuItem
  quantity: number
  note: string
  updatedAt: string
  createdAt: string
}

export interface Order {
  id: number
  table: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  updatedAt: string
  createdAt: string
}

export interface CartItem {
  id: number
  menu: MenuItem
  price: number
  quantity: number
  note?: string
}

export interface ApiResponse<T> {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  page: number
  pagingCounter: number
  prevPage: number | null
  totalDocs: number
  totalPages: number
}

export type PaymentMethod = 'in-app' | 'cashier'

import { ApiResponse, MenuItem } from '@/types/menu'
import { useState, useEffect, useCallback } from 'react'


export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const fetchMenu = useCallback(async (search?: string, category?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      // Untuk search - format yang lebih umum untuk CMS
      if (search && search.trim()) {
        const searchTerm = search.trim()

        // Coba beberapa format search yang umum:
        // Format 1: PayloadCMS style
        params.append('where[name][contains]', searchTerm)

        // Format 2: Alternatif jika format 1 tidak work
        // params.append('search', searchTerm)

        // Format 3: Multiple field search
        // params.append('where[or][0][name][contains]', searchTerm)
        // params.append('where[or][1][description][contains]', searchTerm)

        console.log('Search term:', searchTerm)
      }

      // Untuk category filtering
      if (category) {
        params.append('where[category][equals]', category)
        // Atau format lain sesuai CMS:
        // params.append('category', category)
        // params.append('filter[category]', category)
      }

      params.append('where[available][equals]', 'true')

      // Tambahan parameter yang berguna
      params.append('limit', '50') // Batasi hasil
      params.append('sort', 'name') // Urutkan hasil

      const queryString = params.toString()
      const url = queryString ? `/api/menus?${queryString}` : '/api/menus'

      console.log('Fetching URL:', url)
      console.log('Query params:', queryString)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.status} ${response.statusText}`)
      }

      const data: ApiResponse<MenuItem> = await response.json()
      console.log('API Response:', data)
      console.log('Items found:', data.docs?.length || 0)

      setItems(data.docs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearchChange = useCallback(
    (search: string) => {
      setSearchQuery(search)
      // Debounce bisa ditambahkan di sini untuk performa yang lebih baik
      fetchMenu(search, selectedCategory || undefined)
    },
    [selectedCategory, fetchMenu],
  )

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setSelectedCategory(category)
      fetchMenu(searchQuery || undefined, category || undefined)
    },
    [searchQuery, fetchMenu],
  )

  // Fungsi untuk clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory(null)
    fetchMenu()
  }, [fetchMenu])

  useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

  return {
    items,
    loading,
    error,
    searchQuery,
    selectedCategory,
    handleSearchChange,
    handleCategoryChange,
    clearFilters,
    refetch: () => fetchMenu(searchQuery || undefined, selectedCategory || undefined),
  }
}

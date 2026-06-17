export type Collection = {
  id: string
  name: string
  description: string
  productCount: number
  imageUrl: string
}

export type CollectionProduct = {
  id: string
  collection_id: string
  name: string
  description: string
  base_price: number
  thumbnail_url: string
  is_active: boolean
}

export type CollectionDetail = Collection & {
  products: CollectionProduct[]
}

export type CollectionPriceFilter = 'all' | 'under-3m' | 'from-3m'

export type CollectionSortOption = 'featured' | 'price-asc' | 'price-desc'

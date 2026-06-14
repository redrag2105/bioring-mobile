export type User = {
  id: string
  name: string
}

export type Product = {
  id: string
  name: string
  base_price: number
  thumbnail_url: string
}

export type CategoryType = {
  id: string
  name: string
  productCount: number,
  thumbnail_url: string
}

export type FeaturedCollection = {
  id: string
  eyebrow: string
  title: string
  image_url: string
}

export interface HomeDataResponse {
  featured: FeaturedCollection
  categories: CategoryType[]
  latestProducts: Product[]
}

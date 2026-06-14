import type { CategoryType, Product, User } from '@/types/home.types'

const featuredProducts: Product[] = [
  {
    id: 'prd-signature-01',
    name: 'Signature ring collection',
    base_price: 2450000,
    thumbnail_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prd-signature-02',
    name: 'Signature ring collection',
    base_price: 3150000,
    thumbnail_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prd-signature-03',
    name: 'Signature ring collection',
    base_price: 2890000,
    thumbnail_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
  },
]

const categoryTypes: CategoryType[] = [
  {
    id: 'cat-minimal',
    name: 'Minimal bands',
    productCount: 18,
    // Mẫu nhẫn trơn, tinh tế
    thumbnail_url: 'https://pngimg.com/uploads/ring/ring_PNG66.png',
  },
  {
    id: 'cat-statement',
    name: 'Statement rings',
    productCount: 12,
    // Mẫu nhẫn có thiết kế nổi bật
    thumbnail_url: 'https://pngimg.com/uploads/ring/ring_PNG10.png',
  },
  {
    id: 'cat-couple',
    name: 'Couple rings',
    productCount: 24,
    // Mẫu nhẫn cặp đôi
    thumbnail_url: 'https://pngimg.com/uploads/ring/ring_PNG24.png',
  },
  {
    id: 'cat-gemstone',
    name: 'Gemstone sets',
    productCount: 9,
    // Mẫu nhẫn đính đá quý
    thumbnail_url: 'https://pngimg.com/uploads/ring/ring_PNG54.png',
  },
];

export async function getHomeUser(): Promise<User> {
  return {
    id: 'usr-demo',
    name: 'Bioring',
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return featuredProducts
}

export async function getCategoryTypes(): Promise<CategoryType[]> {
  return categoryTypes
}

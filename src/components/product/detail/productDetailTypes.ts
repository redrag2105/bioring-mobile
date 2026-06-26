import type { Material } from '@/types/product.types'

export type ProductMaterial = Material & {
  displayName: string
  metalColor: string
}

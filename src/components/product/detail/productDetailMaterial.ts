import { THEME } from '@/constants/theme'
import type { Material } from '@/types/product.types'

import type { ProductMaterial } from './productDetailTypes'

export const MATERIAL_FALLBACKS: ProductMaterial[] = [
  {
    id: '18k-gold',
    name: 'Gold',
    purity: '18K',
    color: 'Gold',
    current_price_per_gram: 0,
    displayName: '18K Gold',
    metalColor: THEME.ringAccent
  },
  {
    id: 'platinum',
    name: 'Platinum',
    purity: '950',
    color: 'Platinum',
    current_price_per_gram: 0,
    displayName: 'Platinum',
    metalColor: THEME.borderLight
  },
  {
    id: 'rose-gold',
    name: 'Gold',
    purity: '18K',
    color: 'Rose Gold',
    current_price_per_gram: 0,
    displayName: 'Rose Gold',
    metalColor: '#C49583'
  }
]

export function toMaterialOption(material: Material): ProductMaterial {
  const label = `${material.purity} ${material.color || material.name}`.trim()
  const colorName = `${material.name} ${material.color}`.toLowerCase()

  const metalColor = colorName.includes('rose')
    ? '#C49583'
    : colorName.includes('gold')
      ? THEME.ringAccent
      : colorName.includes('platinum')
        ? THEME.borderLight
        : THEME.borderLight

  return { ...material, displayName: label, metalColor }
}

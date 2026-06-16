import type { Collection } from '@/types/collection.types'

const collections: Collection[] = [
  {
    id: 'minimal-bands',
    name: 'Minimal Bands',
    description: 'Clean silhouettes, polished surfaces, and quiet details designed for everyday wear.',
    productCount: 18,
    imageUrl: 'https://pngimg.com/uploads/ring/ring_PNG66.png'
  },
  {
    id: 'signature-memory',
    name: 'Signature Memory',
    description: 'Personalized rings made for fingerprints, heartbeat engravings, and intimate keepsakes.',
    productCount: 14,
    imageUrl: 'https://pngimg.com/uploads/ring/ring_PNG10.png'
  },
  {
    id: 'couple-sets',
    name: 'Couple Sets',
    description: 'Paired designs with balanced profiles, subtle contrast, and shared symbolic details.',
    productCount: 24,
    imageUrl: 'https://pngimg.com/uploads/ring/ring_PNG24.png'
  },
  {
    id: 'gemstone-edit',
    name: 'Gemstone Edit',
    description: 'Refined stone-led pieces with soft brilliance, warm metal tones, and sculptural settings.',
    productCount: 9,
    imageUrl: 'https://pngimg.com/uploads/ring/ring_PNG54.png'
  }
]

export async function getCollections(): Promise<Collection[]> {
  return collections
}

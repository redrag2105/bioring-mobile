import type { Collection, CollectionDetail, CollectionProduct } from '@/types/collection.types';

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

const collectionProducts: CollectionProduct[] = [
  // --- Minimal Bands ---
  {
    id: 'prd-minimal-01',
    collection_id: 'minimal-bands',
    name: 'Pure Line Band',
    description: 'A slim everyday ring with a clean polished profile.',
    base_price: 2450000,
    thumbnail_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-minimal-02',
    collection_id: 'minimal-bands',
    name: 'Soft Edge Ring',
    description: 'Rounded edges and a balanced silhouette for daily wear.',
    base_price: 2750000,
    thumbnail_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-minimal-03',
    collection_id: 'minimal-bands',
    name: 'Quiet Oval Band',
    description: 'A refined oval band with subtle reflective surfaces.',
    base_price: 3250000,
    thumbnail_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-minimal-04',
    collection_id: 'minimal-bands',
    name: 'Matte Flat Band',
    description: 'A modern flat band featuring a brushed matte finish for a contemporary look.',
    base_price: 2600000,
    thumbnail_url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-minimal-05',
    collection_id: 'minimal-bands',
    name: 'Tapered Edge Ring',
    description: 'A minimalist ring that gently tapers at the base for maximum comfort.',
    base_price: 2900000,
    thumbnail_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },

  // --- Signature Memory ---
  {
    id: 'prd-memory-01',
    collection_id: 'signature-memory',
    name: 'Fingerprint Keepsake',
    description: 'A personal ring designed for intimate biometric engraving.',
    base_price: 3890000,
    thumbnail_url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-memory-02',
    collection_id: 'signature-memory',
    name: 'Heartbeat Promise',
    description: 'A signature piece shaped for heartbeat line engraving.',
    base_price: 4150000,
    thumbnail_url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-memory-03',
    collection_id: 'signature-memory',
    name: 'Hidden Message Ring',
    description: 'A smooth band with space for a private inner engraving.',
    base_price: 2950000,
    thumbnail_url: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-memory-04',
    collection_id: 'signature-memory',
    name: 'Soundwave Band',
    description: 'Capture a voice note with a custom soundwave etched around the band.',
    base_price: 4350000,
    thumbnail_url: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-memory-05',
    collection_id: 'signature-memory',
    name: 'Coordinates Ring',
    description: 'Deeply engraved with the geographic coordinates of your most treasured location.',
    base_price: 3100000,
    thumbnail_url: 'https://images.unsplash.com/photo-1611591437107-16492982d1c6?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },

  // --- Couple Sets ---
  {
    id: 'prd-couple-01',
    collection_id: 'couple-sets',
    name: 'Parallel Pair',
    description: 'Two balanced bands with matching proportions.',
    base_price: 5200000,
    thumbnail_url: 'https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-couple-02',
    collection_id: 'couple-sets',
    name: 'Shared Orbit Set',
    description: 'A paired set with a gentle curved detail.',
    base_price: 6100000,
    thumbnail_url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-couple-03',
    collection_id: 'couple-sets',
    name: 'Promise Duo',
    description: 'Minimal couple rings with a soft satin finish.',
    base_price: 4700000,
    thumbnail_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-couple-04',
    collection_id: 'couple-sets',
    name: 'Interlocking Sets',
    description: 'Matching bands featuring subtle grooves that fit perfectly together.',
    base_price: 5800000,
    thumbnail_url: 'https://images.unsplash.com/photo-1584305514101-7080f5d0fba5?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-couple-05',
    collection_id: 'couple-sets',
    name: 'Contrast Texture Duo',
    description: 'A balanced pair showcasing complementary brushed and high-polish finishes.',
    base_price: 4950000,
    thumbnail_url: 'https://images.unsplash.com/photo-1605100806494-b2586f3bdf59?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },

  // --- Gemstone Edit ---
  {
    id: 'prd-gem-01',
    collection_id: 'gemstone-edit',
    name: 'Moonlit Sapphire',
    description: 'A sculptural setting with a cool sapphire accent.',
    base_price: 7200000,
    thumbnail_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-gem-02',
    collection_id: 'gemstone-edit',
    name: 'Pearl Light Ring',
    description: 'Soft brilliance with a warm metal base.',
    base_price: 6850000,
    thumbnail_url: 'https://images.unsplash.com/photo-1602752250015-52934bc45613?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-gem-03',
    collection_id: 'gemstone-edit',
    name: 'Rose Cut Glow',
    description: 'A low-profile gemstone ring with quiet sparkle.',
    base_price: 7950000,
    thumbnail_url: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-gem-04',
    collection_id: 'gemstone-edit',
    name: 'Emerald Cut Solitaire',
    description: 'A striking emerald-cut center stone secured in a minimalist bezel setting.',
    base_price: 8500000,
    thumbnail_url: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=900&q=80',
    is_active: true
  },
  {
    id: 'prd-gem-05',
    collection_id: 'gemstone-edit',
    name: 'Ruby Twilight Band',
    description: 'A sleek, sophisticated band featuring three flush-set ruby accents.',
    base_price: 7600000,
    thumbnail_url: 'https://images.unsplash.com/photo-1588444650733-d0767b0dc082?auto=format&fit=crop&w=900&q=80',
    is_active: true
  }
];

export async function getCollections(): Promise<Collection[]> {
  return collections
}

export async function getCollectionDetail(collectionId: string): Promise<CollectionDetail | null> {
  const collection = collections.find((item) => item.id === collectionId)

  if (!collection) return null

  return {
    ...collection,
    products: collectionProducts.filter((product) => product.collection_id === collection.id && product.is_active)
  }
}

// Maps to the `materials` table[cite: 3]
export interface Material {
  id: string;
  name: string;
  purity: string;
  color: string;
  current_price_per_gram: number;
}

// Maps to the `gemstones` table[cite: 3]
export interface Gemstone {
  id: string;
  type: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  price: number;
}

// Maps to the `products` table[cite: 3]
export interface Product {
  id: string;
  name: string;
  description: string;
  base_material_id: string;
  base_price: number;
  thumbnail_url: string;
  model_3d_url: string | null;
  is_active: boolean;
}

// Aggregated response for the Product Detail Screen
export interface ProductDetailResponse extends Product {
  // Available options for basic customization[cite: 2]
  available_materials: Material[];
  available_gemstones: Gemstone[];
  
  // Customization metadata specific to Bioring[cite: 2]
  supported_sizes: string[];
  engravable_areas: string[];
  
  // Indicates if the ring supports Package 1 (Soundwave) or Package 2 (Fingerprint, Heartbeat)[cite: 2]
  supported_biometrics: ('sound_wave' | 'fingerprint' | 'heartbeat')[];
}
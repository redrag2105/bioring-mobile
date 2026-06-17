import type { ProductDetailResponse } from '@/types/product.types';

// Mock data reflecting your DB schema and business logic
const MOCK_PRODUCT_DETAIL: ProductDetailResponse = {
  id: 'b5b8d9f4-1234-4b56-8a90-123456789abc', // UUID format[cite: 3]
  name: 'Pure Line Band',
  description: 'A slim everyday ring with a clean polished profile. Designed to capture your most intimate moments.',
  base_material_id: 'm1-uuid',
  base_price: 2450000,
  thumbnail_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
  model_3d_url: 'https://models.bioring.com/pure-line-band.glb', // For 3D Preview[cite: 2, 3]
  is_active: true,
  
  // Customization: Materials[cite: 2, 3]
  available_materials: [
    { id: 'm1-uuid', name: 'Titanium', purity: 'Aerospace Grade', color: 'Silver', current_price_per_gram: 150000 },
    { id: 'm2-uuid', name: 'Gold', purity: '18K', color: 'Rose Gold', current_price_per_gram: 1250000 },
  ],
  
  // Customization: Gemstones[cite: 2, 3]
  available_gemstones: [
    { id: 'g1-uuid', type: 'Diamond', carat: 0.5, cut: 'Round', color: 'D', clarity: 'VVS1', price: 15000000 },
    { id: 'g2-uuid', type: 'Sapphire', carat: 0.7, cut: 'Oval', color: 'Blue', clarity: 'VS1', price: 8000000 },
  ],
  
  supported_sizes: ['US 4', 'US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
  engravable_areas: ['inner_band', 'outer_band'],
  
  // Supports Package 2 (All biometrics)[cite: 2]
  supported_biometrics: ['sound_wave', 'fingerprint', 'heartbeat'],
};

export const ProductsAPI = {
  /**
   * Fetch detailed product information including materials and gemstones for customization
   */
  getProductDetail: async (id: string): Promise<ProductDetailResponse> => {
    // TODO: Replace with actual NestJS API call
    // const response = await apiClient.get(`/products/${id}/detail`);
    // return response.data;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id) {
          // Returning mock data. In reality, you'd filter by ID.
          resolve({ ...MOCK_PRODUCT_DETAIL, id }); 
        } else {
          reject(new Error('Product ID is required'));
        }
      }, 500);
    });
  }
};
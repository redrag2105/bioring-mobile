// src/hooks/queries/useProductsQuery.ts
import { ProductsAPI } from '@/core/apis/products.api';
import type { ProductDetailResponse } from '@/types/product.types';
import { useQuery } from '@tanstack/react-query';

export const productKeys = {
  all: ['products'] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Hook to fetch comprehensive product details for the Product Detail Screen and Design Flow
 * @param productId The UUID of the product from the `products` table[cite: 3]
 */
export function useProductDetailQuery(productId?: string) {
  return useQuery<ProductDetailResponse, Error>({
    queryKey: productKeys.detail(productId!),
    queryFn: () => ProductsAPI.getProductDetail(productId!),
    // Only execute if a valid productId is provided
    enabled: !!productId, 
    // Cache the data for 5 minutes
    staleTime: 1000 * 60 * 5, 
  });
}
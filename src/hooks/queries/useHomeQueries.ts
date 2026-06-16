import { useQuery } from '@tanstack/react-query'

import { getCategoryTypes, getFeaturedProducts, getHomeUser } from '@/core/apis/home.api'

export function useHomeUserQuery() {
  return useQuery({
    queryKey: ['home', 'user'],
    queryFn: getHomeUser,
  })
}

export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: ['home', 'featured-products'],
    queryFn: getFeaturedProducts,
  })
}

export function useCategoryTypesQuery() {
  return useQuery({
    queryKey: ['home', 'category-types'],
    queryFn: getCategoryTypes,
  })
}

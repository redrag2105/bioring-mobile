import { useQuery } from '@tanstack/react-query'

import { getMemoryCards } from '@/core/apis/memory.api'

export function useMemoryCardsQuery() {
  return useQuery({
    queryKey: ['memory-cards'],
    queryFn: getMemoryCards
  })
}

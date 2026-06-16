import { useQuery } from '@tanstack/react-query'

import { getCollections } from '@/core/apis/collections.api'

export function useCollectionsQuery() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: getCollections
  })
}

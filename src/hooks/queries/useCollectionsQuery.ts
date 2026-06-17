import { useQuery } from '@tanstack/react-query'

import { getCollectionDetail, getCollections } from '@/core/apis/collections.api'

export function useCollectionsQuery() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: getCollections
  })
}

export function useCollectionDetailQuery(collectionId?: string) {
  return useQuery({
    queryKey: ['collections', collectionId],
    queryFn: () => getCollectionDetail(collectionId ?? ''),
    enabled: Boolean(collectionId)
  })
}

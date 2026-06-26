import { getOrders } from '@/core/apis/orders.api'
import { useQuery } from '@tanstack/react-query'

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders
  })
}

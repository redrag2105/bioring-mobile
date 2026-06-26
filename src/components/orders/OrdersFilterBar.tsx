import { ORDER_FILTERS, type OrderFilterKey } from '@/constants/orders'
import type { OrderStatus } from '@/types/orders.types'
import { Pressable, ScrollView, Text } from 'react-native'

type OrdersFilterBarProps = {
  activeFilter: OrderFilterKey
  onChange: (filter: OrderFilterKey) => void
  counts: Record<OrderFilterKey, number>
}

export function OrdersFilterBar({ activeFilter, onChange, counts }: OrdersFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className='-mx-5'
      contentContainerClassName='gap-2 px-5'
    >
      {ORDER_FILTERS.map((filter) => {
        const active = activeFilter === filter.key

        return (
          <Pressable
            key={filter.key}
            accessibilityRole='button'
            onPress={() => onChange(filter.key)}
            className={`rounded-full border px-4 py-2.5 ${
              active ? 'border-ring-primary bg-ring-primary' : 'border-ui-border bg-ring-surface'
            }`}
          >
            <Text className={`text-center font-sans-bold text-xs ${active ? 'text-white' : 'text-txt-body'}`}>
              {filter.label} {counts[filter.key]}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

export function isOrderVisible(status: OrderStatus, filter: OrderFilterKey) {
  return filter === 'ALL' || status === filter
}

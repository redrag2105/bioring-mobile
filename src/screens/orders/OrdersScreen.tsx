import { OrderCard } from '@/components/orders/OrderCard'
import { OrdersFilterBar, isOrderVisible } from '@/components/orders/OrdersFilterBar'
import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { ORDER_FILTERS, type OrderFilterKey } from '@/constants/orders'
import { THEME } from '@/constants/theme'
import { useOrdersQuery } from '@/hooks/queries/useOrdersQuery'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { router } from 'expo-router'
import { Search, X } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function OrdersScreen() {
  const handleScroll = useDynamicBottomTab()
  const { data: orders = [], isLoading, refetch, isRefetching } = useOrdersQuery()
  const [activeFilter, setActiveFilter] = useState<OrderFilterKey>('DRAFT')
  const [isSearchVisible, setSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleOrders = useMemo(
    () =>
      normalizedSearchQuery
        ? orders.filter((item) => {
            const version = item.versions[item.versions.length - 1]
            const haystack = `${item.order.id} ${item.order.order_code} ${version.ring_style}`.toLowerCase()
            return haystack.includes(normalizedSearchQuery)
          })
        : orders.filter((item) => isOrderVisible(item.order.status, activeFilter)),
    [activeFilter, normalizedSearchQuery, orders]
  )
  const counts = useMemo(
    () =>
      ORDER_FILTERS.reduce(
        (result, filter) => ({
          ...result,
          [filter.key]:
            filter.key === 'ALL' ? orders.length : orders.filter((item) => item.order.status === filter.key).length
        }),
        {} as Record<OrderFilterKey, number>
      ),
    [orders]
  )

  return (
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <View className='relative'>
          <ScreenHeader eyebrow='Purchases' title='Manage' accent='Orders' />
          <Pressable
            accessibilityRole='button'
            accessibilityLabel={isSearchVisible ? 'Close order search' : 'Search orders'}
            onPress={() => {
              setSearchVisible((value) => !value)
              if (isSearchVisible) {
                setSearchQuery('')
              }
            }}
            className='absolute right-5 top-4 h-11 w-11 items-center justify-center rounded-full border border-ring-primary/10 bg-white/75 shadow-sm shadow-ring-primary/10 active:opacity-75'
          >
            {isSearchVisible ? (
              <X color={THEME.ringPrimary} size={19} strokeWidth={1.6} />
            ) : (
              <Search color={THEME.ringPrimary} size={19} strokeWidth={1.6} />
            )}
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          <View className='gap-5 px-5 pb-40 pt-1'>
            {isLoading ? (
              <View className='gap-4'>
                <View className='flex-row gap-3'>
                  <SkeletonBlock className='h-[104px] flex-1' />
                  <SkeletonBlock className='h-[104px] flex-1' />
                </View>
                {[1, 2, 3].map((item) => (
                  <SkeletonBlock key={item} className='h-[120px]' />
                ))}
              </View>
            ) : (
              <>
                {isSearchVisible ? (
                  <View className='flex-row items-center gap-2 rounded-full border border-ring-primary/15 bg-ring-surface px-4 py-2.5'>
                    <Search color={THEME.textMuted} size={16} strokeWidth={1.6} />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder='Search order ID or product name'
                      placeholderTextColor={THEME.textMuted}
                      autoCapitalize='none'
                      autoCorrect={false}
                      className='min-w-0 flex-1 font-sans text-sm text-txt-main'
                    />
                  </View>
                ) : null}

                <OrdersFilterBar activeFilter={activeFilter} onChange={setActiveFilter} counts={counts} />

                <View className='gap-3'>
                  <Text className='font-sans-bold text-xs uppercase tracking-wider text-txt-body'>
                    {normalizedSearchQuery ? 'Search results' : 'Recent orders'}
                  </Text>
                  {visibleOrders.map((orderSummary) => (
                    <OrderCard
                      key={orderSummary.order.id}
                      orderSummary={orderSummary}
                      onPress={() =>
                        router.push({
                          pathname: '/(screens)/orders/[orderId]',
                          params: { orderId: orderSummary.order.id }
                        })
                      }
                    />
                  ))}
                </View>

                {visibleOrders.length === 0 ? (
                  <View className='items-center rounded-[20px] border border-ring-primary/10 bg-ring-surface px-6 py-10'>
                    <Text className='font-serif-semibold text-2xl text-txt-main'>No orders here</Text>
                    <Text className='mt-2 text-center font-sans text-sm leading-6 text-txt-muted'>
                      Change the filter to see the rest of your BioRing timeline.
                    </Text>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

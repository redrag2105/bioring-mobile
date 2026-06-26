import { OrderDetailView } from '@/components/orders/OrderDetailView'
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { useOrdersQuery } from '@/hooks/queries/useOrdersQuery'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function OrderDetailRoute() {
  const router = useRouter()
  const params = useLocalSearchParams<{ orderId?: string }>()
  const handleScroll = useDynamicBottomTab()
  const { data: orders = [], isLoading } = useOrdersQuery()
  const orderSummary = orders.find((item) => item.order.id === params.orderId)

  const handleBack = () => {
    if (router.canGoBack()) router.back()
    else router.replace('/(dashboard)/orders')
  }

  return (
    <View className='flex-1 bg-ring-background'>
      <Stack.Screen
        options={{
          animation: 'slide_from_right',
          presentation: 'card'
        }}
      />
      <SafeAreaView className='flex-1' edges={['top']}>
        {isLoading ? (
          <View className='gap-5 px-5 pt-5'>
            <SkeletonBlock className='h-10 w-10 rounded-full' />
            <SkeletonBlock className='h-[250px]' />
            <SkeletonBlock className='h-[96px]' />
            <SkeletonBlock className='h-[220px]' />
          </View>
        ) : orderSummary ? (
          <OrderDetailView orderSummary={orderSummary} onBack={handleBack} onScroll={handleScroll} />
        ) : (
          <View className='flex-1 items-center justify-center px-6'>
            <Text className='text-center font-serif-semibold text-2xl text-txt-main'>Order not found</Text>
            <Text className='mt-2 text-center font-sans text-sm leading-6 text-txt-muted'>
              This order is no longer available in your timeline.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  )
}

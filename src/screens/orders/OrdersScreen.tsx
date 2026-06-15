import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { useResetTabOnBlur } from '@/hooks/useResetTabOnBlur'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ORDER_ROWS = ['In production', 'Awaiting payment', 'Delivered']

export function OrdersScreen() {
  const handleScroll = useDynamicBottomTab()
  const { resetKey, scrollRef } = useResetTabOnBlur()

  return (
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <ScreenHeader eyebrow='Don hang' title='Manage' accent='Orders' />

        <ScrollView
          ref={scrollRef}
          key={resetKey}
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className='gap-5 px-5 pb-40'>
            <View className='flex-row gap-4'>
              <SkeletonBlock className='h-[104px] flex-1' />
              <SkeletonBlock className='h-[104px] flex-1' />
            </View>

            <View className='gap-3'>
              <Text className='font-sans-bold text-xs uppercase tracking-wider text-txt-body'>Recent orders</Text>
              {ORDER_ROWS.map((label) => (
                <SkeletonBlock key={label} className='h-[108px] p-4'>
                  <Text className='font-sans-bold text-sm text-txt-main'>{label}</Text>
                  <View className='mt-4 h-3 w-36 rounded-full bg-btn-disabled' />
                  <View className='mt-3 h-3 w-48 rounded-full bg-btn-disabled' />
                </SkeletonBlock>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

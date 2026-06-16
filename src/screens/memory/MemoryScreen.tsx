import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const MEMORY_ROWS = ['Fingerprint card', 'Heartbeat card', 'Anniversary note']

export function MemoryScreen() {
  const handleScroll = useDynamicBottomTab()

  return (
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <ScreenHeader eyebrow='The ky niem' title='Memory' accent='Cards' />

        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className='gap-5 px-5 pb-40'>
            <SkeletonBlock className='h-[156px] p-5'>
              <Text className='font-sans-bold text-xs uppercase tracking-wider text-txt-muted'>Memory vault</Text>
              <Text className='mt-3 max-w-[240px] font-serif-semibold text-[24px] leading-8 text-txt-main'>
                Personal moments ready for your ring
              </Text>
            </SkeletonBlock>

            <View className='gap-3'>
              <Text className='font-sans-bold text-xs uppercase tracking-wider text-txt-body'>Saved cards</Text>
              {MEMORY_ROWS.map((label) => (
                <SkeletonBlock key={label} className='h-[92px] p-4'>
                  <Text className='font-sans-bold text-sm text-txt-main'>{label}</Text>
                  <View className='mt-4 h-3 w-40 rounded-full bg-btn-disabled' />
                </SkeletonBlock>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function StudioScreen() {
  const handleScroll = useDynamicBottomTab()

  return (
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <ScreenHeader eyebrow='Thiet ke' title='Create your' accent='BioRing' />

        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className='gap-5 px-5 pb-40'>
            <SkeletonBlock className='h-[220px] items-center justify-center'>
              <View className='h-28 w-28 rounded-full bg-btn-disabled' />
              <Text className='mt-5 font-serif-semibold text-xl text-txt-main'>Ring preview</Text>
            </SkeletonBlock>

            <View className='gap-3'>
              <Text className='font-sans-bold text-xs uppercase tracking-wider text-txt-body'>Customize</Text>
              <SkeletonBlock className='h-[72px]' />
              <SkeletonBlock className='h-[72px]' />
              <SkeletonBlock className='h-[72px]' />
            </View>

            <SkeletonBlock className='h-[96px]' />
            <SkeletonBlock className='h-[96px]' />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

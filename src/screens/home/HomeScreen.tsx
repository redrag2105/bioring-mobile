import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { HomeCategoryCarousel } from '@/components/home/HomeCategoryCarousel'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { useCategoryTypesQuery, useFeaturedProductsQuery } from '@/hooks/queries/useHomeQueries'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export function HomeScreen() {
  const handleScroll = useDynamicBottomTab()
  const insets = useSafeAreaInsets()
  const { data: featuredProducts = [] } = useFeaturedProductsQuery()
  const { data: categoryTypes = [] } = useCategoryTypesQuery()

  return (
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <ScreenHeader eyebrow='Kham pha' title='Your' accent='Sanctuary' />

        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentInset={{ bottom: insets.bottom + 100 }}
          scrollIndicatorInsets={{ bottom: insets.bottom + 100 }}
        >
          <View className='gap-5 px-5 pb-40'>
            <FeaturedCarousel products={featuredProducts} />

            <HomeCategoryCarousel categories={categoryTypes} />

            <View className='gap-3'>
              <Text className='font-sans-bold text-xs uppercase tracking-wider text-txt-body'>Latest designs</Text>
              <SkeletonBlock className='h-[92px]' />
              <SkeletonBlock className='h-[92px]' />
              <SkeletonBlock className='h-[92px]' />
              <SkeletonBlock className='h-[92px]' />
              <SkeletonBlock className='h-[92px]' />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

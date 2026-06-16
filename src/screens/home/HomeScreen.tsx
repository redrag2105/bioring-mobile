import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { HomeCategorySection } from '@/components/home/HomeCategoryCarousel'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { HowBioringWorks } from '@/components/home/HowBioringWorks'
import { HomeQuickAction } from '@/components/home/HomeQuickAction'
import { CustomerStorySection } from '@/components/home/CustomerStorySection'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { useResetTabOnBlur } from '@/hooks/useResetTabOnBlur'
import { useCategoryTypesQuery, useFeaturedProductsQuery } from '@/hooks/queries/useHomeQueries'
import { ScrollView, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export function HomeScreen() {
  const handleScroll = useDynamicBottomTab()
  const { resetKey, scrollRef } = useResetTabOnBlur()
  const insets = useSafeAreaInsets()
  const { data: featuredProducts = [] } = useFeaturedProductsQuery()
  const { data: categoryTypes = [] } = useCategoryTypesQuery()

  return (
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <ScreenHeader eyebrow='Kham pha' title='Your' accent='Sanctuary' />

        <ScrollView
          ref={scrollRef}
          key={resetKey}
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentInset={{ bottom: insets.bottom + 20 }}
          scrollIndicatorInsets={{ bottom: insets.bottom + 100 }}
        >
          <View className='gap-5 px-5 pb-10'>
            <FeaturedCarousel products={featuredProducts} />

            <HomeCategorySection categories={categoryTypes} />

            <HowBioringWorks />

            <HomeQuickAction />

            <CustomerStorySection />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

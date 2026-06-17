import { CustomerStorySection } from '@/components/home/CustomerStorySection'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { HomeCategorySection } from '@/components/home/HomeCategoryCarousel'
import { HomeQuickAction } from '@/components/home/HomeQuickAction'
import { HowBioringWorks } from '@/components/home/HowBioringWorks'
import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { useCategoryTypesQuery, useFeaturedProductsQuery } from '@/hooks/queries/useHomeQueries'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { ScrollView, View } from 'react-native'
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

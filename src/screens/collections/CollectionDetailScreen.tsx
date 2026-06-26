import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { CollectionFilterBar } from '@/components/collections/CollectionFilterBar'
import { CollectionProductCard } from '@/components/collections/CollectionProductCard'
import { BackButton } from '@/components/navigation/BackButton'
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { useCollectionDetailQuery } from '@/hooks/queries/useCollectionsQuery'
import type { CollectionSortOption } from '@/types/collection.types'
import { useLocalSearchParams, useRouter } from 'expo-router'

export function CollectionDetailScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const scrollRef = useAnimatedRef<Animated.ScrollView>()

  // Background ring animation
  const rotation = useSharedValue(0)
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 60000, easing: Easing.linear }), -1, false)
  }, [rotation])

  const params = useLocalSearchParams<{ collectionId?: string | string[] }>()
  const collectionId = Array.isArray(params.collectionId) ? params.collectionId[0] : params.collectionId
  const { data: collection, isLoading } = useCollectionDetailQuery(collectionId)

  const [isHotFiltered, setIsHotFiltered] = useState(false)
  const [sortOption, setSortOption] = useState<CollectionSortOption>('featured')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000])
  const [isPriceDrawerOpen, setIsPriceDrawerOpen] = useState(false)

  const visibleProducts = useMemo(() => {
    if (!collection) return []
    let filtered = [...collection.products]

    if (isHotFiltered) {
      filtered = filtered.filter((_, i) => i % 2 === 0)
    }

    filtered = filtered.filter((p) => p.base_price >= priceRange[0] && p.base_price <= priceRange[1])

    if (sortOption === 'price-asc') filtered.sort((a, b) => a.base_price - b.base_price)
    if (sortOption === 'price-desc') filtered.sort((a, b) => b.base_price - a.base_price)

    return filtered
  }, [collection, isHotFiltered, priceRange, sortOption])

  const handleBack = () => {
    if (router.canGoBack()) router.back()
    else router.replace('/collections' as never)
  }

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)

  const toggleSortMenu = useCallback(() => {
    setIsPriceDrawerOpen(false)
    setIsSortMenuOpen((prev) => !prev)
  }, [])

  const handleSortOptionChange = useCallback((option: CollectionSortOption) => {
    setSortOption(option)
    setIsSortMenuOpen(false)
  }, [])

  const closeAllMenus = useCallback(() => {
    setIsPriceDrawerOpen(false)
    setIsSortMenuOpen(false)
  }, [])

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isPriceDrawerOpen || isSortMenuOpen ? 1 : 0, { duration: 240 }),
    pointerEvents: isPriceDrawerOpen || isSortMenuOpen ? 'auto' : 'none'
  }))

  const leftColumn = visibleProducts.filter((_, i) => i % 2 === 0)
  const rightColumn = visibleProducts.filter((_, i) => i % 2 !== 0)

  if (isLoading) return <CollectionDetailLoading onBack={handleBack} />
  if (!collection) return <CollectionDetailEmpty onBack={handleBack} />

  return (
    <View className='flex-1 bg-[#F6F4EF]'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <Animated.View
          entering={FadeInDown.duration(800).easing(Easing.out(Easing.exp))}
          className='z-50 bg-[#F6F4EF] pb-1'
        >
          <View className='flex-row items-start px-5 pt-3'>
            <BackButton onPress={handleBack} className='mr-4 mt-1 border-ring-primary/5 bg-white shadow-black/5' />

            <View className='flex-1'>
              <Text className='mb-1 font-sans-bold text-[11px] uppercase tracking-[0.2em] text-txt-muted'>
                The Exhibition
              </Text>
              <Text className='font-serif-medium text-[32px] leading-10 tracking-tight text-ring-primary'>
                {collection.name}
              </Text>
            </View>
          </View>

          <CollectionFilterBar
            isHotFiltered={isHotFiltered}
            sortOption={sortOption}
            priceRange={priceRange}
            onToggleHot={() => setIsHotFiltered(!isHotFiltered)}
            onSortOptionChange={handleSortOptionChange}
            onPriceRangeChange={setPriceRange}
            isPriceDrawerOpen={isPriceDrawerOpen}
            togglePriceDrawer={() => {
              setIsSortMenuOpen(false)
              setIsPriceDrawerOpen((value) => !value)
            }}
            isSortMenuOpen={isSortMenuOpen}
            toggleSortMenu={toggleSortMenu}
          />
        </Animated.View>

        <Animated.ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScrollBeginDrag={closeAllMenus}
          contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        >
          <Animated.View entering={FadeInDown.duration(800).easing(Easing.out(Easing.exp))}>
            <View className='mb-6 mt-3 px-5'>
              <Text className='font-sans text-[15px] leading-[26px] text-txt-muted'>{collection.description}</Text>
            </View>

            <View className='relative mt-2 flex-1'>
              <Animated.View style={overlayStyle} className='absolute inset-0 z-10'>
                <Pressable className='flex-1' onPress={closeAllMenus} />
              </Animated.View>

              <View className='z-0 px-5'>
                {visibleProducts.length > 0 ? (
                  <View className='flex-row justify-between'>
                    {/* Left Column */}
                    <View className='w-[47%] flex-col gap-6'>
                      {leftColumn.map((product, index) => (
                        <CollectionProductCard key={product.id} product={product} index={index * 2} />
                      ))}
                    </View>

                    {/* Right Column (Staggered) */}
                    <View className='w-[47%] flex-col gap-6 pt-12'>
                      {rightColumn.map((product, index) => (
                        <CollectionProductCard key={product.id} product={product} index={index * 2 + 1} />
                      ))}
                    </View>
                  </View>
                ) : (
                  <Animated.View entering={FadeIn.duration(180)} className='items-center justify-center py-24'>
                    <Text
                      allowFontScaling={false}
                      className='mb-4 text-center font-serif text-[28px] leading-9 text-ring-primary'
                    >
                      Beyond the Horizon
                    </Text>
                    <Text
                      allowFontScaling={false}
                      className='font-sans-light px-4 text-center text-[14px] leading-6 text-txt-muted'
                    >
                      There are no pieces in this specific refinement.{'\n'}Discover similar masterpieces below.
                    </Text>
                  </Animated.View>
                )}
              </View>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  )
}

function CollectionDetailLoading({ onBack }: { onBack: () => void }) {
  return (
    <View className='flex-1 bg-[#F6F4EF]'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <View className='z-10 flex-1'>
          {/* Inline Loading Header */}
          <View className='flex-row items-start px-5 pb-4 pt-4'>
            <BackButton onPress={onBack} className='mr-4 mt-1 border-ring-primary/5 bg-white shadow-black/5' />

            <View className='flex-1 justify-center pt-2'>
              <SkeletonBlock className='mb-3 h-3 w-24 rounded-full' />
              <SkeletonBlock className='h-8 w-3/4 rounded-full' />
            </View>
          </View>

          <View className='px-5 pb-6'>
            <SkeletonBlock className='mb-2 h-4 w-full rounded-full' />
            <SkeletonBlock className='mb-2 h-4 w-11/12 rounded-full' />
            <SkeletonBlock className='h-4 w-2/3 rounded-full' />
          </View>

          <View className='px-5 pt-4'>
            <SkeletonBlock className='mb-10 h-12 w-full rounded-[20px] opacity-60' />

            <View className='flex-row justify-between'>
              <View className='w-[47%]'>
                <SkeletonBlock className='aspect-[4/5] w-full rounded-[32px] opacity-80' />
              </View>
              <View className='w-[47%] pt-12'>
                <SkeletonBlock className='aspect-[4/5] w-full rounded-[32px] opacity-80' />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

function CollectionDetailEmpty({ onBack }: { onBack: () => void }) {
  return (
    <View className='flex-1 bg-[#F6F4EF]'>
      <SafeAreaView className='z-10 flex-1' edges={['top']}>
        {/* Left Aligned Back Button for Empty State */}
        <View className='w-full px-5 pt-4'>
          <BackButton onPress={onBack} className='border-ring-primary/5 bg-white shadow-black/5' />
        </View>

        <View className='flex-1 justify-center gap-4 px-8'>
          <Text className='font-serif-medium text-[32px] leading-10 tracking-tight text-ring-primary'>
            Exhibition Not Found
          </Text>
          <Text className='font-sans text-[15px] leading-6 text-txt-muted'>
            This collection may have been moved or is not available yet.
          </Text>
          <Pressable onPress={onBack} className='mt-4 self-start rounded-full bg-ring-primary px-8 py-4'>
            <Text className='font-sans-bold text-[11px] uppercase tracking-[0.2em] text-white'>Return to Gallery</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  )
}

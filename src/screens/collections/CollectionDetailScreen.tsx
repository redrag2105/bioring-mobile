import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps
} from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Check } from 'lucide-react-native'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  FadeIn,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { CollectionFilterBar } from '@/components/collections/CollectionFilterBar'
import { CollectionProductCard } from '@/components/collections/CollectionProductCard'
import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { THEME } from '@/constants/theme'
import { useCollectionDetailQuery } from '@/hooks/queries/useCollectionsQuery'
import type { CollectionSortOption } from '@/types/collection.types'

const SORT_OPTIONS: { value: CollectionSortOption; label: string }[] = [
  { value: 'featured', label: 'Latest Release' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' }
]

export function CollectionDetailScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOffset = useScrollViewOffset(scrollRef)
  const sortSheetRef = useRef<BottomSheetModal>(null)

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

  const openSortSheet = useCallback(() => {
    setIsPriceDrawerOpen(false)
    sortSheetRef.current?.present()
  }, [])

  const handleSortOptionChange = useCallback((option: CollectionSortOption) => {
    setSortOption(option)
    sortSheetRef.current?.dismiss()
  }, [])

  const closeAllMenus = useCallback(() => {
    setIsPriceDrawerOpen(false)
  }, [])

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isPriceDrawerOpen ? 1 : 0, { duration: 240 }),
    pointerEvents: isPriceDrawerOpen ? 'auto' : 'none'
  }))

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(scrollOffset.value > 12 ? -6 : 0, { duration: 180 }) }]
  }))

  const renderSortBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.28} pressBehavior='close' />
    ),
    []
  )

  if (isLoading) return <CollectionDetailLoading onBack={handleBack} />
  if (!collection) return <CollectionDetailEmpty onBack={handleBack} />

  return (
    <View className='flex-1 bg-ring-background'>
      <View className='absolute left-6 z-50' style={{ top: insets.top + 10 }}>
        <Pressable
          onPress={handleBack}
          className='h-11 w-11 items-center justify-center rounded-full border border-ring-accent/10 bg-ring-surface/90 shadow-sm'
        >
          <ArrowLeft color={THEME.ringPrimary} size={22} strokeWidth={1.7} />
        </Pressable>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={closeAllMenus}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <Animated.View
          entering={FadeIn.duration(260)}
          style={[{ paddingTop: insets.top + 82 }, headerAnimatedStyle]}
          className='px-6 pb-10'
        >
          <View className='items-center'>
            <Text
              allowFontScaling={false}
              className='font-sans-light mb-4 text-[11px] uppercase tracking-[0.34em] text-ring-accent'
            >
              The Exhibition
            </Text>
            <Text
              allowFontScaling={false}
              className='text-center font-serif text-[42px] leading-[48px] text-ring-primary'
            >
              {collection.name}
            </Text>
            <Text
              allowFontScaling={false}
              className='mt-5 text-center font-sans text-[15px] leading-[26px] text-ring-primary/75'
            >
              {collection.description}
            </Text>
            <View className='mt-7 h-[1px] w-16 bg-ring-accent/30' />
          </View>
        </Animated.View>

        <View className='z-20 min-h-screen bg-ring-background'>
          <CollectionFilterBar
            isHotFiltered={isHotFiltered}
            sortOption={sortOption}
            priceRange={priceRange}
            onToggleHot={() => setIsHotFiltered(!isHotFiltered)}
            onSortOptionChange={handleSortOptionChange}
            onPriceRangeChange={setPriceRange}
            isPriceDrawerOpen={isPriceDrawerOpen}
            togglePriceDrawer={() => setIsPriceDrawerOpen((value) => !value)}
            toggleSortMenu={openSortSheet}
          />

          <View className='relative flex-1'>
            <Animated.View
              style={overlayStyle}
              className='absolute inset-0 z-10 bg-ring-background/40 backdrop-blur-sm'
            >
              <Pressable className='flex-1' onPress={closeAllMenus} />
            </Animated.View>

            <View className='z-0 px-6 pt-6'>
              {visibleProducts.length > 0 ? (
                <View className='flex-row flex-wrap justify-between'>
                  {visibleProducts.map((product, index) => (
                    <CollectionProductCard key={product.id} product={product} index={index} />
                  ))}
                </View>
              ) : (
                <Animated.View entering={FadeIn.duration(180)} className='items-center justify-center py-20'>
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
        </View>
      </Animated.ScrollView>

      <BottomSheetModal
        ref={sortSheetRef}
        backdropComponent={renderSortBackdrop}
        backgroundStyle={{ backgroundColor: THEME.ringSurface }}
        handleIndicatorStyle={{ backgroundColor: THEME.ringAccent, opacity: 0.55, width: 44 }}
        snapPoints={['34%']}
      >
        <BottomSheetView className='px-6 pb-8 pt-2'>
          <Text allowFontScaling={false} className='mb-5 font-serif-medium text-[26px] text-ring-primary'>
            Sort
          </Text>
          {SORT_OPTIONS.map((option) => {
            const isActive = sortOption === option.value
            return (
              <Pressable
                key={option.value}
                onPress={() => handleSortOptionChange(option.value)}
                className='min-h-14 flex-row items-center justify-between border-b border-ring-accent/10 py-4'
              >
                <Text
                  allowFontScaling={false}
                  className={`font-sans text-[15px] ${isActive ? 'font-sans-bold text-ring-accent' : 'text-ring-primary'}`}
                >
                  {option.label}
                </Text>
                {isActive && <Check size={18} color={THEME.ringAccent} />}
              </Pressable>
            )
          })}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}

function CollectionDetailLoading({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets()
  return (
    <View className='flex-1 bg-ring-background'>
      <View className='absolute left-6 z-50' style={{ top: insets.top + 10 }}>
        <Pressable
          onPress={onBack}
          className='h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-ring-surface/90 shadow-sm'
        >
          <ArrowLeft color={THEME.ringPrimary} size={22} strokeWidth={2} />
        </Pressable>
      </View>

      <View className='flex-1'>
        <View style={{ paddingTop: insets.top + 82 }} className='px-6 pb-10'>
          <SkeletonBlock className='mx-auto mb-4 h-3 w-32 rounded-full' />
          <SkeletonBlock className='mx-auto mb-4 h-12 w-4/5 rounded-full' />
          <SkeletonBlock className='mb-3 h-4 w-full rounded-full' />
          <SkeletonBlock className='mx-auto h-4 w-3/4 rounded-full' />
        </View>

        <View className='bg-ring-background px-6 pt-2'>
          <SkeletonBlock className='mb-8 h-14 w-full rounded-2xl' />

          <View className='flex-row justify-between'>
            <SkeletonBlock className='aspect-[4/5] w-[48%] rounded-[24px]' />
            <SkeletonBlock className='aspect-[4/5] w-[48%] rounded-[24px]' />
          </View>
        </View>
      </View>
    </View>
  )
}

function CollectionDetailEmpty({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets()
  return (
    <View className='flex-1 bg-ring-background'>
      <View className='absolute left-6 z-50' style={{ top: insets.top + 10 }}>
        <Pressable
          onPress={onBack}
          className='h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white shadow-sm'
        >
          <ArrowLeft color={THEME.ringPrimary} size={22} strokeWidth={2} />
        </Pressable>
      </View>
      <SafeAreaView className='flex-1' edges={['top']}>
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

import { useEffect, useMemo, useRef, useState } from 'react'
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, useWindowDimensions, View } from 'react-native'

import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import type { Product } from '@/types/home.types'

type FeaturedCarouselProps = {
  products: Product[]
}

const AUTO_SLIDE_INTERVAL = 5000
const HORIZONTAL_SCREEN_PADDING = 40

function formatPrice(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const carouselRef = useRef<ScrollView>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { width } = useWindowDimensions()
  const slideWidth = width - HORIZONTAL_SCREEN_PADDING
  const safeProducts = useMemo(() => products.filter((product) => product.thumbnail_url), [products])

  useEffect(() => {
    if (safeProducts.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % safeProducts.length
        carouselRef.current?.scrollTo({ x: nextIndex * slideWidth, animated: true })
        return nextIndex
      })
    }, AUTO_SLIDE_INTERVAL)

    return () => clearInterval(interval)
  }, [safeProducts.length, slideWidth])

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth)
    setActiveIndex(nextIndex)
  }

  if (safeProducts.length === 0) {
    return <SkeletonBlock className='h-[168px]' />
  }

  return (
    <View className='h-[168px] overflow-hidden rounded-[18px]'>
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={slideWidth}
        decelerationRate='fast'
        onMomentumScrollEnd={handleMomentumEnd}
        className='h-full w-full'
      >
        {safeProducts.map((product) => (
          <View key={product.id} className='h-full w-full shrink-0 overflow-hidden rounded-[18px] border border-ui-border bg-ring-surface'>
            <Image source={{ uri: product.thumbnail_url }} resizeMode='cover' className='absolute inset-0 h-full w-full' />
            <View className='absolute inset-0 bg-ring-secondary/30' />
            <View className='h-full justify-between p-5'>
              <View>
                <Text className='font-sans-bold text-xs uppercase tracking-wider text-ring-surface'>Featured</Text>
                <Text className='mt-3 max-w-[250px] font-serif-semibold text-[24px] leading-8 text-ring-surface'>
                  {product.name}
                </Text>
              </View>
              <Text className='font-sans-bold text-xs uppercase tracking-wider text-ring-surface/85'>
                From {formatPrice(product.base_price)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className='absolute bottom-4 right-5 flex-row gap-1.5'>
        {safeProducts.map((product, index) => (
          <View
            key={`${product.id}-dot`}
            className={`h-1.5 rounded-full ${activeIndex === index ? 'w-5 bg-ring-surface' : 'w-1.5 bg-ring-surface/45'}`}
          />
        ))}
      </View>
    </View>
  )
}

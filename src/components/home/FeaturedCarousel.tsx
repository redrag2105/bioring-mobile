import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import type { Product } from '@/types/home.types'

type FeaturedCarouselProps = {
  products: Product[]
}

const AUTO_SLIDE_INTERVAL = 5000

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
  
  // Dùng state để lưu chính xác 100% chiều rộng của Container thay vì trừ cứng 40px
  const [slideWidth, setSlideWidth] = useState(width)

  const safeProducts = useMemo(() => products.filter((product) => product.thumbnail_url), [products])

  useEffect(() => {
    if (safeProducts.length <= 1 || slideWidth === 0) return

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
    if (slideWidth > 0) {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth)
      setActiveIndex(nextIndex)
    }
  }

  if (safeProducts.length === 0) {
    return <SkeletonBlock className='aspect-[4/5] w-full rounded-[32px]' />
  }

  return (
    <View 
      // ĐIỀU CHỈNH CHIỀU CAO CỦA CAROUSEL TẠI ĐÂY 
      className='aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-ring-secondary shadow-xl shadow-black/10 elevation-5'
      
      // onLayout sẽ đo đạc kích thước thực tế của View này và ép từng ảnh bên trong phải to bằng đúng 100% View
      onLayout={(e) => setSlideWidth(e.nativeEvent.layout.width)}
    >
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
          <Pressable 
            key={product.id} 
            style={{ width: slideWidth }} // Ép chiều rộng bức ảnh bằng đúng 100% container
            className='relative h-full shrink-0'
          >
            {/* LỚP 1: Hình nền */}
            <Image
              source={{ uri: product.thumbnail_url }}
              resizeMode='cover'
              className='absolute inset-0 h-full w-full'
            />

            {/* LỚP 2: Gradient Kính lọc */}
            <View className='absolute inset-0'>
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient id={`hero-grad-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#000" stopOpacity={0.05} />
                    <Stop offset="45%" stopColor="#000" stopOpacity={0.15} />
                    <Stop offset="100%" stopColor="#000" stopOpacity={0.85} />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill={`url(#hero-grad-${product.id})`} />
              </Svg>
            </View>

            {/* LỚP 3: Typography */}
            <View className='absolute bottom-0 left-0 right-0 p-8 pt-20'>
              <Text className='mb-3 font-sans-medium text-[10px] uppercase tracking-[0.3em] text-white/80'>
                Featured Collection
              </Text>

              <Text
                className='mb-2 font-serif text-[34px] leading-[40px] text-white shadow-sm shadow-black/50'
                numberOfLines={2}
              >
                {product.name}
              </Text>

              <View className='mb-3 mt-2 h-[1px] w-12 bg-white/30' />

              <Text className='font-sans-light text-[15px] tracking-wider text-white/90'>
                From {formatPrice(product.base_price)}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* LỚP 4: Pagination Indicator */}
      <View className='absolute bottom-8 right-8 flex-row gap-2' pointerEvents="none">
        {safeProducts.map((product, index) => (
          <View
            key={`${product.id}-dot`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </View>
    </View>
  )
}
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowRight } from 'lucide-react-native'
import { cssInterop } from 'nativewind'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PixelRatio,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewToken
} from 'react-native'
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'

const EDITORIAL_BLACK = '#1A1A1A'
const RING_BACKGROUND = '#F8F7F5'
const HAIRLINE_WIDTH = 1 / PixelRatio.get()

cssInterop(Image, { className: 'style' })
cssInterop(LinearGradient, { className: 'style' })

interface OnboardingSlide {
  id: string
  image: ImageSourcePropType
  heading: string
  body: string
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'unique-signature',
    image: require('../../assets/images/onboarding/slide1.png'),
    heading: 'Unique Signature',
    body: 'Etch your most personal biometric signatures\u2014from fingerprints to heartbeats\u2014directly onto your ring.'
  },
  {
    id: 'exquisite-craftsmanship',
    image: require('../../assets/images/onboarding/slide2.png'),
    heading: 'Exquisite Craftsmanship',
    body: 'Celebrating the elegance of premium materials like rose gold and platinum, brought to life by master jewelers.'
  },
  {
    id: 'eternal-connection',
    image: require('../../assets/images/onboarding/slide3.png'),
    heading: 'Eternal Connection',
    body: 'A timeless keepsake designed to preserve your deepest love and most cherished memories.'
  }
]

interface OnboardingScreenProps {
  onSkip: () => void
  onStartNow: () => void | Promise<void>
  isLoading?: boolean
}

export function OnboardingScreen({ onSkip, onStartNow, isLoading = false }: OnboardingScreenProps) {
  const { width, height } = useWindowDimensions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null)
  const scrollX = useSharedValue(0)
  const isLastSlide = currentIndex === SLIDES.length - 1

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const nextIndex = viewableItems[0]?.index

    if (typeof nextIndex === 'number') {
      setCurrentIndex(nextIndex)
    }
  }, [])

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = event.nativeEvent.contentOffset.x
    },
    [scrollX]
  )

  const goToNext = useCallback(() => {
    if (!isLastSlide) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
    }
  }, [currentIndex, isLastSlide])

  // --- THÊM TÍNH NĂNG AUTO PLAY Ở ĐÂY ---
  useEffect(() => {
    // Dừng auto-play nếu đang ở slide cuối cùng
    if (isLastSlide) return

    // Thiết lập bộ đếm thời gian 5 giây
    const timer = setInterval(() => {
      flatListRef.current?.scrollToIndex({ 
        index: currentIndex + 1, 
        animated: true 
      })
    }, 5000)

    // Xóa bộ đếm nếu người dùng tự vuốt (currentIndex thay đổi) hoặc component unmount
    return () => clearInterval(timer)
  }, [currentIndex, isLastSlide])
  // ----------------------------------------

  const skipAnimatedStyle = useAnimatedStyle(() => {
    const lastSlideOffset = width * (SLIDES.length - 1)
    const fadeStartOffset = lastSlideOffset - width * 0.5
    const opacity = interpolate(scrollX.value, [0, fadeStartOffset, lastSlideOffset], [1, 1, 0], Extrapolate.CLAMP)

    return { opacity }
  })

  return (
    <View className='flex-1 bg-ring-background'>
      <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />

      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,0.52)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0)']}
        locations={[0, 0.55, 1]}
        className='absolute left-0 right-0 top-0 z-[18] h-[180px]'
      />

      <View className='absolute left-0 right-0 top-[48px] z-[24] items-center' pointerEvents='none'>
        <View
          className='rounded-full border border-black/10 bg-white/75 px-6 py-2.5'
          style={{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}
        >
          <Text className='font-serif text-base tracking-[5px] text-[#1A1A1A]'>BIORING</Text>
        </View>
      </View>

      <Animated.View
        className='absolute right-6 top-[45px] z-[30]'
        pointerEvents={isLastSlide ? 'none' : 'auto'}
        style={skipAnimatedStyle}
      >
        <TouchableOpacity className='px-1.5 py-1.5' onPress={onSkip} activeOpacity={0.68}>
          <Text
            className='font-sans-bold text-2xs tracking-[2px] text-[#ffffffeb]'
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.28)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 5
            }}
          >
            SKIP
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} width={width} height={height} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index
        })}
      />

      <View className='absolute bottom-8 left-0 right-0 items-center px-8'>
        <Indicator scrollX={scrollX} slideWidth={width} slideCount={SLIDES.length} />

        <NavigationAction
          isLastSlide={isLastSlide}
          isLoading={isLoading}
          onNext={goToNext}
          onStartNow={onStartNow}
          scrollX={scrollX}
          slideWidth={width}
          slideCount={SLIDES.length}
        />
      </View>
    </View>
  )
}

interface SlideItemProps {
  item: OnboardingSlide
  index: number
  scrollX: SharedValue<number>
  width: number
  height: number
}

function SlideItem({ item, index, scrollX, width, height }: SlideItemProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width]
  const imageHeight = Math.round(height * 0.6)
  const gradientHeight = Math.min(Math.round(height * 0.18), 150)

  const copyAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolate.CLAMP)
    const translateY = interpolate(scrollX.value, inputRange, [10, 0, 10], Extrapolate.CLAMP)

    return {
      opacity,
      transform: [{ translateY }]
    }
  })

  return (
    <View className='flex-1 bg-ring-background' style={{ width }}>
      <View className='overflow-hidden bg-ring-surface' style={{ height: imageHeight, width }}>
        <Image
          source={item.image}
          className='absolute inset-0'
          contentFit='cover'
          transition={450}
          cachePolicy='memory-disk'
        />
        <LinearGradient
          pointerEvents='none'
          colors={['rgba(248,247,245,0)', RING_BACKGROUND]}
          locations={[0, 1]}
          className='absolute bottom-0 left-0 right-0'
          style={{ height: gradientHeight }}
        />
      </View>

      <Animated.View className='h-[40%] items-center px-[34px] pt-[34px]' style={copyAnimatedStyle}>
        <Text className='max-w-[310px] text-center font-serif text-[26px] leading-[34px] tracking-[1px] text-[#1A1A1A]'>
          {item.heading}
        </Text>
        <Text className='mt-[18px] max-w-[300px] text-center font-sans text-sm leading-6 text-[#666666]'>
          {item.body}
        </Text>
      </Animated.View>
    </View>
  )
}

interface IndicatorProps {
  scrollX: SharedValue<number>
  slideWidth: number
  slideCount: number
}

function Indicator({ scrollX, slideWidth, slideCount }: IndicatorProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const segmentWidth = 82 / slideCount
    const translateX = interpolate(
      scrollX.value,
      [0, slideWidth * (slideCount - 1)],
      [0, 82 - segmentWidth],
      Extrapolate.CLAMP
    )

    return {
      width: segmentWidth,
      transform: [{ translateX }]
    }
  })

  return (
    <View className='h-px w-[82px] overflow-hidden bg-ring-accent/25'>
      <Animated.View className='h-px bg-ring-accent' style={animatedStyle} />
    </View>
  )
}

interface NavigationActionProps {
  isLastSlide: boolean
  isLoading: boolean
  onNext: () => void
  onStartNow: () => void | Promise<void>
  scrollX: SharedValue<number>
  slideWidth: number
  slideCount: number
}

function NavigationAction({
  isLastSlide,
  isLoading,
  onNext,
  onStartNow,
  scrollX,
  slideWidth,
  slideCount
}: NavigationActionProps) {
  
  const nextAnimatedStyle = useAnimatedStyle(() => {
    const lastSlideOffset = slideWidth * (slideCount - 1)
    const fadeStartOffset = lastSlideOffset - slideWidth * 0.5
    const opacity = interpolate(scrollX.value, [0, fadeStartOffset, lastSlideOffset], [1, 1, 0], Extrapolate.CLAMP)

    return { opacity }
  })

  const startNowAnimatedStyle = useAnimatedStyle(() => {
    const lastSlideOffset = slideWidth * (slideCount - 1)
    const fadeStartOffset = lastSlideOffset - slideWidth * 0.5
    const opacity = interpolate(scrollX.value, [fadeStartOffset, lastSlideOffset], [0, 1], Extrapolate.CLAMP)

    return { opacity }
  })

  return (
    <View className='relative mt-[22px] h-[52px] w-full items-center'>
      <Animated.View
        className='absolute top-0 w-full max-w-[326px]'
        pointerEvents={isLastSlide ? 'auto' : 'none'}
        style={startNowAnimatedStyle}
      >
        <TouchableOpacity
          className='h-[52px] w-full items-center justify-center rounded-full border-[rgba(26,26,26,0.2)] bg-ring-background'
          style={{
            borderWidth: HAIRLINE_WIDTH,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06, 
            shadowRadius: 10,
            elevation: 2 
          }}
          onPress={onStartNow}
          activeOpacity={0.82}
          disabled={!isLastSlide || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={EDITORIAL_BLACK} />
          ) : (
            <Text className='font-sans-bold text-xs tracking-[1.5px] text-[#1A1A1A]'>START NOW</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        className='absolute top-0'
        style={[{ marginTop: 2 }, nextAnimatedStyle]}
        pointerEvents={isLastSlide ? 'none' : 'auto'}
      >
        <TouchableOpacity className='flex-row items-center gap-[9px] px-3 py-2' onPress={onNext} activeOpacity={0.7}>
          <Text className='font-sans text-[11px] tracking-[2.4px] text-[#1A1A1A]'>NEXT</Text>
          <ArrowRight size={15} color={EDITORIAL_BLACK} strokeWidth={1} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export const OnboardingCarousel = OnboardingScreen
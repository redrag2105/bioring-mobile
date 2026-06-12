import { FONTS, THEME } from '@/constants/theme'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowRight } from 'lucide-react-native'
import React, { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
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
import Svg, { Path } from 'react-native-svg'

const EDITORIAL_BLACK = '#1A1A1A'
const BODY_GRAY = '#666666'
const GOOGLE_BORDER = 'rgba(26, 26, 26, 0.2)'

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
  onContinueWithGoogle: () => void | Promise<void>
  isGoogleLoading?: boolean
}

export function OnboardingScreen({ onSkip, onContinueWithGoogle, isGoogleLoading = false }: OnboardingScreenProps) {
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

  const renderSlide = useCallback(
    ({ item, index }: { item: OnboardingSlide; index: number }) => (
      <SlideItem item={item} index={index} scrollX={scrollX} width={width} height={height} />
    ),
    [height, scrollX, width]
  )

  return (
    <View style={styles.screen}>
      <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />

      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,0.52)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0)']}
        locations={[0, 0.55, 1]}
        style={styles.topImageGradient}
      />

      <View style={styles.brandHeader} pointerEvents='none'>
        <Text style={styles.brandText}>BIORING</Text>
      </View>

      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={onSkip} activeOpacity={0.68}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
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

      <View style={styles.footer}>
        <Indicator scrollX={scrollX} slideWidth={width} slideCount={SLIDES.length} />

        <NavigationAction
          isLastSlide={isLastSlide}
          isGoogleLoading={isGoogleLoading}
          onNext={goToNext}
          onContinueWithGoogle={onContinueWithGoogle}
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
    <View style={[styles.slide, { width }]}>
      <View style={[styles.imageRegion, { height: imageHeight, width }]}>
        <Image
          source={item.image}
          style={StyleSheet.absoluteFill}
          contentFit='cover'
          transition={450}
          cachePolicy='memory-disk'
        />
        <LinearGradient
          pointerEvents='none'
          colors={['rgba(248,247,245,0)', THEME.ringBackground]}
          locations={[0, 1]}
          style={[styles.imageGradient, { height: gradientHeight }]}
        />
      </View>

      <Animated.View style={[styles.copyRegion, copyAnimatedStyle]}>
        <Text style={styles.heading}>{item.heading}</Text>
        <Text style={styles.body}>{item.body}</Text>
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
    <View style={styles.indicatorTrack}>
      <Animated.View style={[styles.indicatorFill, animatedStyle]} />
    </View>
  )
}

interface NavigationActionProps {
  isLastSlide: boolean
  isGoogleLoading: boolean
  onNext: () => void
  onContinueWithGoogle: () => void | Promise<void>
}

function NavigationAction({
  isLastSlide,
  isGoogleLoading,
  onNext,
  onContinueWithGoogle
}: NavigationActionProps) {
  if (isLastSlide) {
    return (
      <TouchableOpacity
        style={styles.googleButton}
        onPress={onContinueWithGoogle}
        activeOpacity={0.82}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <ActivityIndicator color={EDITORIAL_BLACK} />
        ) : (
          <View style={styles.googleButtonContent}>
            <GoogleMonochromeIcon size={15} color={EDITORIAL_BLACK} />
            <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.7}>
      <Text style={styles.nextText}>NEXT</Text>
      <ArrowRight size={15} color={EDITORIAL_BLACK} strokeWidth={1} />
    </TouchableOpacity>
  )
}

function GoogleMonochromeIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M21.6 12.23c0-.72-.06-1.25-.18-1.79H12v3.48h5.53c-.11.87-.71 2.18-2.04 3.06l-.02.12 2.96 2.16.2.02c1.82-1.58 2.87-3.91 2.87-7.05Z'
        fill={color}
      />
      <Path
        d='M12 22c2.6 0 4.78-.8 6.37-2.19l-3.03-2.26c-.81.53-1.9.9-3.34.9-2.54 0-4.7-1.58-5.47-3.77l-.12.01-3.07 2.23-.04.1C4.88 19.98 8.17 22 12 22Z'
        fill={color}
      />
      <Path
        d='M6.53 14.68A5.84 5.84 0 0 1 6.2 12c0-.93.17-1.83.32-2.68l-.01-.18-3.1-2.26-.1.04A9.58 9.58 0 0 0 2 12c0 1.83.47 3.55 1.3 5.02l3.23-2.34Z'
        fill={color}
      />
      <Path
        d='M12 5.55c1.8 0 3.02.73 3.72 1.34l2.71-2.49C16.77 2.95 14.6 2 12 2 8.17 2 4.88 4.02 3.3 6.92l3.22 2.4C7.3 7.13 9.46 5.55 12 5.55Z'
        fill={color}
      />
    </Svg>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.ringBackground
  },
  brandHeader: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    zIndex: 24,
    alignItems: 'center'
  },
  brandText: {
    color: THEME.textInverse,
    fontFamily: FONTS.serif,
    fontSize: 16,
    letterSpacing: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.72)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 12
  },
  topImageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 18
  },
  skipButton: {
    position: 'absolute',
    top: 45,
    right: 24,
    zIndex: 30,
    paddingHorizontal: 6,
    paddingVertical: 6
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.28)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5
  },
  slide: {
    flex: 1,
    backgroundColor: THEME.ringBackground
  },
  imageRegion: {
    overflow: 'hidden',
    backgroundColor: THEME.ringSurface
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  copyRegion: {
    height: '40%',
    alignItems: 'center',
    paddingHorizontal: 34,
    paddingTop: 34
  },
  heading: {
    maxWidth: 310,
    color: EDITORIAL_BLACK,
    fontFamily: FONTS.serif,
    fontSize: 26,
    letterSpacing: 1,
    lineHeight: 34,
    textAlign: 'center'
  },
  body: {
    maxWidth: 300,
    marginTop: 18,
    color: BODY_GRAY,
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    alignItems: 'center',
    paddingHorizontal: 32
  },
  indicatorTrack: {
    width: 82,
    height: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(182, 155, 122, 0.25)'
  },
  indicatorFill: {
    height: 1,
    backgroundColor: THEME.ringAccent
  },
  nextButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  nextText: {
    color: EDITORIAL_BLACK,
    fontFamily: FONTS.sans,
    fontSize: 11,
    letterSpacing: 2.4
  },
  googleButton: {
    width: '100%',
    maxWidth: 326,
    height: 52,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: GOOGLE_BORDER,
    borderRadius: 999
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  googleButtonText: {
    color: EDITORIAL_BLACK,
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    letterSpacing: 1.5
  }
})

export const OnboardingCarousel = OnboardingScreen

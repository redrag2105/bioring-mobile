import { BackButton } from '@/components/navigation/BackButton'
import { useRouter } from 'expo-router'
import { ChevronDown } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { Dimensions, Image, Pressable, Text, View, type ViewStyle } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { FONTS, THEME } from '@/constants/theme'
import { useCollectionsQuery } from '@/hooks/queries/useCollectionsQuery'
import type { Collection } from '@/types/collection.types'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const RING_OUTLINE_WATERMARK = require('../../assets/images/collections/ring_outline.png')

const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.54
const IMAGE_WIDTH = SCREEN_WIDTH * 0.88

type CollectionsScreenProps = {
  entryAnimation?: 'default' | 'zoom'
}

type LookbookPageProps = {
  collection: Collection
  index: number
  scrollY: SharedValue<number>
  isLast: boolean
}

export function CollectionsScreen({ entryAnimation = 'default' }: CollectionsScreenProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: collections = [] } = useCollectionsQuery()
  const scrollY = useSharedValue(0)
  const entryProgress = useSharedValue(entryAnimation === 'zoom' ? 0 : 1)

  useEffect(() => {
    if (entryAnimation !== 'zoom') return
    entryProgress.value = withTiming(1, { duration: 540, easing: Easing.out(Easing.cubic) })
  }, [entryAnimation, entryProgress])

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const entryStyle = useAnimatedStyle(() => ({
    opacity: entryProgress.value,
    transform: [{ scale: interpolate(entryProgress.value, [0, 1], [0.94, 1], Extrapolation.CLAMP) }]
  }))

  function handleBack() {
    if (router.canGoBack()) router.back()
    else router.replace('/(dashboard)' as never)
  }

  return (
    <Animated.View className='flex-1 bg-ring-background' style={entryStyle}>
      <View style={{ paddingTop: insets.top + 10 }} className='absolute left-6 z-50'>
        <BackButton onPress={handleBack} className='border-white/40 bg-white/55 shadow-sm' />
      </View>

      <Animated.FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate='fast'
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <LookbookPage collection={item} index={index} scrollY={scrollY} isLast={index === collections.length - 1} />
        )}
      />
    </Animated.View>
  )
}

function LookbookPage({ collection, index, scrollY, isLast }: LookbookPageProps) {
  const insets = useSafeAreaInsets()
  const layoutType = index % 3
  const inputRange = [(index - 1) * SCREEN_HEIGHT, index * SCREEN_HEIGHT, (index + 1) * SCREEN_HEIGHT]

  const decorStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, inputRange, [-160, 0, 180], Extrapolation.CLAMP)
    const rotate = interpolate(scrollY.value, inputRange, [-10, 0, 14], Extrapolation.CLAMP)

    return { transform: [{ translateY }, { rotate: `${rotate}deg` }] }
  })

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollY.value, inputRange, [100, 0, -100], Extrapolation.CLAMP) }]
  }))

  const imageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollY.value, inputRange, [160, 0, -160], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, inputRange, [0.88, 1, 0.88], Extrapolation.CLAMP) }
    ]
  }))

  const watermarkPosition: ViewStyle =
    layoutType === 1 ? { top: '2%', right: '-20%' } : { bottom: '2%', left: layoutType === 2 ? '-15%' : '-20%' }

  return (
    <View
      className='relative bg-ring-background'
      style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH, overflow: 'hidden' }}
    >
      <Animated.View
        pointerEvents='none'
        style={[decorStyle, { position: 'absolute', opacity: 0.04, ...watermarkPosition }]}
      >
        <Image
          source={RING_OUTLINE_WATERMARK}
          resizeMode='contain'
          style={{ height: 560, width: 560 }}
          tintColor={layoutType === 1 ? THEME.ringPrimary : THEME.ringAccent}
        />
      </Animated.View>

      {layoutType === 0 && (
        <>
          <Animated.View
            style={[contentStyle, { position: 'absolute', top: insets.top + 80, left: 24, right: 24, zIndex: 30 }]}
          >
            <CollectionInfoBlock collection={collection} chapter={index + 1} align='left' />
          </Animated.View>

          <Animated.View
            pointerEvents='none'
            style={[imageStyle, { position: 'absolute', right: -32, bottom: insets.bottom + 20, zIndex: 10 }]}
          >
            <CollectionImage collection={collection} />
          </Animated.View>

          <Animated.View
            style={[contentStyle, { position: 'absolute', left: 24, bottom: insets.bottom + 34, zIndex: 70 }]}
          >
            <ExploreButton collection={collection} align='left' />
          </Animated.View>
        </>
      )}

      {layoutType === 1 && (
        <>
          <Animated.View
            style={[contentStyle, { position: 'absolute', top: insets.top + 80, left: 24, right: 24, zIndex: 30 }]}
          >
            <CollectionInfoBlock collection={collection} chapter={index + 1} align='right' />
          </Animated.View>

          <Animated.View
            pointerEvents='none'
            style={[imageStyle, { position: 'absolute', left: -48, bottom: insets.bottom + 40, zIndex: 10 }]}
          >
            <CollectionImage collection={collection} />
          </Animated.View>

          <Animated.View
            style={[contentStyle, { position: 'absolute', right: 24, bottom: insets.bottom + 34, zIndex: 70 }]}
          >
            <ExploreButton collection={collection} align='right' />
          </Animated.View>
        </>
      )}

      {layoutType === 2 && (
        <>
          <Animated.View
            pointerEvents='none'
            style={[imageStyle, { position: 'absolute', right: -24, top: insets.top + 20, zIndex: 10 }]}
          >
            <CollectionImage collection={collection} />
          </Animated.View>

          <Animated.View
            style={[
              contentStyle,
              { position: 'absolute', bottom: insets.bottom + 92, left: 24, right: 24, zIndex: 30 }
            ]}
          >
            <CollectionInfoBlock collection={collection} chapter={index + 1} align='left' compact />
          </Animated.View>

          <Animated.View
            style={[contentStyle, { position: 'absolute', left: 24, bottom: insets.bottom + 28, zIndex: 70 }]}
          >
            <ExploreButton collection={collection} align='left' />
          </Animated.View>
        </>
      )}

      {!isLast && <SwipeUpIndicator />}
    </View>
  )
}

function CollectionInfoBlock({
  collection,
  chapter,
  align = 'left',
  compact = false
}: {
  collection: Collection
  chapter: number
  align?: 'left' | 'right'
  compact?: boolean
}) {
  const isRight = align === 'right'
  const words = collection.name.trim().split(/\s+/)
  const firstLine = words[0] ?? collection.name
  const secondLine = words.slice(1).join(' ') || 'Collection'

  return (
    <View style={{ width: '100%', alignItems: isRight ? 'flex-end' : 'flex-start' }}>
      <Text
        allowFontScaling={false}
        style={{
          fontFamily: FONTS.sans,
          fontSize: 11,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: THEME.ringAccent,
          marginBottom: compact ? 8 : 12
        }}
      >
        Collection {String(chapter).padStart(2, '0')}
      </Text>

      <Text
        allowFontScaling={false}
        style={{
          fontFamily: FONTS.serif,
          fontSize: compact ? 46 : 52,
          lineHeight: compact ? 50 : 58,
          color: THEME.ringPrimary,
          textAlign: isRight ? 'right' : 'left'
        }}
      >
        {firstLine}
        {'\n'}
        <Text style={{ fontFamily: FONTS.serifItalic, color: THEME.ringAccent }}>{secondLine}</Text>
      </Text>

      <Text
        allowFontScaling={false}
        style={{
          fontFamily: FONTS.sansBold,
          fontSize: 11,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: THEME.ringPrimary + '99',
          textAlign: isRight ? 'right' : 'left',
          marginTop: compact ? 16 : 24,
          marginBottom: 6
        }}
      >
        {collection.productCount} Designs
      </Text>

      <Text
        allowFontScaling={false}
        style={{
          fontFamily: FONTS.sans,
          fontSize: 14,
          lineHeight: 22,
          color: THEME.textBody,
          textAlign: isRight ? 'right' : 'left'
        }}
      >
        {collection.description}
      </Text>
    </View>
  )
}

function ExploreButton({ collection, align = 'left' }: { collection: Collection; align?: 'left' | 'right' }) {
  const router = useRouter()
  const isRight = align === 'right'

  return (
    <Pressable
      onPress={() => router.push(`/collections/${collection.id}` as never)}
      className={`flex-row items-center justify-center rounded-full bg-ring-primary px-5 py-3 shadow-md shadow-black/10 ${
        isRight ? 'self-end' : 'self-start'
      }`}
      style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}
    >
      <Text
        allowFontScaling={false}
        className='mr-2 text-[11px] uppercase tracking-[0.22em] text-white'
        style={{ fontFamily: FONTS.sansBold }}
      >
        Explore Now
      </Text>
    </Pressable>
  )
}

function CollectionImage({ collection }: { collection: Collection }) {
  return (
    <View style={{ height: IMAGE_HEIGHT, width: IMAGE_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={{ uri: collection.imageUrl }}
        resizeMode='contain'
        style={{ height: '100%', width: '100%' }}
        accessibilityIgnoresInvertColors
      />
    </View>
  )
}

function SwipeUpIndicator() {
  const bounce = useSharedValue(0)

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )
  }, [bounce])

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }]
  }))

  return (
    <Animated.View
      pointerEvents='none'
      style={[style, { position: 'absolute', bottom: 18, left: 0, right: 0, zIndex: 50, alignItems: 'center' }]}
    >
      <ChevronDown color={THEME.ringPrimary} size={28} strokeWidth={1.2} opacity={0.4} />
    </Animated.View>
  )
}

import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { PenLine, Sparkles } from 'lucide-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

import { THEME } from '@/constants/theme'

const SplitArrowIcon = ({ size = 20, color = THEME.ringAccent }) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Path d='M12 10 L12 3' stroke={color} strokeWidth='1.4' strokeLinecap='round' />
    <Path d='M9 6 L12 3 L15 6' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
    <Path d='M12 14 L12 21' stroke={color} strokeWidth='1.4' strokeLinecap='round' />
    <Path d='M9 18 L12 21 L15 18' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
  </Svg>
)

const TOTAL_HEIGHT = 440
const HALF_HEIGHT = TOTAL_HEIGHT / 2
const DIVIDER_HIT_ZONE = 28

export function StudioCreationOptions() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const splitY = useSharedValue(HALF_HEIGHT)
  const topContentOpacity = useSharedValue(1)
  const bottomContentOpacity = useSharedValue(1)
  const isExpanded = useSharedValue(0)

  const startBounceAnimation = useCallback(() => {
    const pullDistance = 18
    splitY.value = withRepeat(
      withSequence(
        withTiming(HALF_HEIGHT, { duration: 1200 }),
        withTiming(HALF_HEIGHT + pullDistance, { duration: 450, easing: Easing.bezier(0.25, 1, 0.5, 1) }),
        withTiming(HALF_HEIGHT, { duration: 450, easing: Easing.bezier(0.25, 1, 0.5, 1) }),
        withTiming(HALF_HEIGHT, { duration: 1200 }),
        withTiming(HALF_HEIGHT - pullDistance, { duration: 450, easing: Easing.bezier(0.25, 1, 0.5, 1) }),
        withTiming(HALF_HEIGHT, { duration: 450, easing: Easing.bezier(0.25, 1, 0.5, 1) })
      ),
      -1,
      false
    )
  }, [splitY])

  useEffect(() => {
    startBounceAnimation()
  }, [startBounceAnimation])

  function handleSelectPath(path: 'MANUAL' | 'AI') {
    if (isNavigating) return
    setIsNavigating(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    cancelAnimation(splitY)

    isExpanded.value = withTiming(1, { duration: 300 })
    const timingConfig = { duration: 900, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }

    if (path === 'MANUAL') {
      topContentOpacity.value = withTiming(0, { duration: 1000 })
      bottomContentOpacity.value = withTiming(0, { duration: 350 })
      splitY.value = withTiming(TOTAL_HEIGHT, timingConfig)
      setTimeout(() => {
        router.push('/collections' as never)
        resetState()
      }, 720)
    } else {
      bottomContentOpacity.value = withTiming(0, { duration: 1000 })
      topContentOpacity.value = withTiming(0, { duration: 350 })
      splitY.value = withTiming(0, timingConfig)
      setTimeout(() => {
        router.push('/studio/ai-stylist' as never)
        resetState()
      }, 720)
    }
  }

  function resetState() {
    setTimeout(() => {
      splitY.value = HALF_HEIGHT
      topContentOpacity.value = 1
      bottomContentOpacity.value = 1
      isExpanded.value = 0
      setIsNavigating(false)
      startBounceAnimation()
    }, 600)
  }

  const panGesture = Gesture.Pan()
    // Chỉ kích hoạt khi kéo dọc >= 6px — phân biệt với scroll ngang của cha
    .activeOffsetY([-6, 6])
    // Không kích hoạt nếu kéo ngang trước
    .failOffsetX([-10, 10])
    .onBegin(() => {
      // GestureDetector đã giới hạn vùng chạm ở divider rồi
      // Dừng bounce, snap về HALF_HEIGHT để translationY luôn đúng
      cancelAnimation(splitY)
      splitY.value = HALF_HEIGHT
    })
    .onUpdate((event) => {
      if (isNavigating) return
      splitY.value = Math.max(0, Math.min(TOTAL_HEIGHT, HALF_HEIGHT + event.translationY))
    })
    .onEnd((event) => {
      if (isNavigating) return
      if (event.translationY < -56 || event.velocityY < -450 || splitY.value < 100) runOnJS(handleSelectPath)('AI')
      else if (event.translationY > 56 || event.velocityY > 450 || splitY.value > TOTAL_HEIGHT - 100)
        runOnJS(handleSelectPath)('MANUAL')
      else {
        splitY.value = withSpring(HALF_HEIGHT, { damping: 18, stiffness: 180 }, (finished) => {
          if (finished) runOnJS(startBounceAnimation)()
        })
      }
    })

  const topStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: splitY.value,
    overflow: 'hidden',
    zIndex: 2
  }))

  const bottomStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: splitY.value,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  }))

  const topContentStyle = useAnimatedStyle(() => ({
    opacity: topContentOpacity.value,
    transform: [{ translateY: interpolate(topContentOpacity.value, [0, 1], [10, 0]) }]
  }))

  const bottomContentStyle = useAnimatedStyle(() => ({
    opacity: bottomContentOpacity.value,
    transform: [{ translateY: interpolate(bottomContentOpacity.value, [0, 1], [-10, 0]) }]
  }))

  const dividerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: splitY.value - 12 }, { scale: interpolate(isExpanded.value, [0, 1], [1, 0.95]) }],
    opacity: interpolate(isExpanded.value, [0, 1], [1, 0])
  }))

  return (
    <View className='w-full'>
      <View
        className='w-full overflow-hidden rounded-[24px]'
        style={{
          height: TOTAL_HEIGHT,
          backgroundColor: THEME.ringBackground,
          borderColor: THEME.borderLight,
          borderWidth: 0.5
        }}
      >
        {/* TOP — The Canvas */}
        <Animated.View style={topStyle}>
          <View style={{ position: 'absolute', inset: 0, backgroundColor: '#0C1F27' }} />
          <LinearGradient
            colors={[THEME.ringAccent + 'CC', '#0C1F27']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Pressable
            onPress={() => handleSelectPath('MANUAL')}
            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}
          >
            <Animated.View style={topContentStyle} className='flex-row-reverse items-center justify-between pt-2'>
              <View className='flex-1 items-end'>
                <Text
                  style={{ color: THEME.textInverse }}
                  className='mb-2 font-sans text-[10px] uppercase tracking-[0.25em] opacity-80'
                >
                  Master Crafted
                </Text>
                <Text style={{ color: THEME.textInverse }} className='font-serif text-[32px] tracking-tight'>
                  The Canvas
                </Text>
                <Text
                  style={{ color: THEME.textInverse }}
                  className='mt-2 pl-6 text-right font-sans text-[13px] leading-5 opacity-70'
                >
                  Chạm khắc từng đường nét độc bản bằng chính đôi tay bạn.
                </Text>
              </View>
              <View className='mr-4'>
                <PenLine color={THEME.textInverse} size={32} strokeWidth={1} />
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* BOTTOM — AI Stylist */}
        <Animated.View style={[{ backgroundColor: THEME.ringSurface }, bottomStyle]}>
          <Pressable
            onPress={() => handleSelectPath('AI')}
            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}
          >
            <Animated.View style={bottomContentStyle} className='flex-row items-center justify-between pb-2'>
              <View className='flex-1 items-start'>
                <Text
                  style={{ color: THEME.ringAccent }}
                  className='mb-2 font-sans text-[10px] uppercase tracking-[0.25em]'
                >
                  Guided Experience
                </Text>
                <Text style={{ color: THEME.ringPrimary }} className='font-serif text-[32px] tracking-tight'>
                  AI Stylist
                </Text>
                <Text style={{ color: THEME.textBody }} className='mt-2 pr-6 font-sans text-[13px] leading-5'>
                  Sự chuẩn xác của công nghệ kết hợp cùng cảm hứng nghệ thuật.
                </Text>
              </View>
              <View className='ml-4'>
                <Sparkles color={THEME.ringAccent} size={36} strokeWidth={0.75} />
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* Divider — GestureDetector chỉ wrap đúng vùng này */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className='absolute left-0 right-0 top-0 z-50 flex-row items-center justify-center'
            style={[
              dividerStyle,
              {
                height: DIVIDER_HIT_ZONE * 2,
                marginTop: -DIVIDER_HIT_ZONE + 12,
                paddingHorizontal: 24
              }
            ]}
          >
            <View style={{ backgroundColor: THEME.ringAccent, opacity: 0.3, height: 0.5, flex: 1 }} />
            <View className='px-3'>
              <SplitArrowIcon size={16} color={THEME.ringAccent} />
            </View>
            <View style={{ backgroundColor: THEME.ringAccent, opacity: 0.3, height: 0.5, flex: 1 }} />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  )
}

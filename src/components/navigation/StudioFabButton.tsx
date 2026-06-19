import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import Svg, { Circle, Defs, Line, Path, RadialGradient, Stop } from 'react-native-svg'

import { THEME } from '@/constants/theme'

// Bọc SVG thành Animated Component để có thể xoay/scale
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

type StudioFabButtonProps = {
  focused: boolean
  isSticky: boolean
  onPress: () => void
}

// Làm mượt biên độ sóng (smooth transitions)
const soundwaveAmplitudes = [
  3, 4.5, 6, 7.5, 6.5, 5, 3.5, 4.5, 7, 8.5, 7, 5, 3.5, 4.5, 6.5, 8, 6, 4, 3, 4, 6, 7.5, 6.5, 4.5, 3.5, 5, 7, 8.5, 7, 5,
  3.5, 4.5
]

function SoundwaveRing({ active }: { active: boolean }) {
  const center = 32 // Tâm tăng lên 32 (cho viewBox 64x64)
  const axisRadius = 23 // Tăng bán kính trục sóng âm
  const accent = active ? THEME.ringAccent : THEME.ringPrimary

  // Animation values
  const rotation = useSharedValue(0)
  const breathing = useSharedValue(1)

  useEffect(() => {
    if (active) {
      rotation.value = withRepeat(withTiming(360, { duration: 20000, easing: Easing.linear }), -1, false)
      breathing.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    } else {
      rotation.value = withTiming(0, { duration: 500 })
      breathing.value = withTiming(1, { duration: 500 })
    }
  }, [active, rotation, breathing])

  const animatedWaveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: breathing.value }],
    opacity: withTiming(active ? 1 : 0.4, { duration: 300 })
  }))

  return (
    <AnimatedSvg
      width={64} // Kích thước tổng 64
      height={64}
      viewBox='0 0 64 64'
      style={[{ position: 'absolute' }, animatedWaveStyle]}
    >
      <Defs>
        <RadialGradient id='glow' cx='50%' cy='50%' r='50%'>
          <Stop offset='0%' stopColor={accent} stopOpacity={active ? 0.15 : 0} />
          <Stop offset='70%' stopColor={accent} stopOpacity={active ? 0.05 : 0} />
          <Stop offset='100%' stopColor={accent} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={center} cy={center} r={axisRadius + 7} fill='url(#glow)' />

      <Circle
        cx={center}
        cy={center}
        r={axisRadius}
        stroke={accent}
        strokeOpacity={active ? 0.2 : 0.1}
        strokeWidth={1}
        fill='none'
      />

      {soundwaveAmplitudes.map((amplitude, index) => {
        const angle = (index / soundwaveAmplitudes.length) * Math.PI * 2 - Math.PI / 2
        const dynamicAmp = active ? amplitude : amplitude * 0.5

        const innerRadius = axisRadius - dynamicAmp / 2
        const outerRadius = axisRadius + dynamicAmp / 2

        const x1 = center + Math.cos(angle) * innerRadius
        const y1 = center + Math.sin(angle) * innerRadius
        const x2 = center + Math.cos(angle) * outerRadius
        const y2 = center + Math.sin(angle) * outerRadius

        return (
          <Line
            key={`${index}-${amplitude}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={accent}
            strokeOpacity={active ? (index % 2 === 0 ? 0.9 : 0.6) : 0.3}
            strokeWidth={1.5}
            strokeLinecap='round'
          />
        )
      })}
    </AnimatedSvg>
  )
}

function FingerprintIcon({ active }: { active: boolean }) {
  const accent = active ? THEME.ringAccent : THEME.ringPrimary

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(active ? 1.06 : 1, {
          duration: 300,
          easing: Easing.out(Easing.back(1.5))
        })
      }
    ]
  }))

  const strokeProps = {
    stroke: accent,
    strokeWidth: active ? 2 : 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none'
  }

  return (
    <Animated.View style={iconStyle}>
      <Svg width={24} height={24} viewBox='0 0 24 24'>
        <Path d='M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4' {...strokeProps} strokeOpacity={active ? 1 : 0.6} />
        <Path d='M14 13.12c0 2.38 0 6.38-1 8.88' {...strokeProps} strokeOpacity={active ? 1 : 0.6} />

        <Path d='M9 6.8a6 6 0 0 1 9 5.2v2' {...strokeProps} strokeOpacity={active ? 0.85 : 0.5} />
        <Path d='M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2' {...strokeProps} strokeOpacity={active ? 0.85 : 0.5} />

        <Path d='M2 12a10 10 0 0 1 18-6' {...strokeProps} strokeOpacity={active ? 0.65 : 0.4} />
        <Path d='M21.8 16c.2-2 .131-5.354 0-6' {...strokeProps} strokeOpacity={active ? 0.65 : 0.4} />

        <Path d='M17.29 21.02c.12-.6.43-2.3.5-3.02' {...strokeProps} strokeOpacity={active ? 0.45 : 0.25} />
        <Path d='M8.65 22c.21-.66.45-1.32.57-2' {...strokeProps} strokeOpacity={active ? 0.45 : 0.25} />
        <Path d='M2 16h.01' {...strokeProps} strokeOpacity={active ? 0.45 : 0.25} />
      </Svg>
    </Animated.View>
  )
}

export function StudioFabButton({ focused, isSticky, onPress }: StudioFabButtonProps) {
  const fabAnimatedStyle = useAnimatedStyle(() => {
    const topOffset = -32

    return {
      top: withSpring(topOffset, { damping: 14, stiffness: 90, mass: 0.8 }),
      transform: [{ scale: withTiming(focused ? 1 : 0.95, { duration: 300, easing: Easing.out(Easing.exp) }) }],
      shadowColor: THEME.ringAccent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: withTiming(focused ? 0.25 : 0.08, { duration: 300 }),
      shadowRadius: withTiming(focused ? 10 : 4, { duration: 300 }),
      elevation: focused ? 6 : 2
    }
  })

  return (
    <TouchableOpacity className={`flex-1 items-center justify-start pt-2`} onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        className='absolute h-[64px] w-[64px] items-center justify-center rounded-full bg-ring-surface'
        style={[{ zIndex: 10 }, fabAnimatedStyle]}
      >
        <View
          className={`h-[54px] w-[54px] items-center justify-center rounded-full border-[0.5px] transition-all duration-300 ${
            focused ? 'border-ring-accent/40 bg-ring-background' : 'border-ring-accent/15 bg-ring-surface'
          }`}
        >
          <SoundwaveRing active={focused} />
          <View
            className={`h-[36px] w-[36px] items-center justify-center rounded-full border-[0.5px] ${
              focused ? 'border-ring-accent/40 bg-ring-background/90' : 'border-ring-accent/15 bg-ring-surface/95'
            }`}
          >
            <FingerprintIcon active={focused} />
          </View>
        </View>
      </Animated.View>

      <View className='h-[42px] w-[42px]' />

      {!isSticky && (
        <Text
          className={`font-sans-medium text-[11px] tracking-wide ${focused ? 'text-ring-accent' : 'text-txt-muted'}`}
          numberOfLines={1}
        ></Text>
      )}
    </TouchableOpacity>
  )
}

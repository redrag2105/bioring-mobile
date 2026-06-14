import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  useSharedValue, 
  Easing
} from 'react-native-reanimated'
import Svg, { Circle, Line, Path, Defs, RadialGradient, Stop } from 'react-native-svg'

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
  3, 4.5, 6, 7.5, 6.5, 5, 3.5, 4.5,
  7, 8.5, 7, 5, 3.5, 4.5, 6.5, 8,
  6, 4, 3, 4, 6, 7.5, 6.5, 4.5,
  3.5, 5, 7, 8.5, 7, 5, 3.5, 4.5
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
      rotation.value = withRepeat(
        withTiming(360, { duration: 20000, easing: Easing.linear }),
        -1, 
        false
      )
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
  }, [active])

  const animatedWaveStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: breathing.value }
    ],
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
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={accent} stopOpacity={active ? 0.15 : 0} />
          <Stop offset="70%" stopColor={accent} stopOpacity={active ? 0.05 : 0} />
          <Stop offset="100%" stopColor={accent} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={center} cy={center} r={axisRadius + 7} fill="url(#glow)" />

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
    transform: [{ scale: withTiming(active ? 1.05 : 1, { duration: 300, easing: Easing.out(Easing.back(1.5)) }) }]
  }))

  return (
    <Animated.View style={iconStyle}>
      <Svg width={24} height={24} viewBox='0 0 30 30'> 
        {/* Tăng nhẹ icon lên 24 */}
        <Path d='M8.2 13.8c.1-3.9 3.1-6.5 6.8-6.5 3.8 0 6.8 2.8 6.8 6.7' stroke={accent} strokeWidth={1.5} strokeLinecap='round' fill='none' />
        <Path d='M6.1 16.5v-2.2C6.1 9.2 10 5.5 15 5.5s8.9 3.8 8.9 8.9v1.8' stroke={accent} strokeOpacity={active ? 0.7 : 0.4} strokeWidth={1.2} strokeLinecap='round' fill='none' />
        <Path d='M10.5 15.5c0-2.8 1.9-4.8 4.5-4.8s4.5 2 4.5 4.8c0 5.2-1.8 7.5-4.7 9.4' stroke={accent} strokeWidth={1.5} strokeLinecap='round' fill='none' />
        <Path d='M13 15.6c0-1.3.8-2.2 2-2.2s2 .9 2 2.2c0 3.7-1.1 5.4-3.4 7.1' stroke={accent} strokeOpacity={active ? 0.9 : 0.5} strokeWidth={1.2} strokeLinecap='round' fill='none' />
        <Path d='M8.6 19.3c.4 1.7 1.3 3 2.8 4M21.5 19.8c-.6 2.3-1.8 4.1-3.6 5.6' stroke={accent} strokeOpacity={active ? 0.6 : 0.3} strokeWidth={1.2} strokeLinecap='round' fill='none' />
      </Svg>
    </Animated.View>
  )
}


export function StudioFabButton({ focused, isSticky, onPress }: StudioFabButtonProps) {
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(focused ? 1 : 0.95, { duration: 300, easing: Easing.out(Easing.exp) }) }
    ],
    shadowColor: THEME.ringAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: withTiming(focused ? 0.25 : 0.08, { duration: 300 }),
    shadowRadius: withTiming(focused ? 10 : 4, { duration: 300 }),
    elevation: focused ? 6 : 2
  }))

  return (
    <TouchableOpacity
      className={`flex-1 items-center justify-center pt-1`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View
        className='absolute top-[-26px] h-[64px] w-[64px] items-center justify-center rounded-full bg-ring-surface'
        style={[
          { zIndex: 10 },
          fabAnimatedStyle
        ]}
      >
        <View
          className={`h-[54px] w-[54px] items-center justify-center rounded-full transition-all duration-300 border-[0.5px] ${
            focused 
              ? 'bg-ring-background border-ring-accent/40' 
              : 'bg-ring-surface border-ring-accent/15'
          }`}
        >
          <SoundwaveRing active={focused} />
          <View 
            className={`h-[36px] w-[36px] items-center justify-center rounded-full border-[0.5px] ${
              focused 
                ? 'bg-ring-background/90 border-ring-accent/40' 
                : 'bg-ring-surface/95 border-ring-accent/15'
            }`}
          >
            <FingerprintIcon active={focused} />
          </View>
        </View>
      </Animated.View>

      <View className='h-[42px] w-[42px]' /> 

      {!isSticky && (
        <Text 
          className={`font-sans-medium text-[11px] tracking-wide ${
            focused ? 'text-ring-accent' : 'text-txt-muted'
          }`}
          numberOfLines={1}
        >
          Studio
        </Text>
      )}
    </TouchableOpacity>
  )
}
import { X } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

import { FONTS, THEME } from '@/constants/theme'

type OverlayProps = {
  modeProgress: SharedValue<number>
}

export function Cinematic360Overlay({ modeProgress }: OverlayProps) {
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(modeProgress.value, [0.55, 1], [0, 1]),
    transform: [{ translateY: interpolate(modeProgress.value, [0, 1], [10, 0]) }]
  }))

  return (
    <View pointerEvents='none' className='absolute inset-0 z-10'>
      <Animated.View style={labelStyle} className='absolute bottom-[15%] left-0 right-0 items-center'>
        <Text
          allowFontScaling={false}
          style={{ color: THEME.ringAccent, fontFamily: FONTS.serif }}
          className='text-[11px] uppercase tracking-[0.4em]'
        >
          360° Explorer
        </Text>
        <Text
          allowFontScaling={false}
          style={{ fontFamily: FONTS.sans }}
          className='mt-2 text-[9px] uppercase tracking-[0.25em] text-white/40'
        >
          Drag to interact
        </Text>
      </Animated.View>
    </View>
  )
}

type OpenButtonProps = {
  is360Mode: boolean
  animatedStyle: object
  onPress: () => void
}

export function Open360Button({ is360Mode, animatedStyle, onPress }: OpenButtonProps) {
  return (
    <Animated.View
      pointerEvents={is360Mode ? 'none' : 'auto'}
      style={animatedStyle}
      className='absolute right-6 top-[45%] z-20'
    >
      <Pressable
        onPress={onPress}
        style={{ backgroundColor: `${THEME.ringSecondary}90`, borderColor: `${THEME.ringAccent}40` }}
        className='h-12 w-12 items-center justify-center rounded-full border-[0.5px] backdrop-blur-md active:opacity-70'
      >
        <Text allowFontScaling={false} style={{ fontFamily: FONTS.serif }} className='text-[10px] tracking-widest text-white'>
          360°
        </Text>
      </Pressable>
    </Animated.View>
  )
}

type CloseButtonProps = {
  visible: boolean
  animatedStyle: object
  topInset: number
  onPress: () => void
}

export function Close360Button({ visible, animatedStyle, topInset, onPress }: CloseButtonProps) {
  if (!visible) return null

  return (
    <Animated.View style={[animatedStyle, { marginTop: topInset }]} className='absolute left-6 top-6 z-30'>
      <Pressable
        onPress={onPress}
        style={{ backgroundColor: `${THEME.ringSecondary}90`, borderColor: `${THEME.ringAccent}40` }}
        className='h-10 w-10 items-center justify-center rounded-full border-[0.5px] backdrop-blur-md active:opacity-70'
      >
        <X color='#FFFFFF' size={18} strokeWidth={1} />
      </Pressable>
    </Animated.View>
  )
}

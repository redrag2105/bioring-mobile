import { THEME } from '@/constants/theme'
import { Gem } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { LayoutChangeEvent, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

type PositionSliderProps = {
  label: string
  value: number
  onChange: (value: number) => void
  valueLabel?: string
}

const THUMB_SIZE = 22

function clamp(value: number, min: number, max: number) {
  'worklet'
  return Math.min(Math.max(value, min), max)
}

export function PositionSlider({ label, value, onChange, valueLabel }: PositionSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0)
  const x = useSharedValue(0)
  const startX = useSharedValue(0)

  useEffect(() => {
    if (!trackWidth) return
    x.value = withTiming(value * trackWidth, { duration: 180 })
  }, [trackWidth, value, x])

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width)
  }

  const commit = (nextX: number) => {
    if (!trackWidth) return
    onChange(Number((nextX / trackWidth).toFixed(3)))
  }

  const pan = Gesture.Pan()
    .onBegin(() => {
      startX.value = x.value
    })
    .onUpdate((event) => {
      x.value = clamp(startX.value + event.translationX, 0, trackWidth)
    })
    .onFinalize(() => {
      runOnJS(commit)(x.value)
    })

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value - THUMB_SIZE / 2 }]
  }))

  const progressStyle = useAnimatedStyle(() => ({
    width: x.value
  }))

  return (
    <View className='gap-3'>
      <View className='flex-row items-center justify-between'>
        <Text className='font-sans-bold text-[9px] uppercase tracking-[0.26em] text-ring-primary/50'>{label}</Text>
        <Text className='font-serif text-[18px] text-ring-primary'>
          {valueLabel ?? `${Math.round(value * 360)} deg`}
        </Text>
      </View>

      <View className='px-2 py-4'>
        <View onLayout={handleLayout} className='h-[1px] justify-center bg-ring-primary/15'>
          <Animated.View className='absolute left-0 h-[1px] bg-ring-accent' style={progressStyle} />
          <GestureDetector gesture={pan}>
            <Animated.View
              className='absolute h-[22px] w-[22px] items-center justify-center rounded-full border border-ring-accent/40 bg-white shadow-sm shadow-ring-accent/20'
              style={thumbStyle}
            >
              <Gem color={THEME.ringAccent} size={11} strokeWidth={1.6} />
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </View>
  )
}

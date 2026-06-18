import { useEffect, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

type SoundWaveTrackProps = {
  amplitudes: number[]
  cropStart: number
  duration: number
  cropDuration: number
  onCropChange?: (cropStart: number) => void
  onDragUpdate?: (currentStart: number) => void
  playheadTime?: number
  isPlaybackActive?: boolean
  activeColor?: string
}

export function SoundWaveTrack({
  amplitudes,
  cropStart,
  duration,
  cropDuration,
  onCropChange,
  onDragUpdate,
  playheadTime,
  isPlaybackActive,
  activeColor = 'bg-ring-accent'
}: SoundWaveTrackProps) {
  const [trackWidth, setTrackWidth] = useState(0)

  const maxStart = Math.max(duration - cropDuration, 0)
  const safeDuration = Math.max(duration, cropDuration)

  const cropStartSV = useSharedValue(cropStart)
  const [localCropStart, setLocalCropStart] = useState(cropStart)

  useEffect(() => {
    cancelAnimation(cropStartSV)
    cropStartSV.value = cropStart
    setLocalCropStart(cropStart)
  }, [cropStart, cropStartSV])

  useAnimatedReaction(
    () => cropStartSV.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        const rounded = Number(currentValue.toFixed(2))
        scheduleOnRN(setLocalCropStart, rounded)

        if (onDragUpdate) {
          scheduleOnRN(onDragUpdate, rounded)
        }
      }
    }
  )

  const cropStartRatio = localCropStart / safeDuration
  const cropEndRatio = (localCropStart + cropDuration) / safeDuration

  const clampedPlayhead =
    isPlaybackActive && typeof playheadTime === 'number'
      ? Math.min(Math.max(playheadTime, 0), safeDuration)
      : localCropStart

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width)
  }

  const cropGesture = Gesture.Pan()
    .onBegin(() => {
      cancelAnimation(cropStartSV)
    })
    .onChange((event) => {
      if (!trackWidth) return
      const deltaX = (event.changeX / trackWidth) * duration
      cropStartSV.value = Math.min(Math.max(cropStartSV.value + deltaX, 0), maxStart)
    })
    .onEnd((event) => {
      if (!trackWidth) return
      const velocityX = (event.velocityX / trackWidth) * duration

      // Quán tính trượt
      cropStartSV.value = withDecay(
        {
          velocity: velocityX,
          clamp: [0, maxStart],
          deceleration: 0.995
        },
        (finished) => {
          if (finished && onCropChange) {
            scheduleOnRN(onCropChange, Number(cropStartSV.value.toFixed(2)))
          }
        }
      )
    })

  const boxAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: `${(cropStartSV.value / safeDuration) * 100}%`
    }
  })

  return (
    <View className='relative h-28 overflow-hidden rounded-[26px] border border-white/80 bg-[#F9F6EF]'>
      <View onLayout={handleLayout} className='absolute bottom-0 left-4 right-4 top-0'>
        {/* Sound wave */}
        <View className='absolute bottom-0 left-0 right-0 top-0'>
          {amplitudes.map((height, index) => {
            const normalizedPosition = index / Math.max(amplitudes.length - 1, 1)
            const isInsideCrop = normalizedPosition >= cropStartRatio && normalizedPosition <= cropEndRatio

            return (
              <View
                key={`${height}-${index}`}
                className='absolute bottom-0 top-0 items-center justify-center'
                style={{
                  left: `${normalizedPosition * 100}%`,
                  width: 4,
                  marginLeft: -2
                }}
              >
                <View
                  className={`rounded-full ${isInsideCrop ? activeColor : 'bg-ring-primary/20'}`}
                  style={{
                    height: Math.max(10, height),
                    width: isInsideCrop ? 3 : 2,
                    opacity: isInsideCrop ? 0.95 : 0.62
                  }}
                />
              </View>
            )
          })}
        </View>

        {/* 3s box */}
        <GestureDetector gesture={cropGesture}>
          <Animated.View
            className='absolute bottom-1 top-1 rounded-[22px] border border-ring-accent/60 bg-white/25 shadow-sm shadow-ring-primary/10'
            style={[{ width: `${(cropDuration / safeDuration) * 100}%` }, boxAnimatedStyle]}
          >
            {/* Inside decorations */}
            <View className='absolute inset-0.5 rounded-[18px] border border-white/60 bg-ring-accent/5' />
            <View className='absolute left-1/2 top-3 h-1 w-8 -translate-x-1/2 rounded-full bg-ring-accent/40' />
            <View className='absolute bottom-3 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-ring-accent/25' />

            {/* Crop handles */}
            <View className='absolute -left-[7px] bottom-6 top-6 w-[14px] items-center justify-center rounded-full border border-ring-accent/50 bg-white/90 shadow-sm shadow-ring-primary/10'>
              <View className='h-7 w-[2px] rounded-full bg-ring-accent/45' />
            </View>
            <View className='absolute -right-[7px] bottom-6 top-6 w-[14px] items-center justify-center rounded-full border border-ring-accent/50 bg-white/90 shadow-sm shadow-ring-primary/10'>
              <View className='h-7 w-[2px] rounded-full bg-ring-accent/45' />
            </View>
          </Animated.View>
        </GestureDetector>

        {/* Cursor */}
        {typeof clampedPlayhead === 'number' ? (
          <View
            className={`absolute bottom-3 top-3 w-[2px] rounded-full ${
              isPlaybackActive ? 'bg-ring-primary/80' : 'bg-ring-primary/20'
            }`}
            pointerEvents='none'
            style={{ left: `${(clampedPlayhead / safeDuration) * 100}%` }}
          >
            <View className='absolute -left-[3px] -top-[3px] h-2 w-2 rounded-full bg-ring-primary/70' />
          </View>
        ) : null}
      </View>
    </View>
  )
}

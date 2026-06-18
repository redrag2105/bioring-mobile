import { useRef, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

type SoundWaveTrackProps = {
  amplitudes: number[]
  cropStart: number
  duration: number
  cropDuration: number
  onCropChange?: (cropStart: number) => void
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
  playheadTime,
  isPlaybackActive,
  activeColor = 'bg-ring-accent'
}: SoundWaveTrackProps) {
  const [trackWidth, setTrackWidth] = useState(0)
  const dragStartCropRef = useRef(cropStart)
  const maxStart = Math.max(duration - cropDuration, 0)
  const safeDuration = Math.max(duration, cropDuration)
  const cropStartRatio = cropStart / safeDuration
  const cropEndRatio = (cropStart + cropDuration) / safeDuration
  const clampedPlayhead =
    typeof playheadTime === 'number' ? Math.min(Math.max(playheadTime, 0), safeDuration) : undefined

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width)
  }

  const captureDragStart = () => {
    dragStartCropRef.current = cropStart
  }

  const commitCropFromTranslation = (translationX: number) => {
    if (!trackWidth || !onCropChange) return
    const nextStart = Math.min(Math.max(dragStartCropRef.current + (translationX / trackWidth) * duration, 0), maxStart)
    onCropChange(Number(nextStart.toFixed(2)))
  }

  const cropGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(captureDragStart)()
    })
    .onUpdate((event) => {
      runOnJS(commitCropFromTranslation)(event.translationX)
    })

  return (
    <GestureDetector gesture={cropGesture}>
      <View className='relative h-28 overflow-hidden rounded-[26px] border border-white/80 bg-[#F9F6EF]'>
        <View className='absolute left-4 right-4 top-4 flex-row items-center justify-between'>
          <View className='h-1.5 w-1.5 rounded-full bg-ring-primary/20' />
          <View className='h-[1px] flex-1 bg-ring-primary/10' />
          <View className='h-1.5 w-1.5 rounded-full bg-ring-primary/20' />
        </View>

        <View className='absolute bottom-5 left-4 right-4 h-[1px] bg-ring-primary/10' />

        <View onLayout={handleLayout} className='absolute bottom-0 left-4 right-4 top-0'>
          <View
            className='absolute bottom-3 top-3 rounded-[22px] border border-ring-accent/60 bg-white/25 shadow-sm shadow-ring-primary/10'
            pointerEvents='none'
            style={{
              left: `${cropStartRatio * 100}%`,
              width: `${(cropDuration / safeDuration) * 100}%`
            }}
          >
            <View className='absolute inset-1 rounded-[18px] border border-white/60 bg-ring-accent/5' />
            <View className='absolute left-1/2 top-3 h-1 w-8 -translate-x-1/2 rounded-full bg-ring-accent/40' />
            <View className='absolute bottom-3 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-ring-accent/25' />
          </View>

          <View className='h-full flex-row items-center justify-between'>
            {amplitudes.map((height, index) => {
              const normalizedPosition = index / Math.max(amplitudes.length - 1, 1)
              const isInsideCrop = normalizedPosition >= cropStartRatio && normalizedPosition <= cropEndRatio

              return (
                <View
                  key={`${height}-${index}`}
                  className={`rounded-full ${isInsideCrop ? activeColor : 'bg-ring-primary/20'}`}
                  style={{
                    height: Math.max(10, height),
                    width: isInsideCrop ? 3 : 2,
                    opacity: isInsideCrop ? 0.95 : 0.62
                  }}
                />
              )
            })}
          </View>

          <View
            className='absolute bottom-3 top-3'
            pointerEvents='none'
            style={{
              left: `${cropStartRatio * 100}%`,
              width: `${(cropDuration / safeDuration) * 100}%`
            }}
          >
            <View className='absolute -left-[7px] bottom-4 top-4 w-[14px] items-center justify-center rounded-full border border-ring-accent/50 bg-white/90 shadow-sm shadow-ring-primary/10'>
              <View className='h-7 w-[2px] rounded-full bg-ring-accent/45' />
            </View>
            <View className='absolute -right-[7px] bottom-4 top-4 w-[14px] items-center justify-center rounded-full border border-ring-accent/50 bg-white/90 shadow-sm shadow-ring-primary/10'>
              <View className='h-7 w-[2px] rounded-full bg-ring-accent/45' />
            </View>
          </View>

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
    </GestureDetector>
  )
}

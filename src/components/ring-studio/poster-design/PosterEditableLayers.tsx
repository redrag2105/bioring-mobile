import { POSTER_MESSAGE_MAX_CHARS, type PosterElementFrame } from '@/constants/posterTemplates'
import { Pause, Pencil, Play, Upload } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { PosterWaveform } from './PosterWaveform'

export type BiometricType = 'sound_wave' | 'heartbeat'

function percentToNumber(value: `${number}%`) {
  return Number(value.replace('%', ''))
}

export function frameStyle(frame: PosterElementFrame) {
  return {
    top: frame.top,
    left: frame.left,
    width: frame.width,
    height: frame.height,
    borderRadius: frame.borderRadius
  }
}

function textStyle(frame: PosterElementFrame, canvasWidth: number) {
  return {
    fontFamily: frame.fontFamily,
    fontSize: frame.fontSize ? (percentToNumber(frame.fontSize) / 100) * canvasWidth : undefined,
    textAlign: frame.textAlign,
    color: frame.color,
    letterSpacing: frame.letterSpacing,
    textTransform: frame.textTransform
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getBoundedOffset(offset: { x: number; y: number }, scale: number, size: { width: number; height: number }) {
  const maxX = Math.max(0, (size.width * (scale - 1)) / 2)
  const maxY = Math.max(0, (size.height * (scale - 1)) / 2)

  return {
    x: clamp(offset.x, -maxX, maxX),
    y: clamp(offset.y, -maxY, maxY)
  }
}

function calculateCrop({
  sourceSize,
  frameSize,
  offset,
  scale
}: {
  sourceSize: { width: number; height: number }
  frameSize: { width: number; height: number }
  offset: { x: number; y: number }
  scale: number
}) {
  if (!sourceSize.width || !sourceSize.height || !frameSize.width || !frameSize.height) return undefined

  const coverScale = Math.max(frameSize.width / sourceSize.width, frameSize.height / sourceSize.height)
  const renderedScale = coverScale * scale
  const renderedWidth = sourceSize.width * renderedScale
  const renderedHeight = sourceSize.height * renderedScale
  const x = (renderedWidth - frameSize.width) / 2 - offset.x
  const y = (renderedHeight - frameSize.height) / 2 - offset.y

  return {
    offset: {
      x: clamp(x / renderedScale, 0, sourceSize.width),
      y: clamp(y / renderedScale, 0, sourceSize.height)
    },
    size: {
      width: clamp(frameSize.width / renderedScale, 1, sourceSize.width),
      height: clamp(frameSize.height / renderedScale, 1, sourceSize.height)
    },
    displaySize: frameSize,
    resizeMode: 'cover' as const
  }
}

export function EditableTextLayer({
  frame,
  value,
  editable,
  onChangeText,
  canvasWidth,
  showCounter
}: {
  frame: PosterElementFrame
  value: string
  editable: boolean
  onChangeText: (value: string) => void
  canvasWidth: number
  showCounter?: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  if (!editable) {
    return (
      <View className='absolute' pointerEvents='none' style={frameStyle(frame)}>
        <Text className='m-0 h-full w-full p-0' style={textStyle(frame, canvasWidth)}>
          {value}
        </Text>
      </View>
    )
  }

  if (!isEditing) {
    return (
      <View className='absolute' pointerEvents='box-none' style={frameStyle(frame)}>
        <Text className='m-0 h-full w-full p-0' pointerEvents='none' style={textStyle(frame, canvasWidth)}>
          {value}
        </Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className='absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-white/85 active:opacity-75'
        >
          <Pencil color='#1A3642' size={11} strokeWidth={1.4} />
        </Pressable>
        {showCounter ? (
          <View className='absolute -bottom-5 right-0 rounded-full bg-white/80 px-2 py-0.5'>
            <Text className='font-sans-bold text-[8px] text-ring-primary/60'>
              {value.length}/{POSTER_MESSAGE_MAX_CHARS}
            </Text>
          </View>
        ) : null}
      </View>
    )
  }

  return (
    <View className='absolute' style={frameStyle(frame)}>
      <TextInput
        ref={inputRef}
        editable
        value={value}
        onChangeText={(nextValue) => {
          const normalizedValue = nextValue.replace(/[\r\n]+/g, ' ')
          onChangeText(showCounter ? normalizedValue.slice(0, POSTER_MESSAGE_MAX_CHARS) : normalizedValue)
        }}
        onBlur={() => setIsEditing(false)}
        multiline
        scrollEnabled={false}
        blurOnSubmit
        maxLength={showCounter ? POSTER_MESSAGE_MAX_CHARS : undefined}
        className='m-0 h-full w-full bg-white/20 p-0'
        style={textStyle(frame, canvasWidth)}
      />
      <View className='absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-white/85'>
        <Pencil color='#1A3642' size={11} strokeWidth={1.4} />
      </View>
      {showCounter ? (
        <View className='absolute -bottom-5 right-0 rounded-full bg-white/80 px-2 py-0.5'>
          <Text className='font-sans-bold text-[8px] text-ring-primary/60'>
            {value.length}/{POSTER_MESSAGE_MAX_CHARS}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

export function PosterPhotoLayer({
  frame,
  uri,
  editable,
  isPicking,
  offset,
  scale,
  sourceSize,
  onPickImage,
  onTransformChange,
  onCropChange
}: {
  frame: PosterElementFrame
  uri: string
  editable: boolean
  isPicking: boolean
  offset: { x: number; y: number }
  scale: number
  sourceSize?: { width: number; height: number }
  onPickImage: () => void
  onTransformChange: (transform: { offset: { x: number; y: number }; scale: number }) => void
  onCropChange: (
    crop:
      | {
          offset: { x: number; y: number }
          size: { width: number; height: number }
          displaySize: { width: number; height: number }
          resizeMode: 'cover'
        }
      | undefined
  ) => void
}) {
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })
  const translateX = useSharedValue(offset.x)
  const translateY = useSharedValue(offset.y)
  const imageScale = useSharedValue(scale)
  const startX = useSharedValue(offset.x)
  const startY = useSharedValue(offset.y)
  const startScale = useSharedValue(scale)

  useEffect(() => {
    translateX.value = offset.x
    translateY.value = offset.y
    imageScale.value = scale
    startScale.value = scale
  }, [imageScale, offset.x, offset.y, scale, startScale, translateX, translateY])

  useEffect(() => {
    onCropChange(sourceSize ? calculateCrop({ sourceSize, frameSize, offset, scale }) : undefined)
  }, [frameSize, offset, onCropChange, scale, sourceSize])

  const commitTransform = (nextOffset: { x: number; y: number }, nextScale: number) => {
    const boundedOffset = getBoundedOffset(nextOffset, nextScale, frameSize)
    translateX.value = boundedOffset.x
    translateY.value = boundedOffset.y
    imageScale.value = nextScale
    onTransformChange({ offset: boundedOffset, scale: nextScale })
  }

  const pan = Gesture.Pan()
    .enabled(editable)
    .onBegin(() => {
      startX.value = translateX.value
      startY.value = translateY.value
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX
      translateY.value = startY.value + event.translationY
    })
    .onEnd(() => {
      runOnJS(commitTransform)({ x: translateX.value, y: translateY.value }, imageScale.value)
    })

  const pinch = Gesture.Pinch()
    .enabled(editable)
    .onBegin(() => {
      startScale.value = imageScale.value
    })
    .onUpdate((event) => {
      imageScale.value = Math.min(Math.max(startScale.value * event.scale, 1), 3)
    })
    .onEnd(() => {
      runOnJS(commitTransform)({ x: translateX.value, y: translateY.value }, imageScale.value)
    })

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: imageScale.value }]
  }))

  return (
    <View
      className='absolute overflow-hidden bg-ring-primary/10'
      style={frameStyle(frame)}
      onLayout={(event) => {
        setFrameSize({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height
        })
      }}
    >
      <GestureDetector gesture={Gesture.Simultaneous(pan, pinch)}>
        <Animated.Image source={{ uri }} resizeMode='cover' className='h-full w-full' style={imageStyle} />
      </GestureDetector>

      {editable ? (
        <Pressable
          onPress={onPickImage}
          disabled={isPicking}
          className='absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 active:opacity-75'
        >
          {isPicking ? <ActivityIndicator color='#1A3642' size='small' /> : <Upload color='#1A3642' size={15} strokeWidth={1.5} />}
        </Pressable>
      ) : null}
    </View>
  )
}

export function PosterBiometricLayer({
  type,
  values,
  frame,
  playback
}: {
  type: BiometricType
  values: number[]
  frame: PosterElementFrame
  playback?: {
    isPlaying: boolean
    durationSeconds: number
    onPress: () => void
  }
}) {
  return (
    <View className='absolute flex-row items-center gap-2 overflow-hidden' style={frameStyle(frame)}>
      <View className='h-full min-w-0 flex-1'>
        <PosterWaveform values={values} type={type} />
      </View>
      {playback ? (
        <Pressable
          onPress={playback.onPress}
          accessibilityRole='button'
          accessibilityLabel={`${playback.isPlaying ? 'Pause' : 'Play'} full ${Math.round(playback.durationSeconds)} second SoundWave`}
          className='h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ring-primary/15 bg-white/85 active:opacity-70'
        >
          {playback.isPlaying ? (
            <Pause color='#1A3642' size={12} strokeWidth={1.7} />
          ) : (
            <Play color='#1A3642' size={12} fill='#1A3642' strokeWidth={1.5} />
          )}
        </Pressable>
      ) : null}
    </View>
  )
}

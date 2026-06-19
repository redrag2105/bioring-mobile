import { THEME } from '@/constants/theme'
import { FolderUp, Info, Mic2 } from 'lucide-react-native'
import { useState } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'

type SoundWaveRecorderCardProps = {
  isPreparing: boolean
  isRecording: boolean
  hasRecordedClip: boolean
  durationMillis: number
  recordingError: string | null
  recordingPulse: Animated.Value
  onRecordPress: () => void
  onUploadPress: () => void
}

export function SoundWaveRecorderCard({
  isPreparing,
  isRecording,
  hasRecordedClip,
  durationMillis,
  recordingError,
  recordingPulse,
  onRecordPress,
  onUploadPress
}: SoundWaveRecorderCardProps) {
  const isUploadDisabled = isPreparing || isRecording
  const [isTooltipVisible, setTooltipVisible] = useState(false)

  return (
    <View className='items-center gap-3 rounded-[26px] border border-white/70 bg-white/45 px-5 py-6 shadow-sm shadow-ring-primary/5'>
      <Pressable
        onPress={() => setTooltipVisible((visible) => !visible)}
        className='absolute right-3 top-3 z-20 h-7 w-7 items-center justify-center rounded-full border border-ring-primary/10 bg-white/80 active:opacity-70'
      >
        <Info color={THEME.ringPrimary} size={14} strokeWidth={1.5} />
      </Pressable>

      {isTooltipVisible ? (
        <View className='absolute right-3 top-11 z-20 w-[230px] rounded-[8px] border border-ring-primary/10 bg-white px-3 py-2.5 shadow-lg shadow-ring-primary/10'>
          <Text className='font-sans text-[10px] leading-4 text-ring-primary/80'>
            Record up to 15s. The product engraving uses your selected 3s segment, while the full 15s recording stays available in the Memory Card.
          </Text>
          <Text className='mt-1.5 font-sans text-[10px] leading-4 text-ring-primary/80'>
            Record a voice note, then trim exactly 3 seconds for the physical engraving.
          </Text>
        </View>
      ) : null}

      <Animated.View
        style={{
          opacity: recordingPulse,
          transform: [
            {
              scale: recordingPulse.interpolate({
                inputRange: [0.48, 1],
                outputRange: [0.92, 1]
              })
            }
          ]
        }}
      >
        <Pressable
          onPress={onRecordPress}
          disabled={isPreparing}
          className={`h-[76px] w-[76px] items-center justify-center rounded-full border border-white/80 shadow-xl shadow-ring-primary/20 active:opacity-80 ${
            isRecording ? 'bg-ring-accent' : 'bg-ring-primary'
          }`}
        >
          <Mic2 color={isRecording ? '#FFFFFF' : THEME.ringAccent} size={28} strokeWidth={1.4} />
        </Pressable>
      </Animated.View>

      <Pressable
        onPress={onUploadPress}
        disabled={isUploadDisabled}
        className={`flex-row items-center justify-center gap-2 rounded-full border-[0.5px] border-ring-primary/10 bg-white px-3.5 py-2 shadow-sm ${
          isUploadDisabled ? 'opacity-40' : 'opacity-80'
        }`}
        style={({ pressed }) => ({
          transform: [{ scale: pressed && !isUploadDisabled ? 0.96 : 1 }]
        })}
      >
        <FolderUp color={THEME.ringPrimary} size={12} strokeWidth={1.5} />
        <Text
          allowFontScaling={false}
          className='font-sans-bold text-[9px] uppercase tracking-[0.2em] text-ring-primary/70'
        >
          Or Import Audio
        </Text>
      </Pressable>

      <View className='items-center gap-1'>
        <Text className='font-sans-bold text-[9px] uppercase tracking-[0.28em] text-ring-accent'>
          {isPreparing
            ? 'Preparing'
            : isRecording
              ? 'Tap to Stop'
              : hasRecordedClip
                ? 'Recorded SoundWave'
                : 'Record SoundWave'}
        </Text>
        {isRecording ? (
          <Text className='text-center font-sans text-[12px] leading-5 text-txt-muted'>
            {(durationMillis / 1000).toFixed(1)}s captured
          </Text>
        ) : null}
        {recordingError ? (
          <Text className='text-center font-sans text-[11px] leading-4 text-red-700'>{recordingError}</Text>
        ) : null}
      </View>
    </View>
  )
}

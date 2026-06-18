import { THEME } from '@/constants/theme'
import { Mic2 } from 'lucide-react-native'
import { Animated, Pressable, Text, View } from 'react-native'

type SoundWaveRecorderCardProps = {
  isPreparing: boolean
  isRecording: boolean
  hasRecordedClip: boolean
  durationMillis: number
  recordingError: string | null
  recordingPulse: Animated.Value
  onRecordPress: () => void
}

export function SoundWaveRecorderCard({
  isPreparing,
  isRecording,
  hasRecordedClip,
  durationMillis,
  recordingError,
  recordingPulse,
  onRecordPress
}: SoundWaveRecorderCardProps) {
  return (
    <View className='items-center gap-3 rounded-[26px] border border-white/70 bg-white/45 px-5 py-6 shadow-sm shadow-ring-primary/5'>
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
        <Text className='text-center font-sans text-[12px] leading-5 text-txt-muted'>
          {isRecording
            ? `${(durationMillis / 1000).toFixed(1)}s captured`
            : 'Record a voice note, then trim exactly 3 seconds for the physical engraving.'}
        </Text>
        {recordingError ? (
          <Text className='text-center font-sans text-[11px] leading-4 text-red-700'>{recordingError}</Text>
        ) : null}
      </View>
    </View>
  )
}

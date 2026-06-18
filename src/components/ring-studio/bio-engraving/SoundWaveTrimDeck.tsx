import { THEME } from '@/constants/theme'
import { Pause, Play, Scissors, Timer, Waves } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { SoundWaveTrack } from './SoundWaveTrack'

export type SoundWavePlaybackMode = 'full' | 'trim'

type SoundWavePlaybackControlsProps = {
  activePlaybackMode: SoundWavePlaybackMode | null
  onPreviewPress: (mode: SoundWavePlaybackMode) => Promise<void> | void
}

export function SoundWavePlaybackControls({ activePlaybackMode, onPreviewPress }: SoundWavePlaybackControlsProps) {
  const controls = [
    { mode: 'trim' as const, label: 'Trim 3s', caption: 'Engraving cut', Icon: Scissors },
    { mode: 'full' as const, label: 'Full 15s', caption: 'Memory card', Icon: Waves }
  ]

  return (
    <View className='flex-row gap-2 p-1.5'>
      {controls.map(({ mode, label, caption, Icon }) => {
        const isActive = activePlaybackMode === mode

        return (
          <Pressable
            key={mode}
            onPress={() => {
              void onPreviewPress(mode)
            }}
            className={`h-[54px] flex-1 flex-row items-center justify-center gap-2 rounded-[19px] ${
              isActive ? 'bg-ring-primary shadow-none' : ' bg-white/70 shadow-sm shadow-ring-primary/5'
            }`}
            style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}
          >
            <View
              className={`h-8 w-8 items-center justify-center rounded-full ${
                isActive ? 'bg-white/20' : 'bg-ring-accent/10'
              }`}
            >
              {isActive ? (
                <Pause color='#FFFFFF' size={14} strokeWidth={1.7} />
              ) : (
                <Play color={THEME.ringPrimary} size={13} strokeWidth={1.7} />
              )}
            </View>
            <View className='min-w-0'>
              <View className='flex-row items-center gap-1.5'>
                <Text
                  allowFontScaling={false}
                  className={`font-sans-bold text-[9px] uppercase tracking-[0.16em] ${
                    isActive ? 'text-white' : 'text-ring-primary/70'
                  }`}
                >
                  {label}
                </Text>
              </View>
              <Text
                allowFontScaling={false}
                className={`mt-0.5 font-sans text-[10px] ${isActive ? 'text-white/70' : 'text-txt-muted'}`}
              >
                {caption}
              </Text>
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

type SoundWaveTrimDeckProps = {
  amplitudes: number[]
  cropStart: number
  duration: number
  cropDuration: number
  trimEnd: number
  playheadTime: number
  activePlaybackMode: SoundWavePlaybackMode | null
  onCropChange: (cropStart: number) => void
  onPreviewPress: (mode: SoundWavePlaybackMode) => void
}

export function SoundWaveTrimDeck({
  amplitudes,
  cropStart,
  duration,
  cropDuration,
  trimEnd,
  playheadTime,
  activePlaybackMode,
  onCropChange,
  onPreviewPress
}: SoundWaveTrimDeckProps) {
  const [liveCropStart, setLiveCropStart] = useState(cropStart)

  useEffect(() => {
    setLiveCropStart(cropStart)
  }, [cropStart])

  const liveTrimEnd = Math.min(liveCropStart + cropDuration, duration)

  return (
    <View className='rounded-[28px] shadow-xl shadow-ring-primary/10'>
      <View className='gap-4 overflow-hidden rounded-[28px] border border-white/70 bg-white/50 p-5 '>
        <View className='absolute left-0 right-0 top-0 h-1 bg-ring-accent/70' />
        <View className='flex-row items-center justify-between gap-4'>
          <View className='min-w-0 flex-1 flex-row items-center gap-3'>
            <View className='h-9 w-9 items-center justify-center rounded-full bg-ring-accent/10'>
              <Scissors color={THEME.ringAccent} size={15} strokeWidth={1.5} />
            </View>
            <View className='min-w-0 flex-1'>
              <Text className='font-sans-bold text-[9px] uppercase tracking-[0.24em] text-ring-primary/50'>
                Required 3s Trim
              </Text>
              <Text className='mt-1 font-sans text-[12px] leading-5 text-txt-muted'>
                Drag the highlighted window across the recorded wave.
              </Text>
            </View>
          </View>
        </View>

        <SoundWavePlaybackControls activePlaybackMode={activePlaybackMode} onPreviewPress={onPreviewPress} />

        <SoundWaveTrack
          amplitudes={amplitudes}
          cropStart={cropStart}
          duration={duration}
          cropDuration={cropDuration}
          playheadTime={playheadTime}
          isPlaybackActive={Boolean(activePlaybackMode)}
          onDragUpdate={(val) => {
            setLiveCropStart(val)
          }}
          onCropChange={(val) => {
            setLiveCropStart(val)
            onCropChange(val)
          }}
        />

        <View className='flex-row items-center justify-between rounded-[18px] bg-white/70 px-4 py-3 shadow-sm shadow-ring-primary/5'>
          <View>
            <Text className='font-sans-bold text-[8px] uppercase tracking-[0.24em] text-ring-primary/40'>Start</Text>
            <Text allowFontScaling={false} className='mt-1 font-serif text-[18px] text-ring-primary'>
              {liveCropStart.toFixed(1)}s
            </Text>
          </View>
          <View className='mx-4 h-[1px] flex-1 bg-ring-primary/10' />
          <View className='items-end'>
            <View className='flex-row items-center gap-1.5'>
              <Timer color={THEME.ringPrimary} size={10} strokeWidth={1.5} />
              <Text className='font-sans-bold text-[8px] uppercase tracking-[0.24em] text-ring-primary/40'>End</Text>
            </View>
            <Text allowFontScaling={false} className='mt-1 font-serif text-[18px] text-ring-primary'>
              {liveTrimEnd.toFixed(1)}s
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

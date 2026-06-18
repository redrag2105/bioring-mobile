import { Canvas3D } from '@/components/ring-studio/Canvas3D'
import { SoundWavePlaybackControls } from '@/components/ring-studio/bio-engraving/SoundWaveTrimDeck'
import { useSoundWavePlayback } from '@/components/ring-studio/bio-engraving/useSoundWavePlayback'
import { THEME } from '@/constants/theme'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { formatPrice } from '@/utils/formatPrice'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const MATERIAL_LABELS: Record<string, string> = {
  'm1-uuid': 'Platinum',
  'm2-uuid': '18K Gold',
  'm3-uuid': 'Rose Gold',
  'm4-uuid': 'Silver'
}

const GEMSTONE_LABELS: Record<string, string> = {
  'g1-uuid': 'Diamond',
  'g2-uuid': 'Ruby'
}

const BIO_LABELS = {
  sound_wave: 'SoundWave',
  fingerprint: 'FingerPrint',
  heartbeat: 'HeartBeat'
} as const

function BioPreviewStrip() {
  const packageTypes = useRingDesignStore((state) => state.package_types)
  const soundWave = useRingDesignStore((state) => state.customization_config.soundWave)
  const shouldShowRealSoundWave =
    packageTypes.length === 1 && packageTypes.includes('sound_wave') && Boolean(soundWave?.sourceUri)

  if (!shouldShowRealSoundWave) return null

  const duration = soundWave?.durationSeconds ?? 3
  const cropStart = soundWave?.cropStartSeconds ?? 0
  const cropDuration = soundWave?.cropDurationSeconds ?? 3
  const amplitudes = soundWave?.amplitudes ?? []

  return (
    <View className='h-24 justify-center rounded-[22px] border border-white/70 bg-white/45 px-3'>
      <View className='h-14 flex-row items-center justify-between'>
        {amplitudes.map((height, index) => {
          const normalizedPosition = index / Math.max(amplitudes.length - 1, 1)
          const isInsideCrop =
            normalizedPosition >= cropStart / duration && normalizedPosition <= (cropStart + cropDuration) / duration

          return (
            <View
              key={`${height}-${index}`}
              className={`w-[2px] rounded-full ${isInsideCrop ? 'bg-ring-accent' : 'bg-ring-primary/25'}`}
              style={{ height: Math.max(12, height) }}
            />
          )
        })}
      </View>
      <Text className='mt-1 text-center font-sans text-[11px] text-ring-primary/55'>
        {cropStart.toFixed(1)}s - {(cropStart + cropDuration).toFixed(1)}s
      </Text>
    </View>
  )
}

function BioPreviewSection() {
  const packageTypes = useRingDesignStore((state) => state.package_types)
  const soundWave = useRingDesignStore((state) => state.customization_config.soundWave)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  const shouldShowRealSoundWave =
    packageTypes.length === 1 && packageTypes.includes('sound_wave') && Boolean(soundWave?.sourceUri)

  const cropStart = soundWave?.cropStartSeconds ?? 0
  const cropDuration = soundWave?.cropDurationSeconds ?? 3
  const duration = soundWave?.durationSeconds ?? 15
  const trimEnd = Math.min(cropStart + cropDuration, duration)
  const { activePlaybackMode, handlePreviewPress } = useSoundWavePlayback({
    sourceUri: soundWave?.sourceUri,
    cropStart,
    trimEnd,
    duration,
    onPlaybackError: () => setPlaybackError('Playback could not start. Please try again.')
  })

  const handleSummaryPreviewPress = useCallback(
    async (mode: Parameters<typeof handlePreviewPress>[0]) => {
      setPlaybackError(null)
      await handlePreviewPress(mode)
    },
    [handlePreviewPress]
  )

  if (!shouldShowRealSoundWave) return null

  return (
    <View className='mt-5 gap-3'>
      <Text className='font-sans-bold text-[9px] uppercase tracking-[0.24em] text-ring-primary/50'>
        Recorded SoundWave Trim
      </Text>
      <BioPreviewStrip />
      <SoundWavePlaybackControls activePlaybackMode={activePlaybackMode} onPreviewPress={handleSummaryPreviewPress} />
      {playbackError ? <Text className='font-sans text-[11px] leading-4 text-red-500'>{playbackError}</Text> : null}
    </View>
  )
}

function SummaryRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <View className='flex-row items-start justify-between gap-4 border-b border-ring-primary/10 py-3'>
      <Text className='pt-1 font-sans-bold text-[9px] uppercase tracking-[0.22em] text-ring-primary/40'>{label}</Text>
      <Text
        className={`min-w-0 flex-1 text-right font-serif text-[18px] leading-6 text-ring-primary ${
          multiline ? 'flex-wrap' : ''
        }`}
      >
        {value}
      </Text>
    </View>
  )
}

function SummaryHeader() {
  return (
    <View className='border-b border-ring-primary/10 px-5 pb-3 pt-4'>
      <View className='flex-row items-center justify-between'>
        <View>
          <Text className='font-sans-bold text-[8px] uppercase tracking-[0.32em] text-ring-accent'>03 Full Review</Text>
          <Text className='mt-0.5 font-serif text-[27px] leading-8 text-ring-primary'>Design Summary</Text>
        </View>
        <CheckCircle2 color={THEME.ringAccent} size={24} strokeWidth={1.4} />
      </View>
    </View>
  )
}

function FulfillmentNotice() {
  const packageTypes = useRingDesignStore((state) => state.package_types)
  const onlySoundWave = packageTypes.length === 1 && packageTypes.includes('sound_wave')

  return (
    <View className='mt-5 flex-row items-start gap-3 rounded-[18px] border border-ring-accent/20 bg-ring-accent/5 px-4 py-4'>
      <ShieldCheck color={THEME.ringAccent} size={17} strokeWidth={1.4} style={{ marginTop: 1 }} />
      <Text className='flex-1 font-sans text-[12px] leading-5 text-ring-primary/70'>
        {onlySoundWave
          ? 'Your selected 3-second SoundWave will be used for the physical engraving.'
          : 'Selected biometric data will be captured at the Atelier. The saved position, scale, and rotation will guide final data mapping.'}
      </Text>
    </View>
  )
}

export function DesignReviewScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const selectedMaterialId = useRingDesignStore((state) => state.selected_material_id)
  const selectedGemstoneId = useRingDesignStore((state) => state.selected_gemstone_id)
  const gemstoneShape = useRingDesignStore((state) => state.selected_gemstone_shape)
  const ringSize = useRingDesignStore((state) => state.ring_size)
  const packageTypes = useRingDesignStore((state) => state.package_types)
  const estimatedPrice = useRingDesignStore((state) => state.estimated_price)
  const placement = useRingDesignStore((state) => state.customization_config.placement)
  const physicalEngravingType = useRingDesignStore((state) => state.customization_config.physicalEngravingType)
  const resolvedEngravingType = physicalEngravingType ?? (packageTypes.length === 1 ? packageTypes[0] : undefined)

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/(screens)/bio-engraving-studio' as never)
  }, [router])

  return (
    <View className='flex-1 bg-ring-background'>
      <Canvas3D />
      <LinearGradient
        colors={['rgba(248,247,245,0)', '#F8F7F5']}
        locations={[0.35, 1]}
        className='absolute bottom-0 left-0 right-0 z-[1] h-[48%]'
      />

      <SafeAreaView className='z-20 flex-1' edges={['top']}>
        <View className='z-30 flex-row items-center justify-between px-5 pt-1'>
          <Pressable
            onPress={handleBack}
            className='h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/65 shadow-sm shadow-ring-primary/10 active:opacity-75'
          >
            <ArrowLeft color={THEME.ringPrimary} size={18} strokeWidth={1.5} />
          </Pressable>
          <View className='h-9 w-9' />
        </View>

        <View className='flex-1 justify-end px-0' style={{ paddingBottom: insets.bottom + 76 }}>
          <View className='max-h-[66%] overflow-hidden rounded-t-[34px] border border-white/70 bg-white/70 shadow-2xl shadow-ring-primary/15'>
            <LinearGradient colors={['rgba(255,255,255,0.96)', 'rgba(248,247,245,0.8)']} className='absolute inset-0' />
            <SummaryHeader />
            <ScrollView
              showsVerticalScrollIndicator={false}
              className='px-5'
              contentContainerStyle={{ paddingBottom: 28, paddingTop: 10 }}
            >
              <SummaryRow label='Material' value={MATERIAL_LABELS[selectedMaterialId ?? ''] ?? 'Platinum'} />
              <SummaryRow label='Size' value={ringSize ?? 'Size 6'} />
              <SummaryRow
                label='Gemstone'
                value={selectedGemstoneId ? `${GEMSTONE_LABELS[selectedGemstoneId]} / ${gemstoneShape}` : 'No stone'}
              />
              <SummaryRow
                label='Bio Package'
                value={packageTypes.map((item) => BIO_LABELS[item]).join(' + ')}
                multiline
              />
              <SummaryRow
                label='Engraving'
                value={resolvedEngravingType ? BIO_LABELS[resolvedEngravingType] : 'Not selected'}
              />
              <SummaryRow label='Placement' value={placement === 'outer_band' ? 'Outer Band' : 'Inner Band'} />

              <BioPreviewSection />

              <FulfillmentNotice />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>

      <View
        className='absolute bottom-0 left-0 right-0 z-40 justify-center border-t border-white/70 bg-[#F8F7F5]/90 px-5 shadow-2xl shadow-ring-primary/10'
        style={{
          height: (insets.bottom > 0 ? insets.bottom : 0) + 60,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 0
        }}
      >
        <View className='flex-row items-center justify-between gap-4'>
          <View className='flex-1'>
            <Text className='font-sans-bold text-[8px] uppercase tracking-[0.22em] text-ring-primary/45'>
              Final Estimate
            </Text>
            <Text className='font-serif text-[20px] leading-6 text-ring-primary'>{formatPrice(estimatedPrice)}</Text>
          </View>

          <Pressable
            onPress={() => router.push('/(screens)/memory-card-design' as never)}
            className='h-[44px] flex-row items-center gap-2.5 rounded-full bg-ring-primary px-5 shadow-lg shadow-ring-primary/25 active:opacity-85'
          >
            <Text className='font-sans-bold text-[9px] uppercase tracking-[0.2em] text-white'>Confirm & Next</Text>
            <ArrowRight color='#FFFFFF' size={16} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default DesignReviewScreen

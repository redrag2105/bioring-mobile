import { BioEngravingStudio } from '@/components/ring-studio/BioEngravingStudio'
import { PriceText } from '@/components/common/PriceText'
import { Canvas3D } from '@/components/ring-studio/Canvas3D'
import { StudioHeader } from '@/components/ring-studio/StudioHeader'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowRight, PenLine } from 'lucide-react-native'
import { useCallback } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

function EngravingFooter({
  onReview,
  disabled,
  disabledLabel
}: {
  onReview: () => void
  disabled: boolean
  disabledLabel: string
}) {
  const insets = useSafeAreaInsets()
  const estimatedPrice = useRingDesignStore((state) => state.estimated_price)

  return (
    <View
      className='absolute bottom-0 left-0 right-0 z-40 justify-center border-t border-white/70 bg-[#F8F7F5] px-5 shadow-2xl shadow-ring-primary/10'
      style={{
        paddingBottom: Math.max(insets.bottom, 16),
        paddingTop: 16
      }}
    >
      <View className='flex-row items-center justify-between gap-4'>
        <View className='flex-1'>
          <Text className='font-sans-bold text-[8px] uppercase tracking-[0.22em] text-ring-primary/45'>
            Studio Total
          </Text>
          <PriceText value={estimatedPrice} className='text-[19px] leading-6 text-ring-primary' />
        </View>

        <Pressable
          onPress={onReview}
          disabled={disabled}
          className={`h-[44px] flex-row items-center gap-2.5 rounded-full px-5 shadow-lg shadow-ring-primary/25 active:opacity-85 ${
            disabled ? 'bg-ring-primary/30' : 'bg-ring-primary'
          }`}
        >
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.2em] text-white'>
            {disabled ? disabledLabel : 'Review Design'}
          </Text>
          <ArrowRight color='#FFFFFF' size={16} strokeWidth={1.5} />
        </Pressable>
      </View>
    </View>
  )
}

export function BioEngravingStudioScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const selectedTypes = useRingDesignStore((state) => state.package_types)
  const physicalEngravingType = useRingDesignStore((state) => state.customization_config.physicalEngravingType)
  const soundWave = useRingDesignStore((state) => state.customization_config.soundWave)

  const engravableTypes = selectedTypes.filter((type) => type !== 'heartbeat')
  const isOnlySoundWavePackage = selectedTypes.length === 1 && selectedTypes.includes('sound_wave')
  const hasRequiredSoundWaveClip = Boolean(soundWave?.sourceUri)
  const hasSelectedEngraving =
    engravableTypes.length <= 1 || Boolean(physicalEngravingType && physicalEngravingType !== 'heartbeat')
  const canReview = hasSelectedEngraving && (!isOnlySoundWavePackage || hasRequiredSoundWaveClip)
  const disabledLabel = isOnlySoundWavePackage && !hasRequiredSoundWaveClip ? 'Add SoundWave' : 'Choose Engraving'

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/(screens)/ring-studio' as never)
  }, [router])

  const handleReview = useCallback(() => {
    if (canReview) router.push('/(screens)/design-review' as never)
  }, [canReview, router])

  return (
    <View className='flex-1 bg-ring-background'>
      <Canvas3D />
      <LinearGradient
        colors={['rgba(248,247,245,0)', '#F8F7F5']}
        locations={[0.2, 1]}
        className='absolute left-0 right-0 top-[35%] z-[1] h-[18%]'
      />

      <SafeAreaView className='z-20 flex-1' edges={['top']}>
        <StudioHeader onBack={handleBack} />

        <View className='flex-1 justify-end px-0' style={{ paddingBottom: 0 }}>
          <View className='max-h-[75%] overflow-hidden rounded-t-[34px] border border-white/70 bg-white/65 shadow-2xl shadow-ring-primary/15'>
            <LinearGradient
              colors={['rgba(255,255,255,0.92)', 'rgba(248,247,245,0.74)']}
              className='absolute inset-0'
            />

            <View className='border-b border-ring-primary/10 px-5 pb-3 pt-4'>
              <View className='flex-row items-start justify-between gap-5'>
                <View className='min-w-0 flex-1'>
                  <Text className='font-sans-bold text-[8px] uppercase tracking-[0.32em] text-ring-accent'>
                    03 Bio-Engraving Studio
                  </Text>
                  <Text className='mt-0.5 font-serif text-[28px] leading-8 text-ring-primary'>Engraving Tools</Text>
                </View>
                <View className='h-9 w-9 items-center justify-center rounded-full border border-ring-accent/20 bg-ring-accent/10'>
                  <PenLine color='#B69B7A' size={16} strokeWidth={1.4} />
                </View>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className='px-5'
              contentContainerStyle={{ paddingBottom: insets.bottom + 98, paddingTop: 22 }}
            >
              <BioEngravingStudio />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>

      <EngravingFooter onReview={handleReview} disabled={!canReview} disabledLabel={disabledLabel} />
    </View>
  )
}

export default BioEngravingStudioScreen

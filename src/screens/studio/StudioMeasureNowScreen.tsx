import { useRouter } from 'expo-router'
import { ArrowLeft, Info, X } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FingerMeasurePreview } from '@/components/studio/FingerMeasurePreview'
import { MeasurementRuler, RULER_TICK_WIDTH } from '@/components/studio/MeasurementRuler'
import { STUDIO_DIRECT_MEASURE, STUDIO_MEASURE_OPTIONS } from '@/constants/staticContent'
import { THEME } from '@/constants/theme'

function clampMeasureIndex(index: number) {
  return Math.min(Math.max(index, 0), STUDIO_MEASURE_OPTIONS.length - 1)
}

export function StudioMeasureNowScreen() {
  const router = useRouter()
  const rulerRef = useRef<ScrollView>(null)
  const [measureIndex, setMeasureIndex] = useState(5)
  const [isInfoVisible, setInfoVisible] = useState(false)
  const [savedSize, setSavedSize] = useState<string | null>(null)

  const measurement = STUDIO_MEASURE_OPTIONS[measureIndex]

  function handleBack() {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/(dashboard)/studio' as never)
  }

  function syncRuler(index: number) {
    rulerRef.current?.scrollTo({ x: index * RULER_TICK_WIDTH, animated: false })
  }

  function updateMeasure(nextIndex: number) {
    const clampedIndex = clampMeasureIndex(nextIndex)
    setMeasureIndex(clampedIndex)
    syncRuler(clampedIndex)
  }

  function handleSaveSize() {
    setSavedSize(`${measurement.size} · ${measurement.mm} mm`)
  }

  return (
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top', 'bottom']}>
        <View className='flex-row items-center justify-between px-5 py-3'>
          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Back'
            onPress={handleBack}
            className='h-11 w-11 items-center justify-center rounded-full border border-ui-border bg-ring-surface'
          >
            <ArrowLeft color={THEME.ringPrimary} size={20} strokeWidth={1.8} />
          </Pressable>

          <View className='flex-row items-center gap-2'>
            <Pressable
              accessibilityRole='button'
              accessibilityLabel='Open measuring guide'
              onPress={() => setInfoVisible(true)}
              className='h-11 w-11 items-center justify-center rounded-full border border-ui-border bg-ring-surface'
            >
              <Info color={THEME.ringAccent} size={19} strokeWidth={1.8} />
            </Pressable>
          </View>
        </View>

        <View className='flex-1 px-5 pb-1'>
          <View className='mb-4'>
            <Text className='font-serif text-[32px] leading-10 text-ring-primary'>{STUDIO_DIRECT_MEASURE.title}</Text>
            <Text className='mt-2 font-sans text-sm leading-6 text-txt-body'>{STUDIO_DIRECT_MEASURE.subtitle}</Text>
          </View>

          <View className='mb-4 gap-3 rounded-[24px] border border-ring-accent/20 bg-ring-surface p-4'>
            <View className='flex-row items-center justify-between gap-4'>
              <View className='flex-1'>
                <Text className='font-sans-bold text-[10px] uppercase tracking-[0.22em] text-ring-accent'>
                  Selected size
                </Text>
                <Text className='mt-1 font-serif text-[26px] leading-8 text-ring-primary'>
                  {measurement.size} · {measurement.mm} mm
                </Text>
              </View>
              <Pressable
                accessibilityRole='button'
                accessibilityLabel={STUDIO_DIRECT_MEASURE.resultButton}
                onPress={handleSaveSize}
                className='h-11 justify-center rounded-full bg-ring-primary px-4'
              >
                <Text className='font-sans-bold text-[10px] uppercase tracking-wider text-txt-inverse'>Save</Text>
              </Pressable>
            </View>

            {savedSize ? (
              <View className='rounded-full border border-status-success/20 bg-status-success/10 px-4 py-3'>
                <Text className='text-center font-sans-bold text-xs uppercase tracking-wider text-status-success'>
                  {STUDIO_DIRECT_MEASURE.savedLabel}: {savedSize}
                </Text>
              </View>
            ) : null}
          </View>

          <View className='flex-1 justify-end gap-4'>
            <MeasurementRuler
              activeIndex={measureIndex}
              rulerRef={rulerRef}
              onDecrease={() => updateMeasure(measureIndex - 1)}
              onIncrease={() => updateMeasure(measureIndex + 1)}
              onSelect={updateMeasure}
            />

            <FingerMeasurePreview
              diameter={measurement.diameter}
              fingerWidthClass={measurement.fingerWidthClass}
              size={measurement.size}
            />
          </View>
        </View>

        <Modal visible={isInfoVisible} transparent animationType='fade' onRequestClose={() => setInfoVisible(false)}>
          <View className='flex-1 justify-center bg-ring-secondary/60 px-5'>
            <View className='gap-5 rounded-[28px] border border-ring-accent/20 bg-ring-surface p-5'>
              <View className='flex-row items-start justify-between gap-4'>
                <View className='flex-1'>
                  <Text className='font-sans-bold text-[10px] uppercase tracking-[0.22em] text-ring-accent'>
                    Accuracy Tip
                  </Text>
                  <Text className='mt-2 font-serif text-[26px] leading-8 text-ring-primary'>
                    {STUDIO_DIRECT_MEASURE.infoTitle}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole='button'
                  accessibilityLabel='Close measuring guide'
                  onPress={() => setInfoVisible(false)}
                  className='h-10 w-10 items-center justify-center rounded-full bg-ring-background'
                >
                  <X color={THEME.ringPrimary} size={18} strokeWidth={1.8} />
                </Pressable>
              </View>

              <Text className='font-sans text-sm leading-6 text-txt-body'>{STUDIO_DIRECT_MEASURE.infoDescription}</Text>

              <Pressable
                onPress={() => setInfoVisible(false)}
                className='h-12 items-center justify-center rounded-full bg-ring-primary'
              >
                <Text className='font-sans-bold text-xs uppercase tracking-wider text-txt-inverse'>Got it</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  )
}

import { FingerMeasurePreview } from '@/components/studio/FingerMeasurePreview'
import { MeasurementRuler, RULER_TICK_WIDTH } from '@/components/studio/MeasurementRuler'
import { RingCirclePreview } from '@/components/studio/RingCirclePreview'
import { MeasureInfoModal } from '@/components/studio/measure-now/MeasureInfoModal'
import { MeasureModeHeader } from '@/components/studio/measure-now/MeasureModeHeader'
import { MeasurementSummaryCard } from '@/components/studio/measure-now/MeasurementSummaryCard'
import { STUDIO_DIRECT_MEASURE } from '@/constants/staticContent'
import { STUDIO_PHYSICAL_MEASURE_OPTIONS } from '@/constants/studioMeasure'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { mmToLogicalPixels } from '@/utils/physicalScale'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import {
  Alert,
  Keyboard,
  LayoutAnimation,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  UIManager,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

type MeasureMode = 'finger' | 'ring'

const PREVIEW_AREA_HEIGHT = mmToLogicalPixels(66)
const MEASUREMENT_SUGGESTIONS = [
  'Index finger',
  'Middle finger',
  'Ring finger',
  'Wedding ring',
  'Everyday ring',
  'Couple ring'
]

function clampMeasureIndex(index: number) {
  return Math.min(Math.max(index, 0), STUDIO_PHYSICAL_MEASURE_OPTIONS.length - 1)
}

function getLiveMeasurement(index: number) {
  const clampedIndex = clampMeasureIndex(index)
  const lowerIndex = Math.floor(clampedIndex)
  const upperIndex = Math.ceil(clampedIndex)
  const lowerMeasure = STUDIO_PHYSICAL_MEASURE_OPTIONS[lowerIndex]
  const upperMeasure = STUDIO_PHYSICAL_MEASURE_OPTIONS[upperIndex]
  const progress = clampedIndex - lowerIndex
  const nearestMeasure = STUDIO_PHYSICAL_MEASURE_OPTIONS[Math.round(clampedIndex)]
  const diameterMm = lowerMeasure.diameterMm + (upperMeasure.diameterMm - lowerMeasure.diameterMm) * progress

  return {
    ...nearestMeasure,
    diameterMm,
    diameter: `${diameterMm.toFixed(1)} mm`
  }
}

export function StudioMeasureNowScreen() {
  const router = useRouter()
  const rulerRef = useRef<ScrollView>(null)
  const saveRingMeasurement = useRingDesignStore((state) => state.saveRingMeasurement)
  const [measureMode, setMeasureMode] = useState<MeasureMode>('finger')
  const [measureIndex, setMeasureIndex] = useState(5)
  const [liveMeasureIndex, setLiveMeasureIndex] = useState(5)
  const [measurementName, setMeasurementName] = useState('')
  const [isInfoVisible, setInfoVisible] = useState(false)

  const liveMeasurement = getLiveMeasurement(liveMeasureIndex)
  const canSaveMeasurement = measurementName.trim().length > 0
  const isRingMode = measureMode === 'ring'
  const modeToggleLabel = isRingMode ? 'Switch to finger measure' : 'Switch to ring measure'
  const infoTitle = isRingMode ? 'Align the inner edge' : STUDIO_DIRECT_MEASURE.infoTitle
  const infoDescription = isRingMode
    ? 'Place your physical ring flat on the screen. Adjust the circle until the graphic outer edge sits exactly on the ring inner diameter.'
    : STUDIO_DIRECT_MEASURE.infoDescription

  function handleBack() {
    if (router.canGoBack()) router.back()
    else router.replace('/(dashboard)/studio' as never)
  }

  function syncRuler(index: number) {
    rulerRef.current?.scrollTo({ x: index * RULER_TICK_WIDTH, animated: false })
  }

  function updateMeasure(nextIndex: number) {
    const clampedIndex = clampMeasureIndex(nextIndex)
    setMeasureIndex(clampedIndex)
    setLiveMeasureIndex(clampedIndex)
    syncRuler(clampedIndex)
  }

  function handleSave() {
    if (!canSaveMeasurement) return

    Keyboard.dismiss()
    Alert.alert(
      'Confirm Measurement',
      `Are you sure you want to save "${measurementName.trim()}" as ${liveMeasurement.size}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          style: 'default',
          onPress: () => {
            saveRingMeasurement({
              name: measurementName.trim(),
              size: liveMeasurement.size,
              diameterMm: liveMeasurement.diameterMm,
              mode: measureMode
            })
            if (router.canGoBack()) router.back()
            else router.replace('/(screens)/ring-studio' as never)
          }
        }
      ]
    )
  }

  function handleToggleMeasureMode() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setMeasureMode((currentMode) => (currentMode === 'finger' ? 'ring' : 'finger'))
  }

  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View className='flex-1 bg-ring-background'>
        <LinearGradient
          colors={['#F8F7F5', '#EEF3EF', '#F7EFE8']}
          locations={[0, 0.52, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          className='absolute inset-0'
        />

        <SafeAreaView className='flex-1' edges={['top', 'bottom']}>
          <View className='flex-1 px-5 pb-1 pt-2'>
            <MeasureModeHeader
              title={STUDIO_DIRECT_MEASURE.title || 'Size Guidance'}
              isRingMode={isRingMode}
              modeToggleLabel={modeToggleLabel}
              onBack={handleBack}
              onToggleMode={handleToggleMeasureMode}
              onOpenInfo={() => setInfoVisible(true)}
            />

            <View className='flex-1 justify-between gap-3'>
              <MeasurementSummaryCard
                size={liveMeasurement.size}
                diameter={liveMeasurement.diameter}
                measurementName={measurementName}
                suggestions={MEASUREMENT_SUGGESTIONS}
                canSave={canSaveMeasurement}
                onNameChange={setMeasurementName}
                onClearName={() => setMeasurementName('')}
                onSave={handleSave}
                onSubmitName={Keyboard.dismiss}
              />

              <MeasurementRuler
                activeIndex={measureIndex}
                rulerRef={rulerRef}
                onDecrease={() => updateMeasure(measureIndex - 1)}
                onIncrease={() => updateMeasure(measureIndex + 1)}
                liveIndex={liveMeasureIndex}
                onLiveChange={(nextIndex) => setLiveMeasureIndex(clampMeasureIndex(nextIndex))}
                onSelect={updateMeasure}
              />

              <View
                pointerEvents='none'
                className='shrink-0 justify-end'
                style={{ height: PREVIEW_AREA_HEIGHT, minHeight: PREVIEW_AREA_HEIGHT, flexShrink: 0 }}
              >
                {isRingMode ? (
                  <RingCirclePreview
                    diameter={liveMeasurement.diameter}
                    diameterMm={liveMeasurement.diameterMm}
                    size={liveMeasurement.size}
                  />
                ) : (
                  <FingerMeasurePreview
                    diameter={liveMeasurement.diameter}
                    diameterMm={liveMeasurement.diameterMm}
                    size={liveMeasurement.size}
                  />
                )}
              </View>
            </View>
          </View>

          <MeasureInfoModal
            visible={isInfoVisible}
            title={infoTitle}
            description={infoDescription}
            onClose={() => setInfoVisible(false)}
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  )
}

import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowLeft, HandMetal, Info, Torus, X } from 'lucide-react-native'
import { useRef, useState } from 'react'
import {
  Alert,
  Keyboard,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  UIManager,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FingerMeasurePreview } from '@/components/studio/FingerMeasurePreview'
import { MeasurementRuler, RULER_TICK_WIDTH } from '@/components/studio/MeasurementRuler'
import { RingCirclePreview } from '@/components/studio/RingCirclePreview'
import { STUDIO_DIRECT_MEASURE } from '@/constants/staticContent'
import { STUDIO_PHYSICAL_MEASURE_OPTIONS } from '@/constants/studioMeasure'
import { THEME } from '@/constants/theme'
import { mmToLogicalPixels } from '@/utils/physicalScale'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

type MeasureMode = 'finger' | 'ring'

const PREVIEW_AREA_HEIGHT = mmToLogicalPixels(66)

// Gộp chung suggestions dùng cho cả 2 mode
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
    setLiveMeasureIndex(clampedIndex)
    syncRuler(clampedIndex)
  }

  function handleLiveMeasureChange(nextIndex: number) {
    setLiveMeasureIndex(clampMeasureIndex(nextIndex))
  }

  // Thêm popup confirm khi nhấn Save
  function handleSave() {
    if (!canSaveMeasurement) {
      return
    }

    Keyboard.dismiss()

    Alert.alert(
      'Confirm Measurement',
      `Are you sure you want to save "${measurementName.trim()}" as ${liveMeasurement.size}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Save',
          style: 'default',
          onPress: () => {
            // Thêm logic call API hoặc lưu dữ liệu vào store ở đây
            console.log('Saved:', measurementName, liveMeasurement.size, liveMeasurement.diameter)
            // router.back() // Ví dụ: Thoát màn hình sau khi lưu thành công
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
            <View className='mb-3 flex-row items-start justify-between gap-3'>
              <Pressable
                accessibilityRole='button'
                accessibilityLabel='Back'
                onPress={handleBack}
                className='h-10 w-10 items-center justify-center rounded-full border border-ring-primary/10 bg-white/80 shadow-sm shadow-ring-primary/5'
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <ArrowLeft color={THEME.ringPrimary} size={18} strokeWidth={1.8} />
              </Pressable>

              <View className='flex-1 items-center'>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  className='text-center font-serif text-[20px] leading-6 text-ring-primary'
                >
                  {STUDIO_DIRECT_MEASURE.title || 'Size Guidance'}
                </Text>
              </View>

              <View className='flex-row items-center gap-2'>
                <Pressable
                  accessibilityRole='button'
                  accessibilityLabel={modeToggleLabel}
                  onPress={handleToggleMeasureMode}
                  className='h-10 w-10 items-center justify-center rounded-full border border-ring-primary/10 bg-white/80 shadow-sm shadow-ring-primary/5'
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                >
                  {isRingMode ? (
                    <HandMetal color={THEME.ringPrimary} size={18} strokeWidth={1.8} />
                  ) : (
                    <Torus color={THEME.ringPrimary} size={18} strokeWidth={1.8} />
                  )}
                </Pressable>

                <Pressable
                  accessibilityRole='button'
                  accessibilityLabel='Open measuring guide'
                  onPress={() => setInfoVisible(true)}
                  className='h-10 w-10 items-center justify-center rounded-full border border-ring-accent/20 bg-white/80 shadow-sm shadow-ring-accent/10'
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                >
                  <Info color={THEME.ringAccent} size={18} strokeWidth={1.8} />
                </Pressable>
              </View>
            </View>

            <View className='flex-1 justify-between gap-3'>
              <View className='elevation-2 shrink-0 overflow-hidden rounded-[28px] border border-white/70 shadow-lg shadow-ring-primary/10'>
                <LinearGradient
                  colors={['rgba(255,255,255,0.96)', 'rgba(246,249,246,0.92)', 'rgba(250,244,237,0.9)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className='absolute inset-0'
                />
                <View className='absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-ring-accent/10' />
                <View className='absolute bottom-0 left-0 h-20 w-28 rounded-tr-full bg-status-success/10' />

                <View className='gap-3 p-4'>
                  <View className='flex-row items-center justify-between gap-3'>
                    <View className='flex-1'>
                      <Text
                        allowFontScaling={false}
                        className='font-sans-bold text-[9px] uppercase tracking-[0.22em] text-status-success'
                      >
                        Selected Size
                      </Text>
                      <Text
                        allowFontScaling={false}
                        className='mt-1 font-serif text-[28px] leading-8 text-ring-primary'
                      >
                        {liveMeasurement.size}
                      </Text>
                      <Text allowFontScaling={false} className='font-sans text-[11px] text-txt-muted'>
                        {liveMeasurement.diameter} inner diameter
                      </Text>
                    </View>

                    <Pressable
                      accessibilityRole='button'
                      accessibilityLabel='Save measurement'
                      accessibilityState={{ disabled: !canSaveMeasurement }}
                      disabled={!canSaveMeasurement}
                      onPress={handleSave}
                      className={`h-12 flex-row items-center justify-center rounded-full px-8 ${
                        canSaveMeasurement ? 'bg-ring-primary' : 'bg-ring-primary/40'
                      }`}
                      style={({ pressed }) => ({
                        opacity: pressed && canSaveMeasurement ? 0.5 : 1,
                        shadowColor: canSaveMeasurement ? THEME.ringPrimary : 'transparent',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: canSaveMeasurement ? 0.2 : 0,
                        shadowRadius: 3,
                        elevation: canSaveMeasurement ? 2 : 0
                      })}
                    >
                      <Text
                        allowFontScaling={false}
                        className={`font-sans-bold text-[11px] uppercase tracking-wider ${
                          canSaveMeasurement ? 'text-txt-inverse' : 'text-txt-inverse/60'
                        }`}
                      >
                        Save
                      </Text>
                    </Pressable>
                  </View>

                  <View className='h-12 flex-row items-center overflow-hidden rounded-2xl border border-ring-primary/10 bg-white/70'>
                    <TextInput
                      value={measurementName}
                      onChangeText={setMeasurementName}
                      autoCapitalize='sentences'
                      autoCorrect={false}
                      placeholder='Name this measurement'
                      placeholderTextColor={THEME.textMuted}
                      returnKeyType='done'
                      onSubmitEditing={Keyboard.dismiss}
                      className='h-full flex-1 px-4 font-sans text-[14px] text-ring-primary'
                    />

                    {measurementName.length > 0 ? (
                      <Pressable
                        accessibilityRole='button'
                        accessibilityLabel='Clear measurement name'
                        onPress={() => setMeasurementName('')}
                        className='h-full w-11 items-center justify-center bg-ring-primary/5'
                        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                      >
                        <X color={THEME.ringPrimary} size={16} strokeWidth={2} />
                      </Pressable>
                    ) : null}
                  </View>

                  {/* Chuyển sang dạng ScrollView ngang cho pill chung */}
                  <View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 8, paddingRight: 16 }}
                    >
                      {MEASUREMENT_SUGGESTIONS.map((suggestion) => {
                        const isSelected = measurementName === suggestion

                        return (
                          <Pressable
                            key={suggestion}
                            accessibilityRole='button'
                            accessibilityLabel={`Use name ${suggestion}`}
                            onPress={() => setMeasurementName(suggestion)}
                            className={`h-8 items-center justify-center rounded-full border px-3 ${
                              isSelected
                                ? 'border-status-success/30 bg-status-success/10'
                                : 'border-ring-primary/10 bg-white/60'
                            }`}
                            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                          >
                            <Text
                              allowFontScaling={false}
                              className={`font-sans-bold text-[11px] ${
                                isSelected ? 'text-status-success' : 'text-txt-body'
                              }`}
                            >
                              {suggestion}
                            </Text>
                          </Pressable>
                        )
                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>

              <MeasurementRuler
                activeIndex={measureIndex}
                rulerRef={rulerRef}
                onDecrease={() => updateMeasure(measureIndex - 1)}
                onIncrease={() => updateMeasure(measureIndex + 1)}
                liveIndex={liveMeasureIndex}
                onLiveChange={handleLiveMeasureChange}
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

          <Modal visible={isInfoVisible} transparent animationType='fade' onRequestClose={() => setInfoVisible(false)}>
            <View className='flex-1 justify-center bg-ring-secondary/60 px-5'>
              <View className='overflow-hidden rounded-[28px] border border-ring-accent/20 shadow-2xl shadow-ring-secondary/20'>
                <LinearGradient
                  colors={['#FFFFFF', '#F7F5EF', '#EEF3EF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className='absolute inset-0'
                />
                <View className='gap-5 p-5'>
                  <View className='flex-row items-start justify-between gap-4'>
                    <View className='flex-1'>
                      <Text
                        allowFontScaling={false}
                        className='font-sans-bold text-[10px] uppercase tracking-[0.22em] text-ring-accent'
                      >
                        Accuracy Tip
                      </Text>
                      <Text
                        allowFontScaling={false}
                        className='mt-2 font-serif text-[26px] leading-8 text-ring-primary'
                      >
                        {infoTitle}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => setInfoVisible(false)}
                      className='h-10 w-10 items-center justify-center rounded-full bg-ring-background'
                      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                    >
                      <X color={THEME.ringPrimary} size={18} strokeWidth={1.8} />
                    </Pressable>
                  </View>

                  <Text allowFontScaling={false} className='font-sans text-sm leading-6 text-txt-body'>
                    {infoDescription}
                  </Text>

                  <Pressable
                    onPress={() => setInfoVisible(false)}
                    className='h-12 items-center justify-center rounded-full bg-ring-primary'
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                  >
                    <Text
                      allowFontScaling={false}
                      className='font-sans-bold text-xs uppercase tracking-wider text-txt-inverse'
                    >
                      Got it
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  )
}

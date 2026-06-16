import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowLeft, Info, X } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { Keyboard, Modal, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FingerMeasurePreview } from '@/components/studio/FingerMeasurePreview'
import { MeasurementRuler, RULER_TICK_WIDTH } from '@/components/studio/MeasurementRuler'
import { STUDIO_DIRECT_MEASURE } from '@/constants/staticContent'
import { STUDIO_PHYSICAL_MEASURE_OPTIONS } from '@/constants/studioMeasure'
import { THEME } from '@/constants/theme'

function clampMeasureIndex(index: number) {
  return Math.min(Math.max(index, 0), STUDIO_PHYSICAL_MEASURE_OPTIONS.length - 1)
}

const MEASUREMENT_NAME_SUGGESTIONS = ['Ngón trỏ', 'Ngón giữa', 'Ngón áp út']

export function StudioMeasureNowScreen() {
  const router = useRouter()
  const rulerRef = useRef<ScrollView>(null)
  const [measureIndex, setMeasureIndex] = useState(5)
  const [measurementName, setMeasurementName] = useState('')
  const [isInfoVisible, setInfoVisible] = useState(false)

  const measurement = STUDIO_PHYSICAL_MEASURE_OPTIONS[measureIndex]
  const canSaveMeasurement = measurementName.trim().length > 0

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

  function handleSave() {
    if (!canSaveMeasurement) {
      return
    }

    Keyboard.dismiss()
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
              >
                <ArrowLeft color={THEME.ringPrimary} size={18} strokeWidth={1.8} />
              </Pressable>

              <View className='flex-1 items-center'>
                <Text allowFontScaling={false} className='font-serif text-[26px] leading-8 text-ring-primary'>
                  {STUDIO_DIRECT_MEASURE.title || 'Size Guidance'}
                </Text>
                <Text
                  allowFontScaling={false}
                  className='mt-0.5 text-center font-sans text-[11px] leading-4 text-txt-muted'
                >
                  {STUDIO_DIRECT_MEASURE.subtitle}
                </Text>
              </View>

              <Pressable
                accessibilityRole='button'
                accessibilityLabel='Open measuring guide'
                onPress={() => setInfoVisible(true)}
                className='h-10 w-10 items-center justify-center rounded-full border border-ring-accent/20 bg-white/80 shadow-sm shadow-ring-accent/10'
              >
                <Info color={THEME.ringAccent} size={18} strokeWidth={1.8} />
              </Pressable>
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
                        {measurement.size}
                      </Text>
                      <Text allowFontScaling={false} className='font-sans text-[11px] text-txt-muted'>
                        {measurement.diameter} inner diameter
                      </Text>
                    </View>

                    <Pressable
                      accessibilityRole='button'
                      accessibilityLabel='Save measurement'
                      accessibilityState={{ disabled: !canSaveMeasurement }}
                      disabled={!canSaveMeasurement}
                      onPress={handleSave}
                      className={`h-12 flex-row items-center justify-center rounded-full px-8 transition-colors ${
                        canSaveMeasurement ? 'bg-ring-primary active:opacity-80' : 'bg-ring-primary/40'
                      }`}
                      style={
                        canSaveMeasurement
                          ? {
                              shadowColor: THEME.ringPrimary,
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.2,
                              shadowRadius: 3,
                              elevation: 2
                            }
                          : {}
                      }
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
                      placeholder='Đặt tên số đo'
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
                      >
                        <X color={THEME.ringPrimary} size={16} strokeWidth={2} />
                      </Pressable>
                    ) : null}
                  </View>

                  <View className='flex-row flex-wrap gap-2'>
                    {MEASUREMENT_NAME_SUGGESTIONS.map((suggestion) => {
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
                  </View>
                </View>
              </View>

              <MeasurementRuler
                activeIndex={measureIndex}
                rulerRef={rulerRef}
                onDecrease={() => updateMeasure(measureIndex - 1)}
                onIncrease={() => updateMeasure(measureIndex + 1)}
                onSelect={updateMeasure}
              />

              <View pointerEvents='none' className='shrink-0' style={{ flexShrink: 0 }}>
                <FingerMeasurePreview
                  diameter={measurement.diameter}
                  diameterMm={measurement.diameterMm}
                  size={measurement.size}
                />
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
                        {STUDIO_DIRECT_MEASURE.infoTitle}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => setInfoVisible(false)}
                      className='h-10 w-10 items-center justify-center rounded-full bg-ring-background'
                    >
                      <X color={THEME.ringPrimary} size={18} strokeWidth={1.8} />
                    </Pressable>
                  </View>

                  <Text allowFontScaling={false} className='font-sans text-sm leading-6 text-txt-body'>
                    {STUDIO_DIRECT_MEASURE.infoDescription}
                  </Text>

                  <Pressable
                    onPress={() => setInfoVisible(false)}
                    className='h-12 items-center justify-center rounded-full bg-ring-primary'
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

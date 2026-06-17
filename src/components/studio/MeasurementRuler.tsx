import { LinearGradient } from 'expo-linear-gradient'
import { Minus, Plus } from 'lucide-react-native'
import { RefObject, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, View } from 'react-native'

import { STUDIO_PHYSICAL_MEASURE_OPTIONS } from '@/constants/studioMeasure'
import { THEME } from '@/constants/theme'

export const RULER_TICK_WIDTH = 42

type MeasurementRulerProps = {
  activeIndex: number
  liveIndex?: number
  onDecrease: () => void
  onIncrease: () => void
  onLiveChange?: (index: number) => void
  onSelect: (index: number) => void
  rulerRef: RefObject<ScrollView | null>
}

function clampRulerIndex(index: number) {
  return Math.min(Math.max(index, 0), STUDIO_PHYSICAL_MEASURE_OPTIONS.length - 1)
}

export function MeasurementRuler({
  activeIndex,
  liveIndex = activeIndex,
  onDecrease,
  onIncrease,
  onLiveChange,
  onSelect,
  rulerRef
}: MeasurementRulerProps) {
  const [paddingHorizontal, setPaddingHorizontal] = useState(100)
  const visibleIndex = Math.round(clampRulerIndex(liveIndex))

  function getIndexFromScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    return clampRulerIndex(event.nativeEvent.contentOffset.x / RULER_TICK_WIDTH)
  }

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const newIndex = Math.round(getIndexFromScroll(event))

    if (newIndex !== activeIndex) {
      onSelect(newIndex)
      return
    }

    onLiveChange?.(newIndex)
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    onLiveChange?.(getIndexFromScroll(event))
  }

  return (
    <View className='elevation-3 flex-row items-center gap-2 rounded-[36px] border-[0.5px] border-ring-primary/10 bg-ring-surface p-2 shadow-md shadow-ring-primary/5'>
      {/* Nút Giảm (Primary 100% solid, light shadow) */}
      <Pressable
        accessibilityRole='button'
        accessibilityLabel='Decrease finger width'
        onPress={onDecrease}
        className='elevation-1 h-12 w-12 items-center justify-center rounded-full bg-ring-primary shadow-sm shadow-ring-primary/20'
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Minus color={THEME.textInverse} size={18} strokeWidth={1.8} />
      </Pressable>

      {/* Khu vực Thước cuộn */}
      <View
        className='relative h-[52px] flex-1 overflow-hidden'
        onLayout={(e) => {
          const containerWidth = e.nativeEvent.layout.width
          setPaddingHorizontal(containerWidth / 2 - RULER_TICK_WIDTH / 2)
        }}
      >
        {/* Baseline mảnh mai ở đáy thước */}
        <View className='absolute bottom-0 left-0 right-0 h-[1px] bg-ring-primary/10' />

        {/* Kim chỉ thị trung tâm */}
        <View className='absolute inset-y-0 left-1/2 z-10 -ml-[0.75px] w-[1.5px] bg-ring-accent shadow-[0_0_8px_rgba(212,175,55,0.4)]'>
          <View className='absolute -top-[2px] left-1/2 -ml-[3px] h-[6px] w-[6px] rotate-45 bg-ring-accent' />
          <View className='absolute -bottom-[2px] left-1/2 -ml-[3px] h-[6px] w-[6px] rotate-45 bg-ring-accent' />
        </View>

        <ScrollView
          ref={rulerRef}
          horizontal
          bounces={false}
          overScrollMode='never'
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={RULER_TICK_WIDTH}
          decelerationRate='fast'
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          contentOffset={{ x: activeIndex * RULER_TICK_WIDTH, y: 0 }}
          className='h-full'
          contentContainerClassName='items-end'
          contentContainerStyle={{ paddingHorizontal }}
        >
          {STUDIO_PHYSICAL_MEASURE_OPTIONS.map((option, index) => {
            const isActive = index === visibleIndex
            const isMajor = index % 2 === 0

            return (
              <Pressable
                key={option.mm}
                onPress={() => onSelect(index)}
                className='h-full w-[42px] items-center justify-end pb-0'
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <Text
                  allowFontScaling={false}
                  className={`absolute top-[6px] tracking-widest ${
                    isActive
                      ? 'scale-110 font-serif text-[12px] font-bold text-ring-primary'
                      : isMajor
                        ? 'font-sans-medium text-[9px] text-txt-muted/60'
                        : 'opacity-0'
                  }`}
                >
                  {option.mm}
                </Text>

                <View
                  className={`w-[1.5px] rounded-t-sm ${
                    isActive ? 'h-6 bg-ring-accent' : isMajor ? 'h-4 bg-ring-primary/30' : 'h-2 bg-ring-primary/15'
                  }`}
                />
              </Pressable>
            )
          })}
        </ScrollView>

        {/* Gradient mờ 2 bên */}
        <LinearGradient
          colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className='pointer-events-none absolute bottom-0 left-0 top-0 w-8'
        />
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className='pointer-events-none absolute bottom-0 right-0 top-0 w-8'
        />
      </View>

      {/* Nút Tăng (Primary 100% solid, light shadow) */}
      <Pressable
        accessibilityRole='button'
        accessibilityLabel='Increase finger width'
        onPress={onIncrease}
        className='elevation-1 h-12 w-12 items-center justify-center rounded-full bg-ring-primary shadow-sm shadow-ring-primary/20'
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Plus color={THEME.textInverse} size={18} strokeWidth={1.8} />
      </Pressable>
    </View>
  )
}

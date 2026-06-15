import { Minus, Plus } from 'lucide-react-native'
import { RefObject, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, View } from 'react-native'

import { STUDIO_MEASURE_OPTIONS } from '@/constants/staticContent'
import { THEME } from '@/constants/theme'

export const RULER_TICK_WIDTH = 42

type MeasurementRulerProps = {
  activeIndex: number
  onDecrease: () => void // Hàm này ở component cha phải gọi: updateMeasure(measureIndex - 2)
  onIncrease: () => void // Hàm này ở component cha phải gọi: updateMeasure(measureIndex + 2)
  onSelect: (index: number) => void
  rulerRef: RefObject<ScrollView | null>
}

export function MeasurementRuler({
  activeIndex,
  onDecrease,
  onIncrease,
  onSelect, // Sử dụng hàm này để cập nhật khi người dùng cuộn xong
  rulerRef
}: MeasurementRulerProps) {
  const [paddingHorizontal, setPaddingHorizontal] = useState(100)

  // Xử lý khi người dùng VẬT LÝ vuốt và buông tay, ScrollView dừng lại
  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    // Tính toán index gần nhất dựa trên vị trí x hiện tại
    const offset = event.nativeEvent.contentOffset.x
    const newIndex = Math.round(offset / RULER_TICK_WIDTH)

    // Chỉ cập nhật nếu index thực sự thay đổi, tránh re-render thừa
    if (newIndex !== activeIndex) {
      onSelect(newIndex)
    }
  }

  return (
    <View className='elevation-2 flex-row items-center gap-3 rounded-[32px] border-[0.5px] border-ring-accent/30 bg-ring-surface p-2 shadow-sm shadow-black/10'>
      {/* Nút Giảm */}
      <Pressable
        accessibilityRole='button'
        accessibilityLabel='Decrease finger width'
        onPress={onDecrease}
        className='h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-ring-primary/20 bg-ring-background active:opacity-60'
      >
        <Minus color={THEME.ringPrimary} size={18} strokeWidth={1.5} />
      </Pressable>

      {/* Khu vực Thước cuộn */}
      <View
        className='relative h-16 flex-1 overflow-hidden rounded-[20px] bg-ring-background'
        onLayout={(e) => {
          const containerWidth = e.nativeEvent.layout.width
          setPaddingHorizontal(containerWidth / 2 - RULER_TICK_WIDTH / 2)
        }}
      >
        <View className='absolute bottom-0 left-0 right-0 h-[1px] bg-ring-primary/20' />

        <View className='absolute inset-y-0 left-1/2 z-10 -ml-[1px] w-[2px] bg-ring-accent shadow-[0_0_8px_rgba(255,255,255,0.6)]'>
          <View className='absolute -top-[2px] left-1/2 -ml-[4px] h-2 w-2 rotate-45 bg-ring-accent' />
          <View className='absolute -bottom-[2px] left-1/2 -ml-[4px] h-2 w-2 rotate-45 bg-ring-accent' />
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
          // [QUAN TRỌNG] Đổi từ onScroll sang onMomentumScrollEnd
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16} // Giữ lại để ScrollView nội suy mượt hơn dù không dùng onScroll
          // Dùng contentOffset để tự động cuộn khi activeIndex thay đổi từ bên ngoài (qua nút bấm)
          contentOffset={{ x: activeIndex * RULER_TICK_WIDTH, y: 0 }}
          className='h-full'
          contentContainerClassName='items-end'
          contentContainerStyle={{ paddingHorizontal }}
        >
          {STUDIO_MEASURE_OPTIONS.map((option, index) => {
            const isActive = index === activeIndex
            const isMajor = index % 2 === 0

            return (
              <Pressable
                key={option.mm}
                // Nếu bấm trực tiếp vào số, vẫn gọi hàm select thông thường
                onPress={() => onSelect(index)}
                className='h-full w-[42px] items-center justify-end pb-0'
              >
                <Text
                  className={`font-sans-medium absolute top-2 text-[10px] tracking-widest transition-opacity ${
                    isActive ? 'scale-110 font-sans-bold text-ring-accent' : isMajor ? 'text-txt-muted/70' : 'opacity-0'
                  }`}
                >
                  {option.mm}
                </Text>

                <View
                  className={`w-[1.5px] rounded-t-sm transition-all duration-200 ${
                    isActive ? 'h-6 bg-ring-accent' : isMajor ? 'h-4 bg-ring-primary/40' : 'h-2 bg-ring-primary/20'
                  }`}
                />
              </Pressable>
            )
          })}
        </ScrollView>

        <View className='pointer-events-none absolute bottom-0 left-0 top-0 w-6 bg-ring-background/80' />
        <View className='pointer-events-none absolute bottom-0 right-0 top-0 w-6 bg-ring-background/80' />
      </View>

      {/* Nút Tăng */}
      <Pressable
        accessibilityRole='button'
        accessibilityLabel='Increase finger width'
        onPress={onIncrease}
        className='h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-ring-primary/20 bg-ring-background active:opacity-60'
      >
        <Plus color={THEME.ringPrimary} size={18} strokeWidth={1.5} />
      </Pressable>
    </View>
  )
}

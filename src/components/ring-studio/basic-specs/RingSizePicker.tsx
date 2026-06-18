import { STUDIO_PHYSICAL_MEASURE_OPTIONS } from '@/constants/studioMeasure'
import { THEME } from '@/constants/theme'
import { ChevronRight, Minus, Plus, Ruler } from 'lucide-react-native'
import type { RefObject } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'

type RingSizePickerProps = {
  sizeInput: string
  selectedSizeIndex: number
  sizeChipScrollRef: RefObject<ScrollView | null>
  onInputChange: (text: string) => void
  onInputSubmit: () => void
  onSelectSize: (size: string) => void
  onStepSize: (index: number) => void
  onOpenMeasure: () => void
}

export function RingSizePicker({
  sizeInput,
  selectedSizeIndex,
  sizeChipScrollRef,
  onInputChange,
  onInputSubmit,
  onSelectSize,
  onStepSize,
  onOpenMeasure
}: RingSizePickerProps) {
  const selectedSize = STUDIO_PHYSICAL_MEASURE_OPTIONS[selectedSizeIndex]
  const isMinSize = selectedSizeIndex <= 0
  const isMaxSize = selectedSizeIndex === STUDIO_PHYSICAL_MEASURE_OPTIONS.length - 1

  return (
    <View className='gap-4'>
      <Text allowFontScaling={false} className='font-sans-bold text-[10px] uppercase tracking-[0.24em] text-txt-body'>
        Ring Size
      </Text>

      <View className='rounded-[24px] border border-white/70 bg-white/45 p-4'>
        <View className='flex-row items-center justify-between gap-4'>
          <Pressable
            onPress={() => onStepSize(selectedSizeIndex - 1)}
            disabled={isMinSize}
            className={`h-11 w-11 items-center justify-center rounded-full border ${
              isMinSize ? 'border-ring-primary/5 bg-ring-primary/5' : 'border-ring-primary/10 bg-white/70'
            }`}
          >
            <Minus color={isMinSize ? THEME.textMuted : THEME.ringPrimary} size={16} strokeWidth={1.7} />
          </Pressable>

          <View className='flex-1 items-center justify-center'>
            <View className='flex-row items-baseline justify-center'>
              <Text allowFontScaling={false} className='font-serif text-[22px] text-ring-primary'>
                Size
              </Text>

              <TextInput
                value={sizeInput}
                onChangeText={onInputChange}
                onBlur={onInputSubmit}
                onSubmitEditing={onInputSubmit}
                keyboardType='number-pad'
                returnKeyType='done'
                selectTextOnFocus
                maxLength={2}
                allowFontScaling={false}
                className='m-0 ml-1.5 min-w-[28px] p-0 text-left font-serif text-[22px] text-ring-primary'
                style={{ paddingVertical: 0, includeFontPadding: false }}
              />
            </View>

            <Text allowFontScaling={false} className='mt-1 text-center font-sans text-[11px] leading-4 text-txt-muted'>
              {selectedSize.mm} mm cir. / {selectedSize.diameter} dia.
            </Text>
          </View>

          <Pressable
            onPress={() => onStepSize(selectedSizeIndex + 1)}
            disabled={isMaxSize}
            className={`h-11 w-11 items-center justify-center rounded-full border ${
              isMaxSize ? 'border-ring-primary/5 bg-ring-primary/5' : 'border-ring-primary/10 bg-white/70'
            }`}
          >
            <Plus color={isMaxSize ? THEME.textMuted : THEME.ringPrimary} size={16} strokeWidth={1.7} />
          </Pressable>
        </View>

        <ScrollView
          ref={sizeChipScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className='-mx-4 mt-4'
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          keyboardShouldPersistTaps='handled'
        >
          {STUDIO_PHYSICAL_MEASURE_OPTIONS.map((option) => {
            const isActive = option.size === selectedSize.size

            return (
              <Pressable
                key={option.size}
                onPress={() => onSelectSize(option.size)}
                className={`h-9 min-w-[72px] items-center justify-center rounded-full border px-3 ${
                  isActive ? 'border-ring-primary bg-ring-primary' : 'border-white/70 bg-white/50'
                }`}
              >
                <Text
                  allowFontScaling={false}
                  className={`font-sans-bold text-[9px] ${isActive ? 'text-white' : 'text-ring-primary/45'}`}
                >
                  {option.size}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      <Pressable
        onPress={onOpenMeasure}
        className='mt-2 flex-row items-center justify-between border-b border-ring-primary/10 pb-2'
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <View className='flex-row items-center gap-2'>
          <Ruler color={THEME.ringPrimary} size={14} strokeWidth={1.5} />
          <Text allowFontScaling={false} className='font-sans-light text-[13px] text-ring-primary'>
            Do not know your ring size?
          </Text>
        </View>
        <ChevronRight color={THEME.ringPrimary} size={16} strokeWidth={1.5} />
      </Pressable>
    </View>
  )
}

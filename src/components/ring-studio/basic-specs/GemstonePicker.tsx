import { THEME } from '@/constants/theme'
import { Check } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { GEMSTONES } from './basicSpecsConfig'

type GemstonePickerProps = {
  selectedGemstoneId?: string | null
  onSelect: (gemstone: (typeof GEMSTONES)[number]) => void
}

export function GemstonePicker({ selectedGemstoneId, onSelect }: GemstonePickerProps) {
  return (
    <View className='gap-3'>
      <Text
        allowFontScaling={false}
        className='mb-2 font-sans-bold text-[10px] uppercase tracking-[0.24em] text-txt-body'
      >
        Gemstone
      </Text>
      <View className='border-t border-ring-primary/5'>
        {GEMSTONES.map((gemstone) => {
          const isActive = selectedGemstoneId === gemstone.id

          return (
            <Pressable
              key={gemstone.name}
              onPress={() => onSelect(gemstone)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              className='flex-row items-center justify-between border-b border-ring-primary/5 py-4'
            >
              <View className='flex-row items-center gap-4'>
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full border-[0.5px] ${
                    isActive ? 'border-ring-accent/30 bg-ring-accent/10' : 'border-ring-primary/10 bg-ring-background'
                  }`}
                >
                  {isActive ? <View className='h-1.5 w-1.5 rounded-full bg-ring-accent' /> : null}
                </View>
                <View>
                  <Text
                    allowFontScaling={false}
                    className={`font-serif text-[16px] tracking-wide ${
                      isActive ? 'text-ring-primary' : 'text-txt-body'
                    }`}
                  >
                    {gemstone.name}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    className={`mt-0.5 font-sans text-[9px] uppercase tracking-widest ${
                      isActive ? 'text-ring-accent' : 'text-txt-muted'
                    }`}
                  >
                    {gemstone.shape}
                  </Text>
                </View>
              </View>
              {isActive ? <Check size={16} color={THEME.ringAccent} strokeWidth={1.5} /> : null}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

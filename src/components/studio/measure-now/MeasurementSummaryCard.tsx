import { THEME } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { X } from 'lucide-react-native'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'

type MeasurementSummaryCardProps = {
  size: string
  diameter: string
  measurementName: string
  suggestions: string[]
  canSave: boolean
  onNameChange: (name: string) => void
  onClearName: () => void
  onSave: () => void
  onSubmitName: () => void
}

export function MeasurementSummaryCard({
  size,
  diameter,
  measurementName,
  suggestions,
  canSave,
  onNameChange,
  onClearName,
  onSave,
  onSubmitName
}: MeasurementSummaryCardProps) {
  return (
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
            <Text allowFontScaling={false} className='mt-1 font-serif text-[28px] leading-8 text-ring-primary'>
              {size}
            </Text>
            <Text allowFontScaling={false} className='font-sans text-[11px] text-txt-muted'>
              {diameter} inner diameter
            </Text>
          </View>

          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Save measurement'
            accessibilityState={{ disabled: !canSave }}
            disabled={!canSave}
            onPress={onSave}
            className={`h-12 flex-row items-center justify-center rounded-full px-8 ${
              canSave ? 'bg-ring-primary' : 'bg-ring-primary/40'
            }`}
            style={({ pressed }) => ({
              opacity: pressed && canSave ? 0.5 : 1,
              shadowColor: canSave ? THEME.ringPrimary : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: canSave ? 0.2 : 0,
              shadowRadius: 3,
              elevation: canSave ? 2 : 0
            })}
          >
            <Text
              allowFontScaling={false}
              className={`font-sans-bold text-[11px] uppercase tracking-wider ${
                canSave ? 'text-txt-inverse' : 'text-txt-inverse/60'
              }`}
            >
              Save
            </Text>
          </Pressable>
        </View>

        <View className='h-12 flex-row items-center overflow-hidden rounded-2xl border border-ring-primary/10 bg-white/70'>
          <TextInput
            value={measurementName}
            onChangeText={onNameChange}
            autoCapitalize='sentences'
            autoCorrect={false}
            placeholder='Name this measurement'
            placeholderTextColor={THEME.textMuted}
            returnKeyType='done'
            onSubmitEditing={onSubmitName}
            className='h-full flex-1 px-4 font-sans text-[14px] text-ring-primary'
          />

          {measurementName.length > 0 ? (
            <Pressable
              accessibilityRole='button'
              accessibilityLabel='Clear measurement name'
              onPress={onClearName}
              className='h-full w-11 items-center justify-center bg-ring-primary/5'
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <X color={THEME.ringPrimary} size={16} strokeWidth={2} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
        >
          {suggestions.map((suggestion) => {
            const isSelected = measurementName === suggestion

            return (
              <Pressable
                key={suggestion}
                accessibilityRole='button'
                accessibilityLabel={`Use name ${suggestion}`}
                onPress={() => onNameChange(suggestion)}
                className={`h-8 items-center justify-center rounded-full border px-3 ${
                  isSelected ? 'border-status-success/30 bg-status-success/10' : 'border-ring-primary/10 bg-white/60'
                }`}
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <Text
                  allowFontScaling={false}
                  className={`font-sans-bold text-[11px] ${isSelected ? 'text-status-success' : 'text-txt-body'}`}
                >
                  {suggestion}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}

import { THEME } from '@/constants/theme'
import { ArrowLeft, HandMetal, Info, Torus } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

type MeasureModeHeaderProps = {
  title: string
  isRingMode: boolean
  modeToggleLabel: string
  onBack: () => void
  onToggleMode: () => void
  onOpenInfo: () => void
}

export function MeasureModeHeader({
  title,
  isRingMode,
  modeToggleLabel,
  onBack,
  onToggleMode,
  onOpenInfo
}: MeasureModeHeaderProps) {
  return (
    <View className='mb-3 flex-row items-center justify-between gap-3'>
      <Pressable
        accessibilityRole='button'
        accessibilityLabel='Back'
        onPress={onBack}
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
          {title}
        </Text>
      </View>

      <View className='flex-row items-center gap-2'>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel={modeToggleLabel}
          onPress={onToggleMode}
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
          onPress={onOpenInfo}
          className='h-10 w-10 items-center justify-center rounded-full border border-ring-accent/20 bg-white/80 shadow-sm shadow-ring-accent/10'
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Info color={THEME.ringAccent} size={18} strokeWidth={1.8} />
        </Pressable>
      </View>
    </View>
  )
}

import { THEME } from '@/constants/theme'
import { ArrowLeft } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

type StudioHeaderProps = {
  onBack: () => void
  eyebrow?: string
  title?: string
}

export function StudioHeader({ onBack, eyebrow, title }: StudioHeaderProps) {
  return (
    <View className='z-30 flex-row items-center justify-between px-5 pt-2'>
      <Pressable
        onPress={onBack}
        className='h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/75 shadow-sm shadow-ring-primary/10 active:opacity-75'
      >
        <ArrowLeft color={THEME.ringPrimary} size={21} strokeWidth={1.5} />
      </Pressable>

      {eyebrow || title ? (
        <View className='items-center'>
          {eyebrow ? (
            <Text className='font-sans-bold text-[8px] uppercase tracking-[0.34em] text-ring-accent'>{eyebrow}</Text>
          ) : null}
          {title ? <Text className='mt-1 font-serif text-[18px] leading-5 text-ring-primary'>{title}</Text> : null}
        </View>
      ) : (
        <View />
      )}

      <View className='h-11 w-11' />
    </View>
  )
}

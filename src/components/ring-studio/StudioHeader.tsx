import { BackButton } from '@/components/navigation/BackButton'
import { Text, View } from 'react-native'

type StudioHeaderProps = {
  onBack: () => void
  eyebrow?: string
  title?: string
}

export function StudioHeader({ onBack, eyebrow, title }: StudioHeaderProps) {
  return (
    <View className='z-30 flex-row items-center justify-between px-5 pt-2'>
      <BackButton onPress={onBack} className='border-white/70 bg-white/75 shadow-ring-primary/10' />

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

      <View className='h-10 w-10' />
    </View>
  )
}

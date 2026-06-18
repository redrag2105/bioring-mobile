import { THEME } from '@/constants/theme'
import { ArrowLeft } from 'lucide-react-native'
import { Pressable, View } from 'react-native'

type StudioHeaderProps = {
  onBack: () => void
}

export function StudioHeader({ onBack }: StudioHeaderProps) {
  return (
    <View className='z-30 flex-row items-center justify-between px-5 pt-1'>
      <Pressable
        onPress={onBack}
        className='h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/65 shadow-sm shadow-ring-primary/10 active:opacity-75'
      >
        <ArrowLeft color={THEME.ringPrimary} size={18} strokeWidth={1.5} />
      </Pressable>

      <View className='h-9 w-9' />
    </View>
  )
}

import { THEME } from '@/constants/theme'
import { ArrowRight } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

type OrderActionButtonsProps = {
  actions: string[]
}

export function OrderActionButtons({ actions }: OrderActionButtonsProps) {
  return (
    <View className='gap-2.5'>
      {actions.map((action, index) => {
        const primary = index === 0

        return (
          <Pressable
            key={action}
            accessibilityRole='button'
            className={`flex-row items-center justify-center gap-2 rounded-full border px-4 py-3 ${
              primary ? 'border-ring-accent bg-btn-primary' : 'border-ring-primary/15 bg-ring-surface'
            }`}
            style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
          >
            <Text
              className={`font-sans-bold text-[11px] uppercase tracking-[0.16em] ${
                primary ? 'text-btn-primary' : 'text-ring-primary'
              }`}
            >
              {action}
            </Text>
            {primary ? <ArrowRight color={THEME.btnPrimaryText} size={14} strokeWidth={1.8} /> : null}
          </Pressable>
        )
      })}
    </View>
  )
}

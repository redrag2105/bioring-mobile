import { THEME } from '@/constants/theme'
import { ArrowLeft } from 'lucide-react-native'
import { Pressable } from 'react-native'

type BackButtonProps = {
  onPress: () => void
  variant?: 'light' | 'dark'
  className?: string
  accessibilityLabel?: string
}

export function BackButton({
  onPress,
  variant = 'light',
  className = '',
  accessibilityLabel = 'Back'
}: BackButtonProps) {
  const isDark = variant === 'dark'
  const baseClassName = 'items-center justify-center rounded-full active:opacity-70'
  const variantClassName = isDark
    ? 'h-9 w-9 border-[0.5px] border-white/10 bg-white/5'
    : 'h-10 w-10 border border-ring-primary/10 bg-white/80 shadow-sm shadow-ring-primary/5'

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className={`${baseClassName} ${variantClassName} ${className}`}
    >
      <ArrowLeft color={isDark ? THEME.ringSurface : THEME.ringPrimary} size={isDark ? 16 : 18} strokeWidth={1.5} />
    </Pressable>
  )
}

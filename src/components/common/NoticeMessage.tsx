import { THEME } from '@/constants/theme'
import { CircleAlert, Info, ShieldCheck, type LucideIcon } from 'lucide-react-native'
import { Text, View } from 'react-native'

type NoticeVariant = 'info' | 'warning' | 'error'

const NOTICE_STYLES: Record<
  NoticeVariant,
  { container: string; text: string; icon: LucideIcon; iconColor: string }
> = {
  info: {
    container: 'border border-ring-primary/30 bg-white/80',
    text: 'text-ring-primary/80',
    icon: Info,
    iconColor: THEME.ringPrimary
  },
  warning: {
    container: 'border border-ring-accent/60 bg-ring-accent/10',
    text: 'text-ring-primary/90',
    icon: ShieldCheck,
    iconColor: THEME.ringAccent
  },
  error: {
    container: 'border border-status-error/60 bg-status-error/10',
    text: 'text-status-error',
    icon: CircleAlert,
    iconColor: THEME.statusError
  }
}

export function NoticeMessage({
  message,
  variant = 'warning',
  className = ''
}: {
  message: string
  variant?: NoticeVariant
  className?: string
}) {
  const style = NOTICE_STYLES[variant]
  const Icon = style.icon

  return (
    <View className={`flex-row items-start gap-3 rounded-[8px] px-4 py-3.5 ${style.container} ${className}`}>
      <Icon color={style.iconColor} size={16} strokeWidth={1.5} />
      <Text allowFontScaling={false} className={`min-w-0 flex-1 font-sans text-[11px] leading-4 ${style.text}`}>
        {message}
      </Text>
    </View>
  )
}

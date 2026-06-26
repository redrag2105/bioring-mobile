import { ORDER_STATUS_META } from '@/constants/orders'
import { THEME } from '@/constants/theme'
import type { OrderSummary } from '@/types/orders.types'
import { ChevronRight, Clock3, Gem } from 'lucide-react-native'
import { Image, Pressable, Text, View } from 'react-native'

type OrderCardProps = {
  orderSummary: OrderSummary
  onPress: () => void
}

const STATUS_BADGE_CLASSES = {
  DRAFT: { container: 'border-ring-primary/10 bg-btn-disabled', text: 'text-txt-body' },
  PENDING_REVIEW: { container: 'border-ring-primary/15 bg-ring-primary/5', text: 'text-ring-primary' },
  PENDING_DEPOSIT: { container: 'border-ring-accent/20 bg-ring-accent/10', text: 'text-ring-primary' },
  IN_PRODUCTION: { container: 'border-status-success/20 bg-status-success/10', text: 'text-status-success' },
  READY_FOR_DELIVERY: { container: 'border-ring-primary/15 bg-ring-primary/10', text: 'text-ring-primary' },
  SHIPPING: { container: 'border-ring-accent/25 bg-ring-accent/15', text: 'text-ring-primary' },
  READY_FOR_PICKUP: { container: 'border-ring-primary/20 bg-ring-background', text: 'text-ring-primary' },
  COMPLETED: { container: 'border-status-success/25 bg-status-success/15', text: 'text-status-success' }
} as const

export function OrderCard({ orderSummary, onPress }: OrderCardProps) {
  const { order, versions } = orderSummary
  const statusMeta = ORDER_STATUS_META[order.status]
  const version = versions[versions.length - 1]
  const badgeClasses = STATUS_BADGE_CLASSES[order.status]

  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      className='overflow-hidden rounded-[20px] border border-ring-primary/10 bg-ring-surface shadow-tab-bar'
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
    >
      <View className='flex-row gap-3 p-3.5'>
        <View className='h-[92px] w-[92px] items-center justify-center rounded-[18px] bg-btn-disabled'>
          <Image source={{ uri: version.preview_image_url }} className='h-[72px] w-[72px]' resizeMode='contain' />
        </View>

        <View className='flex-1 justify-between py-1'>
          <View>
            <View className='flex-row items-center justify-between gap-2'>
              <Text className='font-sans-bold text-[11px] uppercase tracking-[0.16em] text-ring-accent'>
                {order.order_code}
              </Text>
              <View className={`rounded-full border px-2.5 py-1 ${badgeClasses.container}`}>
                <Text className={`font-sans-bold text-[10px] ${badgeClasses.text}`}>{statusMeta.shortLabel}</Text>
              </View>
            </View>

            <Text className='mt-2 font-serif-semibold text-xl leading-6 text-txt-main'>{version.ring_style}</Text>
            <Text className='mt-1 font-sans text-xs text-txt-muted' numberOfLines={2}>
              {statusMeta.description}
            </Text>
          </View>

          <View className='mt-3 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-3'>
              <View className='flex-row items-center gap-1.5'>
                <Gem color={THEME.textMuted} size={13} strokeWidth={1.6} />
                <Text className='font-sans text-xs text-txt-body'>{order.package_type}</Text>
              </View>
              <View className='flex-row items-center gap-1.5'>
                <Clock3 color={THEME.textMuted} size={13} strokeWidth={1.6} />
                <Text className='font-sans text-xs text-txt-body'>
                  {new Date(order.updated_at).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            </View>
            <ChevronRight color={THEME.ringPrimary} size={17} strokeWidth={1.6} />
          </View>
        </View>
      </View>
    </Pressable>
  )
}

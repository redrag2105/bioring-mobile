import { ORDER_STATUS_FLOW, ORDER_STATUS_META, PICKUP_STATUS_FLOW } from '@/constants/orders'
import type { OrderStatus, OrderSummary } from '@/types/orders.types'
import { Check } from 'lucide-react-native'
import { Text, View } from 'react-native'

type OrderTimelineProps = {
  orderSummary: OrderSummary
}

function getTimelineStatus(flow: OrderStatus[], status: OrderStatus) {
  const currentIndex = flow.indexOf(status)

  return flow.map((step, index) => ({
    step,
    state: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
  }))
}

export function OrderTimeline({ orderSummary }: OrderTimelineProps) {
  const flow =
    orderSummary.delivery_method === 'STORE_PICKUP' || orderSummary.order.status === 'READY_FOR_PICKUP'
      ? PICKUP_STATUS_FLOW
      : ORDER_STATUS_FLOW
  const steps = getTimelineStatus(flow, orderSummary.order.status)

  return (
    <View className='rounded-[20px] border border-ring-primary/15 bg-ring-surface p-4'>
      <Text className='font-sans-bold text-[10px] uppercase tracking-[0.24em] text-ring-accent'>Order timeline</Text>

      <View className='mt-4 gap-0'>
        {steps.map(({ step, state }, index) => {
          const done = state === 'done'
          const current = state === 'current'
          const meta = ORDER_STATUS_META[step]

          return (
            <View key={step} className='flex-row gap-3'>
              <View className='items-center'>
                <View
                  className={`h-7 w-7 items-center justify-center rounded-full border ${
                    done
                      ? 'border-ring-primary bg-ring-primary'
                      : current
                        ? 'border-ring-accent bg-ring-accent'
                        : 'border-ui-border bg-ring-background'
                  }`}
                >
                  {done ? (
                    <Check color='white' size={14} strokeWidth={2} />
                  ) : (
                    <Text className={`font-sans-bold text-[10px] ${current ? 'text-btn-primary' : 'text-txt-muted'}`}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                {index < steps.length - 1 ? (
                  <View className={`h-10 w-[1px] ${done ? 'bg-ring-primary' : 'bg-ui-border'}`} />
                ) : null}
              </View>

              <View className='flex-1 pb-5'>
                <Text className={`font-sans-bold text-sm ${current ? 'text-ring-primary' : 'text-txt-main'}`}>
                  {meta.label}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

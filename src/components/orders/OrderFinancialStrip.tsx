import { PriceText } from '@/components/common/PriceText'
import type { OrderSummary } from '@/types/orders.types'
import { Text, View } from 'react-native'

type OrderFinancialStripProps = {
  orderSummary: OrderSummary
  compact?: boolean
}

export function OrderFinancialStrip({ orderSummary, compact }: OrderFinancialStripProps) {
  const { order, deposit_amount, balance_due } = orderSummary
  const paidPercent = Math.min(Math.round((order.paid_amount / order.total_price) * 100), 100)

  return (
    <View className='gap-3 rounded-[18px] border border-ring-primary/15 bg-ring-surface p-4'>
      <View className='flex-row items-start justify-between gap-3'>
        <View className='flex-1'>
          <Text className='font-sans-bold text-[10px] uppercase tracking-[0.2em] text-ring-accent'>Deposit</Text>
          <PriceText value={deposit_amount} className='mt-1 text-[22px] leading-7 text-txt-main' />
          <Text className='mt-1 font-sans text-xs text-txt-muted'>To start production</Text>
        </View>
        <View className='items-end'>
          <Text className='font-sans text-xs text-txt-muted'>Paid {paidPercent}%</Text>
          <PriceText value={order.paid_amount} className='mt-1 text-[15px] text-status-success' />
        </View>
      </View>

      <View className='h-2 overflow-hidden rounded-full bg-btn-disabled'>
        <View className='h-full rounded-full bg-ring-accent' style={{ width: `${paidPercent}%` }} />
      </View>

      {compact ? null : (
        <View className='flex-row justify-between'>
          <Text className='font-sans text-xs text-txt-muted'>Balance due</Text>
          <PriceText value={balance_due} className='text-sm text-txt-main' />
        </View>
      )}
    </View>
  )
}

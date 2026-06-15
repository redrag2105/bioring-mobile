import { Text, View } from 'react-native'

type FingerMeasurePreviewProps = {
  diameter: string
  fingerWidthClass: string
  size: string
}

export function FingerMeasurePreview({ diameter, fingerWidthClass, size }: FingerMeasurePreviewProps) {
  return (
    <View className='elevation-2 flex-1 justify-end overflow-hidden rounded-[32px] border border-ui-border bg-ring-surface shadow-sm shadow-black/5'>
      {/* Chỉ giữ lại đường trang trí phía trên cùng */}
      <View className='absolute inset-x-6 top-7 h-[1px] bg-ring-accent/20' />

      <View className='absolute left-0 right-0 top-8 items-center'>
        <Text className='font-sans-bold text-[10px] uppercase tracking-[0.22em] text-ring-accent'>Live Width</Text>
        <Text className='mt-2 font-serif text-[30px] leading-9 text-ring-primary'>{size}</Text>
        <Text className='font-sans text-xs text-txt-muted'>{diameter} inner diameter</Text>
      </View>

      <View className='h-[360px] w-full items-center justify-end pb-0'>
        <View
          className={`${fingerWidthClass} h-[286px] items-center rounded-b-[34px] rounded-t-full border border-ring-accent/30 bg-ring-accent/15`}
        >
          {/* Móng tay */}
          <View className='bg-ring-surface/18 mt-4 h-[58px] w-[72%] rounded-full border border-ring-surface/80' />
          <View className='mt-6 h-[1px] w-[86%] bg-ring-accent/35' />
          <View className='mt-3 h-[1px] w-[68%] bg-ring-primary/10' />
        </View>
      </View>
    </View>
  )
}

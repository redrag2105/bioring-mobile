import { Text } from 'react-native'

type PriceTextProps = {
  value: number
  className?: string
  prefix?: string
  prefixClassName?: string
}

function formatPriceNumber(value: number) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value)
}

export function PriceText({ value, className = '', prefix, prefixClassName = 'font-sans' }: PriceTextProps) {
  return (
    <Text allowFontScaling={false} className={className}>
      {prefix ? <Text className={prefixClassName}>{prefix}</Text> : null}
      <Text className='font-serif-semibold'>{formatPriceNumber(value)}</Text>
      <Text className='font-serif'> VND</Text>
    </Text>
  )
}

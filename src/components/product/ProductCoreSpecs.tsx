import type { Gemstone, Material } from '@/types/product.types'
import { Text, View } from 'react-native'

type Props = {
  materials: Material[]
  gemstones: Gemstone[]
}

export function ProductCoreSpecs({ materials, gemstones }: Props) {
  return (
    <View className='mb-6 flex-row justify-between px-1'>
      <View className='flex-1'>
        <Text
          allowFontScaling={false}
          className='mb-1.5 font-sans-bold text-[8px] uppercase tracking-[0.2em] text-txt-muted'
        >
          Forged Base
        </Text>
        {materials.slice(0, 2).map((m) => (
          <Text key={m.id} className='font-serif text-[15px] leading-6 text-ring-primary'>
            {m.name}
          </Text>
        ))}
      </View>
      <View className='mx-4 w-[1px] bg-ring-primary/10' />
      <View className='flex-1'>
        <Text
          allowFontScaling={false}
          className='mb-1.5 font-sans-bold text-[8px] uppercase tracking-[0.2em] text-txt-muted'
        >
          Adornments
        </Text>
        {gemstones.length > 0 ? (
          gemstones.slice(0, 2).map((g) => (
            <Text key={g.id} className='font-serif text-[15px] leading-6 text-ring-primary'>
              {g.type}
            </Text>
          ))
        ) : (
          <Text className='font-serif text-[15px] text-ring-primary'>Pure Core</Text>
        )}
      </View>
    </View>
  )
}

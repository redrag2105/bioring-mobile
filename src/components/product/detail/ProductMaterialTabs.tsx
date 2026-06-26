import { Pressable, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { FONTS, THEME } from '@/constants/theme'

import type { ProductMaterial } from './productDetailTypes'

type Props = {
  materials: ProductMaterial[]
  selectedId: string
  onSelect: (material: ProductMaterial) => void
  animatedStyle: object
}

export function ProductMaterialTabs({ materials, selectedId, onSelect, animatedStyle }: Props) {
  return (
    <Animated.View style={animatedStyle} className='z-20 w-full flex-row justify-center gap-8 pb-4 pt-4'>
      {materials.map((material) => {
        const selected = material.id === selectedId
        return (
          <Pressable key={material.id} onPress={() => onSelect(material)} className='items-center justify-center'>
            <Text
              allowFontScaling={false}
              style={{ fontFamily: FONTS.sans }}
              className={`text-[10px] uppercase tracking-[0.25em] transition-all ${selected ? 'text-white' : 'text-white/30'}`}
            >
              {material.displayName}
            </Text>
            <View
              style={{ backgroundColor: selected ? THEME.ringAccent : 'transparent' }}
              className='mt-2 h-[2px] w-full rounded-full transition-all duration-300'
            />
          </Pressable>
        )
      })}
    </Animated.View>
  )
}

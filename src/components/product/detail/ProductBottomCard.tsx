import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { FONTS, THEME } from '@/constants/theme'
import type { ProductDetailResponse } from '@/types/product.types'

import type { ProductMaterial } from './productDetailTypes'

function SpecColumn({ value, label }: { value: string; label: string }) {
  return (
    <View className='items-center justify-center'>
      <Text
        allowFontScaling={false}
        numberOfLines={1}
        style={{ fontFamily: FONTS.serif }}
        className='text-[16px] text-white/90'
      >
        {value}
      </Text>
      <Text
        allowFontScaling={false}
        style={{ fontFamily: FONTS.sans }}
        className='mt-2 text-[8px] uppercase tracking-[0.2em] text-white/40'
      >
        {label}
      </Text>
    </View>
  )
}

type Props = {
  product: ProductDetailResponse
  material: ProductMaterial
  animatedStyle: object
  onDesign: () => void
  bottomInset: number
}

export function ProductBottomCard({ product, material, animatedStyle, onDesign, bottomInset }: Props) {
  const sizes = product.supported_sizes || []
  const sizeText = sizes.length > 0 ? (sizes[Math.min(2, sizes.length - 1)] ?? 'Custom') : 'Custom'
  const gemstoneText = product.available_gemstones?.[0]?.type || 'Diamond'

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          bottom: Math.max(bottomInset + 16, 28),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 24 },
          shadowOpacity: 0.8,
          shadowRadius: 36,
          elevation: 24
        }
      ]}
      className='absolute left-4 right-4 z-20'
    >
      <View
        style={{ backgroundColor: `${THEME.ringSecondary}E6`, borderColor: `${THEME.ringAccent}35` }}
        className='overflow-hidden rounded-[32px] border-[0.5px] p-6 backdrop-blur-md'
      >
        <LinearGradient
          colors={[`${THEME.ringAccent}1A`, 'rgba(255,255,255,0)']}
          className='absolute inset-x-0 top-0 h-24'
        />

        <View className='items-center'>
          <Text
            allowFontScaling={false}
            style={{ fontFamily: FONTS.serif }}
            className='mt-1 text-[24px] tracking-wide text-white'
          >
            {product.name}
          </Text>
          <Text
            allowFontScaling={false}
            style={{ color: THEME.ringAccent, fontFamily: FONTS.sans }}
            className='mt-2 text-[12px] tracking-wider'
          >
            ${product.base_price} USD
          </Text>
        </View>

        <View className='mt-8 flex-row justify-around border-y-[0.5px] border-white/5 px-2 py-4'>
          <SpecColumn value={sizeText.toString()} label='Size' />
          <View className='h-full w-[1px] bg-white/5' />
          <SpecColumn value={material.purity} label='Purity' />
          <View className='h-full w-[1px] bg-white/5' />
          <SpecColumn value={gemstoneText} label='Stone' />
        </View>

        <Pressable
          onPress={onDesign}
          style={{
            backgroundColor: THEME.btnPrimaryBg,
            shadowColor: THEME.btnPrimaryBg,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8
          }}
          className='mt-8 min-h-[52px] w-full items-center justify-center rounded-full active:opacity-80'
        >
          <Text
            allowFontScaling={false}
            style={{ color: THEME.btnPrimaryText, fontFamily: FONTS.sansBold }}
            className='text-[11px] uppercase tracking-[0.25em]'
          >
            Personalize
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  )
}

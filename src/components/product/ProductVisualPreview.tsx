import { THEME } from '@/constants/theme'
import React from 'react'
import { Image, View } from 'react-native'
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg'

export function ProductVisualPreview({ imageUrl }: { imageUrl: string }) {
  return (
    <View className='relative mb-6 aspect-[4/4.5] w-full overflow-hidden rounded-[16px] border border-ring-primary/10 bg-[#F6F4EF]'>
      <View className='pointer-events-none absolute inset-0 opacity-10'>
        <Svg width='100%' height='100%'>
          <Defs>
            <Pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
              <Path d='M 20 0 L 0 0 0 20' fill='none' stroke={THEME.ringPrimary} strokeWidth='1' />
            </Pattern>
          </Defs>
          <Rect width='100%' height='100%' fill='url(#grid)' />
        </Svg>
      </View>
      <Image source={{ uri: imageUrl }} className='h-full w-full' resizeMode='cover' />
    </View>
  )
}

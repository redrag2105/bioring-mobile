import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'

import { THEME } from '@/constants/theme'

export const DEEP_NAVY = '#081720'
export const BACKGROUND_COLORS = [DEEP_NAVY, '#0B1D28', THEME.ringSecondary, DEEP_NAVY] as const

export function ProductDetailBackground() {
  return (
    <>
      <LinearGradient colors={BACKGROUND_COLORS} className='absolute inset-0' />
      <View pointerEvents='none' className='absolute inset-0 z-0'>
        <LinearGradient
          colors={['rgba(182, 155, 122, 0.08)', 'rgba(8, 23, 32, 0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          className='absolute inset-0'
        />
        <LinearGradient
          colors={['rgba(8, 23, 32, 0)', 'rgba(8, 23, 32, 0.95)', DEEP_NAVY]}
          className='absolute bottom-0 left-0 right-0 h-[400px]'
        />
      </View>
    </>
  )
}

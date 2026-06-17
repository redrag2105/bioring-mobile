import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Defs, Mask, Rect } from 'react-native-svg'

import { SkeletonBlock } from '@/components/skeleton/SkeletonBlock'
import { THEME } from '@/constants/theme'

const CORNER_RADIUS = 24
const NOTCH_RADIUS = 16

export function ProductDetailSkeleton() {
  const insets = useSafeAreaInsets()
  const dividerY = 400 // Fixed approximate Y coordinate for the skeleton notch

  return (
    <View className='flex-1 bg-[#FDFDFB]'>
      <LinearGradient colors={['#FDFDFB', '#F4F2EB', '#E9E4D8']} locations={[0, 0.6, 1]} className='absolute inset-0' />

      <View className='flex-1' style={{ paddingTop: insets.top }}>
        {/* Header Skeleton */}
        <View className='z-50 flex-row items-center justify-between px-5 pb-4 pt-2'>
          <SkeletonBlock className='h-11 w-11 rounded-full' />
          <SkeletonBlock className='h-3 w-24 rounded-full' />
          <View className='w-11' />
        </View>

        <View className='px-5 pb-8 pt-10'>
          <View className='relative w-full pb-8 shadow-lg shadow-black/5'>
            {/* SVG Ticket Mask for Skeleton */}
            <View className='pointer-events-none absolute inset-0 z-0'>
              <Svg width='100%' height='100%'>
                <Defs>
                  <Mask id='skeletonTicketMask'>
                    <Rect width='100%' height='100%' rx={CORNER_RADIUS} fill='white' />
                    <Circle cx='0' cy={dividerY} r={NOTCH_RADIUS} fill='black' />
                    <Circle cx='100%' cy={dividerY} r={NOTCH_RADIUS} fill='black' />
                  </Mask>
                </Defs>
                <Rect width='100%' height='100%' rx={CORNER_RADIUS} fill='#FFFFFF' mask='url(#skeletonTicketMask)' />
                <Rect
                  width='100%'
                  height='100%'
                  rx={CORNER_RADIUS}
                  fill='none'
                  stroke={THEME.ringPrimary}
                  strokeOpacity='0.1'
                  strokeWidth='1.5'
                  mask='url(#skeletonTicketMask)'
                />
              </Svg>
            </View>

            {/* Content Skeleton */}
            <View className='relative z-10 p-5'>
              <SkeletonBlock className='mb-6 aspect-[4/4.5] w-full rounded-[16px]' />
              <View className='items-center'>
                <SkeletonBlock className='mb-3 h-2 w-32 rounded-full' />
                <SkeletonBlock className='mb-4 h-8 w-3/4 rounded-full' />
                <SkeletonBlock className='mb-2 h-3 w-5/6 rounded-full' />
                <SkeletonBlock className='h-3 w-4/6 rounded-full' />
              </View>
            </View>

            <View className='relative z-10 px-5 pt-12'>
              <View className='mb-6 flex-row justify-between px-1'>
                <View className='flex-1'>
                  <SkeletonBlock className='mb-3 h-2 w-16 rounded-full' />
                  <SkeletonBlock className='mb-2 h-4 w-24 rounded-full' />
                  <SkeletonBlock className='h-4 w-20 rounded-full' />
                </View>
                <View className='mx-4 w-[1px] bg-ring-primary/5' />
                <View className='flex-1'>
                  <SkeletonBlock className='mb-3 h-2 w-16 rounded-full' />
                  <SkeletonBlock className='mb-2 h-4 w-24 rounded-full' />
                </View>
              </View>

              {/* Biometrics Block Skeleton */}
              <SkeletonBlock className='h-[100px] w-full rounded-[16px]' />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

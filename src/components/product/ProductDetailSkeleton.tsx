import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Defs, Ellipse, RadialGradient, Rect, Stop } from 'react-native-svg'

const BACKGROUND_COLORS = ['#111821', '#17222D', '#0D1219'] as const

function DarkSkeletonBlock({ className = '' }: { className?: string }) {
  return <View className={`rounded-2xl border border-white/10 bg-white/[0.075] ${className}`} />
}

function SkeletonSpotlight() {
  return (
    <View pointerEvents='none' className='absolute left-0 right-0 top-[18%] h-[330px] items-center'>
      <Svg width='105%' height='100%' viewBox='0 0 420 330'>
        <Defs>
          <RadialGradient id='skeletonRingSpotlight' cx='50%' cy='46%' rx='50%' ry='30%'>
            <Stop offset='0%' stopColor='#F8E6B3' stopOpacity='0.22' />
            <Stop offset='48%' stopColor='#7BA9C4' stopOpacity='0.08' />
            <Stop offset='100%' stopColor='#101821' stopOpacity='0' />
          </RadialGradient>
        </Defs>
        <Rect width='420' height='330' fill='transparent' />
        <Ellipse cx='210' cy='164' rx='190' ry='86' fill='url(#skeletonRingSpotlight)' />
      </Svg>
    </View>
  )
}

export function ProductDetailSkeleton() {
  const insets = useSafeAreaInsets()

  return (
    <View className='flex-1 bg-[#111821]'>
      <LinearGradient colors={BACKGROUND_COLORS} locations={[0, 0.56, 1]} className='absolute inset-0' />
      <SkeletonSpotlight />

      <View className='flex-1' style={{ paddingTop: insets.top }}>
        <View className='z-30 flex-row items-center justify-between px-5 pb-3 pt-2'>
          <DarkSkeletonBlock className='h-11 w-11 rounded-full' />
          <View className='items-center'>
            <DarkSkeletonBlock className='h-4 w-28 rounded-full' />
            <DarkSkeletonBlock className='mt-2 h-2 w-24 rounded-full opacity-60' />
          </View>
          <DarkSkeletonBlock className='h-11 w-11 rounded-full' />
        </View>

        <View className='z-20 px-5'>
          <View className='flex-row gap-2 rounded-full border border-white/10 bg-white/5 p-1'>
            <DarkSkeletonBlock className='h-10 flex-1 rounded-full' />
            <DarkSkeletonBlock className='h-10 flex-1 rounded-full opacity-60' />
            <DarkSkeletonBlock className='h-10 flex-1 rounded-full opacity-60' />
          </View>
        </View>

        <View className='relative z-10 h-[47%] items-center justify-center'>
          <View className='h-44 w-44 rounded-full border border-white/10 bg-white/[0.045]' />
          <DarkSkeletonBlock className='absolute bottom-6 h-11 w-36 rounded-full' />
        </View>
      </View>

      <View className='absolute bottom-0 left-0 right-0 z-20 px-5' style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 18 }}>
        <View className='rounded-t-[28px] border border-white/10 bg-[#17222D]/94 px-5 pb-5 pt-6'>
          <View className='flex-row items-start justify-between gap-5'>
            <View className='flex-1'>
              <DarkSkeletonBlock className='h-7 w-44 rounded-full' />
              <DarkSkeletonBlock className='mt-4 h-3 w-full rounded-full opacity-70' />
              <DarkSkeletonBlock className='mt-2 h-3 w-4/5 rounded-full opacity-70' />
            </View>
            <DarkSkeletonBlock className='h-6 w-24 rounded-full' />
          </View>

          <View className='mt-5 rounded-2xl border border-white/10 bg-white/[0.055] p-4'>
            <View className='flex-row gap-3'>
              <View className='flex-1'>
                <DarkSkeletonBlock className='h-2 w-12 rounded-full opacity-60' />
                <DarkSkeletonBlock className='mt-3 h-4 w-16 rounded-full' />
              </View>
              <View className='flex-1'>
                <DarkSkeletonBlock className='h-2 w-16 rounded-full opacity-60' />
                <DarkSkeletonBlock className='mt-3 h-4 w-20 rounded-full' />
              </View>
              <View className='flex-1'>
                <DarkSkeletonBlock className='h-2 w-14 rounded-full opacity-60' />
                <DarkSkeletonBlock className='mt-3 h-4 w-24 rounded-full' />
              </View>
            </View>
            <View className='mt-4 h-px bg-white/10' />
            <View className='mt-4 flex-row items-center justify-between'>
              <DarkSkeletonBlock className='h-3 w-20 rounded-full opacity-60' />
              <DarkSkeletonBlock className='h-3 w-28 rounded-full' />
            </View>
          </View>

          <DarkSkeletonBlock className='mt-5 h-14 rounded-full bg-[#D8B15F]/50' />
        </View>
      </View>
    </View>
  )
}

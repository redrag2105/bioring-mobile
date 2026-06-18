import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, ArrowRight } from 'lucide-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Defs, Line, Mask, Rect } from 'react-native-svg'

import { THEME } from '@/constants/theme'
import { useProductDetailQuery } from '@/hooks/queries/useProductQuery'
import { formatPrice } from '@/utils/formatPrice'

// Extracted Components
import { ProductBiometrics } from '@/components/product/ProductBiometrics'
import { ProductCoreSpecs } from '@/components/product/ProductCoreSpecs'
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton'
import { ProductVisualPreview } from '@/components/product/ProductVisualPreview'

const CORNER_RADIUS = 24
const NOTCH_RADIUS = 16
const ENTRY_DURATION = 700
const RING_OUTLINE_WATERMARK = require('@/assets/images/collections/ring_outline.png')
const cinematicEase = Easing.out(Easing.cubic)

export default function ProductDetailScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ productId?: string }>()

  const { data: product, isLoading, isError } = useProductDetailQuery(params.productId)

  const [dividerY, setDividerY] = useState(0)

  // Shared Values (Scan line removed)
  const headerEntry = useSharedValue(0)
  const ticketEntry = useSharedValue(0)
  const footerEntry = useSharedValue(0)
  const idleFloat = useSharedValue(0)
  const rotation = useSharedValue(0)

  useEffect(() => {
    if (isLoading || isError) return

    headerEntry.value = withTiming(1, { duration: ENTRY_DURATION, easing: cinematicEase })
    ticketEntry.value = withDelay(150, withTiming(1, { duration: ENTRY_DURATION, easing: cinematicEase }))
    footerEntry.value = withDelay(300, withTiming(1, { duration: ENTRY_DURATION, easing: cinematicEase }))

    idleFloat.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true)
    rotation.value = withRepeat(withTiming(360, { duration: 60000, easing: Easing.linear }), -1, false)
  }, [isLoading, isError, headerEntry, ticketEntry, footerEntry, idleFloat, rotation])

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/collections' as never)
  }, [router])

  const handleStartDesign = () => {
    router.push({
      pathname: '/(screens)/ring-studio',
      params: { templateId: product?.id }
    })
  }

  // Animated Styles
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerEntry.value,
    transform: [{ translateY: interpolate(headerEntry.value, [0, 1], [-20, 0]) }]
  }))

  const ticketStyle = useAnimatedStyle(() => {
    const floatY = interpolate(idleFloat.value, [0, 1], [0, -4])
    const entryY = interpolate(ticketEntry.value, [0, 1], [40, 0])
    return {
      opacity: ticketEntry.value,
      transform: [{ translateY: entryY + floatY }],
      shadowOpacity: interpolate(idleFloat.value, [0, 1], [0.1, 0.18]),
      shadowRadius: interpolate(idleFloat.value, [0, 1], [15, 25]),
      shadowOffset: { width: 0, height: interpolate(idleFloat.value, [0, 1], [8, 16]) }
    }
  })

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerEntry.value,
    transform: [{ translateY: interpolate(footerEntry.value, [0, 1], [20, 0]) }]
  }))

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }))

  if (isLoading) return <ProductDetailSkeleton />
  if (isError || !product) return null

  return (
    <View className='flex-1 bg-[#FDFDFB]'>
      <LinearGradient colors={['#FDFDFB', '#F4F2EB', '#E9E4D8']} locations={[0, 0.6, 1]} className='absolute inset-0' />

      <Animated.View
        pointerEvents='none'
        className='absolute inset-0 z-0 items-center justify-center opacity-[0.03]'
        style={animatedRingStyle}
      >
        <Image
          source={RING_OUTLINE_WATERMARK}
          resizeMode='contain'
          className='h-[850px] w-[850px]'
          style={{ tintColor: THEME.ringPrimary }}
        />
      </Animated.View>

      <SafeAreaView className='flex-1' edges={['top']}>
        {/* --- HEADER --- */}
        <Animated.View style={headerStyle} className='z-50 flex-row items-center justify-between px-5 pb-4 pt-2'>
          <Pressable
            onPress={handleBack}
            className='elevation-2 h-11 w-11 items-center justify-center rounded-full border-[0.5px] border-ring-primary/10 bg-white/70 shadow-sm shadow-black/5 backdrop-blur-md active:opacity-70'
          >
            <ArrowLeft color={THEME.ringPrimary} size={22} strokeWidth={1.5} />
          </Pressable>
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.3em] text-ring-primary/70'>
            Archival Spec
          </Text>
          <View className='w-11' />
        </Animated.View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 120, paddingHorizontal: 20, paddingTop: 10 }}
          className='z-10'
        >
          {/* --- THE SVG SPEC TICKET --- */}
          <Animated.View style={[{ shadowColor: THEME.ringPrimary }, ticketStyle]} className='relative w-full pb-8'>
            <View className='pointer-events-none absolute inset-0 z-0'>
              <Svg width='100%' height='100%'>
                <Defs>
                  <Mask id='specTicketMask'>
                    <Rect width='100%' height='100%' rx={CORNER_RADIUS} fill='white' />
                    {dividerY > 0 ? (
                      <>
                        <Circle cx='0' cy={dividerY} r={NOTCH_RADIUS} fill='black' />
                        <Circle cx='100%' cy={dividerY} r={NOTCH_RADIUS} fill='black' />
                      </>
                    ) : null}
                  </Mask>
                </Defs>
                <Rect width='100%' height='100%' rx={CORNER_RADIUS} fill='#FFFFFF' mask='url(#specTicketMask)' />
                <Rect
                  width='100%'
                  height='100%'
                  rx={CORNER_RADIUS}
                  fill='none'
                  stroke={THEME.ringPrimary}
                  strokeOpacity='0.15'
                  strokeWidth='1.5'
                  mask='url(#specTicketMask)'
                />
              </Svg>
            </View>

            {/* Top Half: Product Visual & Info */}
            <View className='relative z-10 p-5'>
              <ProductVisualPreview imageUrl={product.thumbnail_url} />

              <View className='items-center'>
                <Text
                  allowFontScaling={false}
                  className='font-sans-medium mb-2 text-[9px] uppercase tracking-[0.3em] text-ring-accent'
                >
                  Architecture Model
                </Text>
                <Text
                  allowFontScaling={false}
                  className='mb-3 text-center font-serif text-[32px] leading-9 text-ring-primary'
                >
                  {product.name}
                </Text>
                <Text
                  allowFontScaling={false}
                  className='px-2 text-center font-sans text-[13px] leading-5 text-txt-muted'
                >
                  {product.description}
                </Text>
              </View>
            </View>

            {/* Divider Line (Captures Y coordinate for SVG Mask) */}
            <View
              onLayout={(e) => setDividerY(e.nativeEvent.layout.y + 12)}
              className='relative z-10 my-1 h-6 w-full justify-center px-6'
            >
              <View className='opacity-20'>
                <Svg height='2' width='100%'>
                  <Line
                    x1='0'
                    y1='0'
                    x2='100%'
                    y2='0'
                    stroke={THEME.ringPrimary}
                    strokeWidth='2'
                    strokeDasharray='6 6'
                  />
                </Svg>
              </View>
            </View>

            {/* Bottom Half: Tech Specs & Components */}
            <View className='relative z-10 px-5 pt-2'>
              <ProductCoreSpecs materials={product.available_materials} gemstones={product.available_gemstones} />
              <ProductBiometrics supportedBiometrics={product.supported_biometrics} />
              <View className='mt-8 flex-row justify-center gap-[3px] opacity-40'>
                {[...Array(24)].map((_, i) => (
                  <View
                    key={i}
                    className={`h-8 bg-ring-primary ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-[1.5px]'}`}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </SafeAreaView>

      {/* --- FOOTER --- */}
      <Animated.View
        className='absolute bottom-0 left-0 right-0 border-t border-ring-primary/10 bg-[#FDFDFB]/95 px-6 pt-5 backdrop-blur-xl'
        style={[footerStyle, { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 24 }]}
      >
        <View className='mb-4 flex-row items-center justify-between px-2'>
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.25em] text-txt-muted'>Base Investment</Text>
          <Text className='font-sans-medium text-[16px] text-ring-primary'>{formatPrice(product.base_price)}</Text>
        </View>

        <Pressable
          onPress={handleStartDesign}
          className='w-full flex-row items-center justify-between rounded-full bg-ring-primary px-7 py-4 shadow-lg shadow-ring-primary/25'
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <Text className='font-sans-bold text-[11px] uppercase tracking-[0.25em] text-white'>Load into Studio</Text>
          <ArrowRight color='#FFFFFF' size={16} strokeWidth={1.5} />
        </Pressable>
      </Animated.View>
    </View>
  )
}

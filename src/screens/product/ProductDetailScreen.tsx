import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import { Gesture } from 'react-native-gesture-handler'
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Cinematic360Overlay, Close360Button, Open360Button } from '@/components/product/detail/Product360Controls'
import { ProductBottomCard } from '@/components/product/detail/ProductBottomCard'
import { DEEP_NAVY, ProductDetailBackground } from '@/components/product/detail/ProductDetailBackground'
import { ProductDetailHeader } from '@/components/product/detail/ProductDetailHeader'
import { ProductMaterialTabs } from '@/components/product/detail/ProductMaterialTabs'
import { ProductRingStage } from '@/components/product/detail/ProductRingStage'
import { MATERIAL_FALLBACKS, toMaterialOption } from '@/components/product/detail/productDetailMaterial'
import type { ProductMaterial } from '@/components/product/detail/productDetailTypes'
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton'
import { useProductDetailQuery } from '@/hooks/queries/useProductQuery'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'

export default function ProductDetailScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ productId?: string }>()
  const startProductDesign = useRingDesignStore((state) => state.startProductDesign)
  const { data: product, isLoading, isError } = useProductDetailQuery(params.productId)

  const [is360Mode, setIs360Mode] = useState(false)
  const modeProgress = useSharedValue(0)
  const introFlash = useSharedValue(0)

  const spinAction = useSharedValue(0)
  const flyScaleMult = useSharedValue(1)

  const materials = useMemo(() => {
    const mapped = product?.available_materials?.map(toMaterialOption) ?? []
    return mapped.length ? mapped : MATERIAL_FALLBACKS
  }, [product?.available_materials])

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>()

  useEffect(() => {
    if (!selectedMaterialId && materials[0]) setSelectedMaterialId(materials[0].id)
  }, [materials, selectedMaterialId])

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId) ?? materials[0]

  useEffect(() => {
    if (is360Mode) {
      modeProgress.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 1, 0.5, 1) })

      introFlash.value = withSequence(
        withTiming(2.5, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0, { duration: 700 })
      )

      spinAction.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(Math.PI * 2, { duration: 1200, easing: Easing.bezier(0.2, 0.8, 0.2, 1) })
      )

      flyScaleMult.value = withSequence(
        withTiming(0.01, { duration: 300, easing: Easing.in(Easing.poly(3)) }),
        withTiming(0.01, { duration: 50 }),
        withTiming(1, { duration: 900, easing: Easing.elastic(1.1) })
      )
    } else {
      modeProgress.value = withTiming(0, { duration: 800, easing: Easing.bezier(0.25, 1, 0.5, 1) })
      introFlash.value = withTiming(0, { duration: 300 })
      spinAction.value = withTiming(0, { duration: 600, easing: Easing.bezier(0.33, 1, 0.68, 1) })

      flyScaleMult.value = withSequence(
        withTiming(0.01, { duration: 300, easing: Easing.in(Easing.poly(3)) }),
        withTiming(0.01, { duration: 50 }),
        withTiming(1, { duration: 900, easing: Easing.elastic(1.1) })
      )
    }
  }, [is360Mode, modeProgress, introFlash, spinAction, flyScaleMult])

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/collections' as never)
  }, [router])

  const handleStartDesign = useCallback(() => {
    startProductDesign(product?.id)
    router.push({ pathname: '/(screens)/ring-studio', params: { productId: product?.id, initialStep: 'basic' } })
  }, [product?.id, router, startProductDesign])

  const manualRotation = useSharedValue(0)
  const rotationOffset = useSharedValue(0)
  const zoom = useSharedValue(0)
  const zoomOffset = useSharedValue(0)

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(modeProgress.value, [0, 0.5, 1], [1, 0, 0]),
    transform: [{ translateY: interpolate(modeProgress.value, [0, 1], [0, -20]) }]
  }))
  const tabsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(modeProgress.value, [0, 0.5, 1], [1, 0, 0]),
    transform: [{ translateY: interpolate(modeProgress.value, [0, 1], [0, -20]) }]
  }))
  const bottomStyle = useAnimatedStyle(() => ({
    opacity: interpolate(modeProgress.value, [0, 0.4, 1], [1, 0, 0]),
    transform: [{ translateY: interpolate(modeProgress.value, [0, 1], [0, 100]) }]
  }))

  const playButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(modeProgress.value, [0, 0.65, 1], [1, 0, 0]),
    transform: [{ scale: interpolate(modeProgress.value, [0, 1], [1, 0.8]) }]
  }))

  const closeButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(modeProgress.value, [0.7, 1], [0, 1]),
    transform: [{ scale: interpolate(modeProgress.value, [0, 1], [0.8, 1]) }]
  }))

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      manualRotation.value = rotationOffset.value + e.translationX / 100
    })
    .onEnd(() => {
      rotationOffset.value = manualRotation.value
    })

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      zoom.value = Math.min(Math.max(zoomOffset.value + (e.scale - 1), -0.2), 1)
    })
    .onEnd(() => {
      zoom.value = withTiming(0)
      zoomOffset.value = 0
    })

  if (isLoading) return <ProductDetailSkeleton />
  if (isError || !product || !selectedMaterial) return null

  return (
    <View style={{ backgroundColor: DEEP_NAVY }} className='flex-1'>
      <ProductDetailBackground />

      <ProductRingStage
        gesture={Gesture.Simultaneous(pan, pinch)}
        material={selectedMaterial}
        manualRotation={manualRotation}
        zoom={zoom}
        modeProgress={modeProgress}
        introFlash={introFlash}
        spinAction={spinAction}
        flyScaleMult={flyScaleMult}
      />

      {is360Mode && <Cinematic360Overlay modeProgress={modeProgress} />}

      <SafeAreaView className='z-20 flex-1' edges={['top']} pointerEvents='box-none'>
        <View style={{ paddingTop: Math.max(insets.top ? 0 : 8, 0) }} pointerEvents='box-none'>
          <ProductDetailHeader onBack={handleBack} animatedStyle={headerStyle} />
          <ProductMaterialTabs
            materials={materials}
            selectedId={selectedMaterial.id}
            onSelect={(m: ProductMaterial) => setSelectedMaterialId(m.id)}
            animatedStyle={tabsStyle}
          />
        </View>

        <Open360Button is360Mode={is360Mode} animatedStyle={playButtonStyle} onPress={() => setIs360Mode(true)} />
        <Close360Button
          visible={is360Mode}
          animatedStyle={closeButtonStyle}
          topInset={insets.top}
          onPress={() => setIs360Mode(false)}
        />
      </SafeAreaView>

      <ProductBottomCard
        product={product}
        material={selectedMaterial}
        animatedStyle={bottomStyle}
        onDesign={handleStartDesign}
        bottomInset={insets.bottom}
      />
    </View>
  )
}

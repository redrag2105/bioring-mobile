import { STUDIO_PHYSICAL_MEASURE_OPTIONS } from '@/constants/studioMeasure'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { useFocusEffect } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, ScrollView, Text, View } from 'react-native'
import { GemstonePicker } from './basic-specs/GemstonePicker'
import { MaterialPicker } from './basic-specs/MaterialPicker'
import { RingSizePicker } from './basic-specs/RingSizePicker'
import { SIZE_CHIP_STEP } from './basic-specs/basicSpecsConfig'
import { findSizeOptionByNumber, getSizeNumber } from './basic-specs/sizeUtils'

export function BasicSpecsPanel() {
  const router = useRouter()
  const sizeChipScrollRef = useRef<ScrollView>(null)
  const selectedMaterialId = useRingDesignStore((state) => state.selected_material_id)
  const selectedGemstoneId = useRingDesignStore((state) => state.selected_gemstone_id)
  const ringSize = useRingDesignStore((state) => state.ring_size)
  const setBasicSpec = useRingDesignStore((state) => state.setBasicSpec)
  const [sizeInput, setSizeInput] = useState(getSizeNumber(ringSize) || '6')

  useEffect(() => {
    if (ringSize) setSizeInput(getSizeNumber(ringSize))
  }, [ringSize])

  useFocusEffect(
    useCallback(() => {
      const savedSize = useRingDesignStore.getState().ring_size
      if (savedSize) setSizeInput(getSizeNumber(savedSize))
    }, [])
  )

  const selectedSizeIndex = useMemo(() => {
    const index = STUDIO_PHYSICAL_MEASURE_OPTIONS.findIndex((option) => option.size === ringSize)
    return index >= 0 ? index : 2
  }, [ringSize])

  useEffect(() => {
    requestAnimationFrame(() => {
      sizeChipScrollRef.current?.scrollTo({
        x: Math.max(selectedSizeIndex * SIZE_CHIP_STEP - SIZE_CHIP_STEP, 0),
        animated: true
      })
    })
  }, [selectedSizeIndex])

  const updateSizeByIndex = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), STUDIO_PHYSICAL_MEASURE_OPTIONS.length - 1)
    setBasicSpec({ ring_size: STUDIO_PHYSICAL_MEASURE_OPTIONS[nextIndex].size })
  }

  const handleSizeInputChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '').slice(0, 2)
    setSizeInput(numericValue)

    const matchedOption = findSizeOptionByNumber(numericValue)
    if (matchedOption) setBasicSpec({ ring_size: matchedOption.size })
  }

  const handleSizeSubmit = () => {
    Keyboard.dismiss()
    if (!sizeInput) {
      setSizeInput(getSizeNumber(ringSize) || '6')
      return
    }

    const inputNumber = Number(sizeInput)
    const nearestOption = STUDIO_PHYSICAL_MEASURE_OPTIONS.reduce((nearest, option) => {
      const nearestDistance = Math.abs(Number(getSizeNumber(nearest.size)) - inputNumber)
      const optionDistance = Math.abs(Number(getSizeNumber(option.size)) - inputNumber)
      return optionDistance < nearestDistance ? option : nearest
    }, STUDIO_PHYSICAL_MEASURE_OPTIONS[0])

    setSizeInput(getSizeNumber(nearestOption.size))
    setBasicSpec({ ring_size: nearestOption.size })
  }

  return (
    <View className='gap-8 pb-2'>
      <View>
        <Text
          allowFontScaling={false}
          className='font-sans-bold text-[9px] uppercase tracking-[0.3em] text-ring-accent'
        >
          Specs
        </Text>
        <Text allowFontScaling={false} className='mt-2 font-serif text-[22px] leading-7 text-ring-primary'>
          Material, stone and fit.
        </Text>
      </View>

      <MaterialPicker
        selectedMaterialId={selectedMaterialId}
        onSelect={(materialId) => setBasicSpec({ selected_material_id: materialId })}
      />

      <View className='h-[0.5px] w-full bg-ring-primary/10' />

      <GemstonePicker
        selectedGemstoneId={selectedGemstoneId}
        onSelect={(gemstone) =>
          setBasicSpec({ selected_gemstone_id: gemstone.id, selected_gemstone_shape: gemstone.shape })
        }
      />

      <View className='h-[0.5px] w-full bg-ring-primary/10' />

      <RingSizePicker
        sizeInput={sizeInput}
        selectedSizeIndex={selectedSizeIndex}
        sizeChipScrollRef={sizeChipScrollRef}
        onInputChange={handleSizeInputChange}
        onInputSubmit={handleSizeSubmit}
        onSelectSize={(size) => setBasicSpec({ ring_size: size })}
        onStepSize={updateSizeByIndex}
        onOpenMeasure={() => router.push('/(screens)/studio-measure-now' as never)}
      />
    </View>
  )
}

import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { View } from 'react-native'
import { AlignmentToolPanel, EngravingNotice, PlacementControl } from './bio-engraving/EngravingControls'
import { OnlineSoundWaveEditor } from './bio-engraving/OnlineSoundWaveEditor'
import { PhysicalEngravingChoice } from './bio-engraving/PhysicalEngravingChoice'

export function BioEngravingStudio() {
  const selectedTypes = useRingDesignStore((state) => state.package_types)
  const physicalEngravingType = useRingDesignStore((state) => state.customization_config.physicalEngravingType)
  const placement = useRingDesignStore((state) => state.customization_config.placement)
  const position = useRingDesignStore((state) => state.customization_config.position)
  const scale = useRingDesignStore((state) => state.customization_config.scale ?? 0.62)
  const rotation = useRingDesignStore((state) => state.customization_config.rotation ?? 0.5)
  const setEngravingPosition = useRingDesignStore((state) => state.setEngravingPosition)
  const setEngravingScale = useRingDesignStore((state) => state.setEngravingScale)
  const setEngravingRotation = useRingDesignStore((state) => state.setEngravingRotation)
  const setEngravingPlacement = useRingDesignStore((state) => state.setEngravingPlacement)

  const engravableTypes = selectedTypes.filter((type) => type !== 'heartbeat')
  const onlySoundWave = selectedTypes.length === 1 && selectedTypes.includes('sound_wave')
  const isMultiOption = selectedTypes.length >= 2
  const resolvedEngravingType =
    physicalEngravingType && physicalEngravingType !== 'heartbeat'
      ? physicalEngravingType
      : engravableTypes.length === 1
        ? engravableTypes[0]
        : undefined
  const shouldShowTools = engravableTypes.length === 1 || Boolean(resolvedEngravingType)

  if (isMultiOption && engravableTypes.length > 1 && !resolvedEngravingType) {
    return (
      <View className='gap-6 pb-4'>
        <PhysicalEngravingChoice />
        <EngravingNotice onlySoundWave={false} />
      </View>
    )
  }

  if (onlySoundWave) {
    return (
      <View className='gap-6 pb-4'>
        <OnlineSoundWaveEditor
          position={position}
          scale={scale}
          rotation={rotation}
          onPositionChange={setEngravingPosition}
          onScaleChange={setEngravingScale}
          onRotationChange={setEngravingRotation}
          placementControl={<PlacementControl placement={placement} onChange={setEngravingPlacement} />}
        />
        <EngravingNotice onlySoundWave />
      </View>
    )
  }

  return (
    <View className='gap-6 pb-4'>
      {isMultiOption && engravableTypes.length > 1 ? <PhysicalEngravingChoice /> : null}

      {shouldShowTools && resolvedEngravingType ? (
        <View className='gap-6'>
          <PlacementControl placement={placement} onChange={setEngravingPlacement} />
          <AlignmentToolPanel
            position={position}
            scale={scale}
            rotation={rotation}
            onPositionChange={setEngravingPosition}
            onScaleChange={setEngravingScale}
            onRotationChange={setEngravingRotation}
          />
        </View>
      ) : null}

      <EngravingNotice onlySoundWave={false} />
    </View>
  )
}

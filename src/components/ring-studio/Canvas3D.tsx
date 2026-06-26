/* eslint-disable react/no-unknown-property */
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { Canvas, useFrame } from '@react-three/fiber/native'
import { cssInterop } from 'nativewind'
import React, { memo, useRef, useState } from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import type { Group, Mesh } from 'three'

cssInterop(Canvas, { className: 'style' })

const RING_MODEL_SCALE = 0.56

function RingScene({ manualRotation }: { manualRotation: number }) {
  const ringRef = useRef<Group>(null)
  const gemRef = useRef<Mesh>(null)
  const engravingPosition = useRingDesignStore((state) => state.customization_config.position)
  const engravingScale = useRingDesignStore((state) => state.customization_config.scale ?? 0.62)
  const engravingRotation = useRingDesignStore((state) => state.customization_config.rotation ?? 0.5)
  const engravingOffsetX = useRingDesignStore((state) => state.customization_config.offsetX ?? 0.5)
  const engravingOffsetY = useRingDesignStore((state) => state.customization_config.offsetY ?? 0.5)
  const soundWave = useRingDesignStore((state) => state.customization_config.soundWave)
  const physicalEngravingType = useRingDesignStore((state) => state.customization_config.physicalEngravingType)
  const selectedTypes = useRingDesignStore((state) => state.package_types)
  const engravableTypes = selectedTypes.filter((type) => type !== 'heartbeat')
  const resolvedEngravingType =
    physicalEngravingType && physicalEngravingType !== 'heartbeat'
      ? physicalEngravingType
      : engravableTypes.length === 1
        ? engravableTypes[0]
        : undefined
  const isSingleSoundWave = selectedTypes.length === 1 && selectedTypes.includes('sound_wave')
  const hasSoundWave = resolvedEngravingType === 'sound_wave' && (!isSingleSoundWave || Boolean(soundWave?.sourceUri))
  const hasFingerprint = resolvedEngravingType === 'fingerprint'

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.16
    if (gemRef.current) gemRef.current.rotation.y -= delta * 0.5
  })

  const markerAngle = engravingPosition * Math.PI * 2
  const markerRadius = 1.68 + (engravingOffsetY - 0.5) * 0.22
  const markerX = Math.cos(markerAngle) * markerRadius + (engravingOffsetX - 0.5) * 0.34
  const markerZ = Math.sin(markerAngle) * markerRadius
  const markerScale = 0.72 + engravingScale * 0.72
  const markerRotation = (engravingRotation - 0.5) * Math.PI
  const sourceAmplitudes =
    isSingleSoundWave && soundWave?.amplitudes?.length
      ? soundWave.amplitudes.slice(
          Math.floor((soundWave.cropStartSeconds / soundWave.durationSeconds) * soundWave.amplitudes.length),
          Math.max(
            Math.floor((soundWave.cropStartSeconds / soundWave.durationSeconds) * soundWave.amplitudes.length) + 1,
            Math.ceil(
              ((soundWave.cropStartSeconds + soundWave.cropDurationSeconds) / soundWave.durationSeconds) *
                soundWave.amplitudes.length
            )
          )
        )
      : [18, 28, 44, 26, 56, 72, 34, 48, 86, 52, 38, 64, 30, 46, 74, 58, 36, 68]
  const waveBars = Array.from({ length: 18 }, (_, index) => {
    const sourceIndex = Math.min(sourceAmplitudes.length - 1, Math.floor((index / 18) * sourceAmplitudes.length))
    return sourceAmplitudes[sourceIndex] ?? 32
  })

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 3, 5]} intensity={2.2} color='#FFF4E4' />
      <directionalLight position={[-4, -2, 3]} intensity={0.7} color='#DCEBFF' />

      <group ref={ringRef} rotation={[0.72, manualRotation, 0.05]} scale={RING_MODEL_SCALE}>
        <mesh>
          <torusGeometry args={[1.58, 0.18, 48, 128]} />
          <meshStandardMaterial color='#D7C4A4' metalness={1} roughness={0.2} />
        </mesh>

        <mesh ref={gemRef} position={[0, 0.44, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color='#FDFDFB' metalness={0.1} roughness={0.05} />
        </mesh>

        {hasSoundWave ? (
          <group rotation={[0, 0, markerAngle + markerRotation]} scale={markerScale}>
            {waveBars.map((height, index) => (
              <mesh key={`wave-${index}`} position={[-0.55 + index * 0.065, 1.78, 0.03]}>
                <boxGeometry args={[0.018, 0.06 + Math.min(height, 96) * 0.0018, 0.018]} />
                <meshStandardMaterial color='#1A3642' metalness={0.2} roughness={0.45} />
              </mesh>
            ))}
          </group>
        ) : null}

        {hasFingerprint ? (
          <mesh position={[markerX, 0, markerZ]} rotation={[Math.PI / 2, 0, markerRotation]} scale={markerScale}>
            <torusGeometry args={[0.18, 0.012, 12, 48]} />
            <meshStandardMaterial color='#1A3642' metalness={0.3} roughness={0.3} />
          </mesh>
        ) : null}
      </group>
    </>
  )
}

export const Canvas3D = memo(function Canvas3D() {
  const [rotationHint, setRotationHint] = useState(0)

  const pan = Gesture.Pan().onUpdate((event) => {
    runOnJS(setRotationHint)(Math.round(event.translationX))
  })

  return (
    <View className='absolute left-0 right-0 top-0 z-0 h-[50%] overflow-hidden'>
      <GestureDetector gesture={pan}>
        <View className='h-full w-full'>
          <Canvas className='h-full w-full' camera={{ position: [0, 0, 5.2], fov: 34 }}>
            <RingScene manualRotation={rotationHint / 120} />
          </Canvas>
        </View>
      </GestureDetector>
    </View>
  )
})

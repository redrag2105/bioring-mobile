/* eslint-disable react/no-unknown-property */
import { Environment } from '@react-three/drei/native'
import { Canvas, useFrame } from '@react-three/fiber/native'
import { cssInterop } from 'nativewind'
import React, { Suspense, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { interpolate, SharedValue } from 'react-native-reanimated'
import { Group } from 'three'

import { THEME } from '@/constants/theme'

import { DEEP_NAVY } from './ProductDetailBackground'
import type { ProductMaterial } from './productDetailTypes'

cssInterop(Canvas, { className: 'style' })

const MSAA_EXTENSIONS_BLOCKLIST: readonly string[] = [
  'WEBGL_multisampled_render_to_texture',
  'EXT_multisampled_render_to_texture',
  'OES_draw_buffers_indexed',
  'WEBGL_draw_buffers'
]

function patchGLContextForExpo(glContext: any) {
  if (!glContext || typeof glContext.getExtension !== 'function') return
  const originalGetExtension = glContext.getExtension.bind(glContext)
  glContext.getExtension = (name: string): any => {
    if (MSAA_EXTENSIONS_BLOCKLIST.includes(name)) return null
    return originalGetExtension(name)
  }
}

function ProceduralRing({ material }: { material: ProductMaterial }) {
  return (
    <group rotation={[0.72, 0, 0.03]}>
      <mesh>
        <torusGeometry args={[1.52, 0.17, 72, 160]} />
        <meshStandardMaterial color={material.metalColor} metalness={1} roughness={0.12} envMapIntensity={1.8} />
      </mesh>
    </group>
  )
}

type RingSceneProps = {
  material: ProductMaterial
  manualRotation: SharedValue<number>
  zoom: SharedValue<number>
  modeProgress: SharedValue<number>
  introFlash: SharedValue<number>
  spinAction: SharedValue<number>
  flyScaleMult: SharedValue<number>
}

function RingScene({ material, manualRotation, zoom, modeProgress, introFlash, spinAction, flyScaleMult }: RingSceneProps) {
  const ringRef = useRef<Group>(null)
  const autoRotateAngle = useRef(0)
  const BASE_SCALE = 0.55

  useFrame((_, delta) => {
    if (!ringRef.current) return
    const progress = modeProgress.value

    autoRotateAngle.current += delta * 0.32

    const baseOffsetY = interpolate(progress, [0, 1], [0.5, 0.05])
    ringRef.current.position.y = baseOffsetY
    ringRef.current.position.x = 0

    ringRef.current.rotation.x = interpolate(progress, [0, 1], [0, -0.05])
    ringRef.current.rotation.y = autoRotateAngle.current + manualRotation.value + spinAction.value

    const currentBaseScale = interpolate(progress, [0, 1], [BASE_SCALE, BASE_SCALE * 0.85])
    const scaleValue = currentBaseScale * flyScaleMult.value + zoom.value * 0.3
    ringRef.current.scale.set(scaleValue, scaleValue, scaleValue)
  })

  return (
    <>
      <ambientLight intensity={0.15} />

      <spotLight
        position={[0, -6, 0]}
        intensity={15.0 + introFlash.value * 20.0}
        color={THEME.ringAccent}
        angle={0.45}
        penumbra={0.7}
      />

      <spotLight position={[0, 2, -5]} intensity={10.0} color='#FFFFFF' angle={0.8} penumbra={1} />

      <directionalLight position={[4, 0, 2]} intensity={3.0} color='#FFF5E6' />
      <directionalLight position={[-4, 0, 2]} intensity={1.5} color={THEME.ringPrimary} />

      <spotLight position={[0, 5, 1]} intensity={2.0} color='#FFFFFF' angle={0.3} penumbra={0.5} />

      <Suspense fallback={null}>
        <Environment preset='city' environmentIntensity={0.8} />
      </Suspense>

      <group ref={ringRef}>
        <ProceduralRing material={material} />
      </group>
    </>
  )
}

type Props = RingSceneProps & {
  gesture: React.ComponentProps<typeof GestureDetector>['gesture']
}

export function ProductRingStage({ gesture, ...sceneProps }: Props) {
  return (
    <View style={StyleSheet.absoluteFillObject} className='z-0'>
      <GestureDetector gesture={gesture}>
        <Animated.View className='flex-1'>
          <Canvas
            className='flex-1'
            camera={{ position: [0, 0, 7], fov: 35 }}
            gl={{ antialias: false, preserveDrawingBuffer: false, alpha: true }}
            onCreated={({ gl }) => {
              const glContext = gl.getContext()
              patchGLContextForExpo(glContext)
              if (typeof gl.setClearColor === 'function') gl.setClearColor(DEEP_NAVY, 0)
            }}
          >
            <RingScene {...sceneProps} />
          </Canvas>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

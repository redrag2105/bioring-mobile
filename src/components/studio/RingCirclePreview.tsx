import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import Svg, { Circle, Line } from 'react-native-svg'

import { THEME } from '@/constants/theme'
import { mmToLogicalPixels } from '@/utils/physicalScale'

type RingCirclePreviewProps = {
  diameter: string
  diameterMm: number
  size: string
}

const PREVIEW_HEIGHT = mmToLogicalPixels(66)
const GUIDE_SIZE = mmToLogicalPixels(42)

export function RingCirclePreview({ diameter, diameterMm, size }: RingCirclePreviewProps) {
  const circleSize = mmToLogicalPixels(diameterMm)
  const radius = circleSize / 2

  return (
    <View
      className='elevation-2 shrink-0 items-center justify-center overflow-hidden rounded-[28px] border border-white shadow-xl shadow-ring-accent/10'
      pointerEvents='none'
      style={{ height: PREVIEW_HEIGHT, minHeight: PREVIEW_HEIGHT, flexShrink: 0 }}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FCFAFC', '#F3F6F2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='absolute inset-0'
      />

      <View className='absolute left-0 right-0 top-4 items-center px-5' pointerEvents='none'>
        <Text
          allowFontScaling={false}
          className='font-sans-bold text-[9px] uppercase tracking-[0.24em] text-ring-accent'
        >
          Measure by Ring
        </Text>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          className='mt-1 text-center font-sans text-[10px] leading-4 text-txt-muted'
        >
          Match the circle to your ring inner edge.
        </Text>
        <Text allowFontScaling={false} className='mt-0.5 font-serif text-[22px] leading-6 text-ring-primary'>
          {size}
        </Text>
        <Text allowFontScaling={false} className='font-sans text-[10px] leading-3 text-txt-muted'>
          {diameter} inner diameter
        </Text>
      </View>

      <View className='mt-20 items-center justify-center' pointerEvents='none'>
        <View
          className='absolute items-center justify-center rounded-full bg-ring-accent/5'
          pointerEvents='none'
          style={{ height: GUIDE_SIZE, width: GUIDE_SIZE }}
        />

        <Svg height={circleSize} width={circleSize} pointerEvents='none'>
          <Line
            x1={radius}
            y1={0}
            x2={radius}
            y2={circleSize}
            stroke={THEME.ringPrimary}
            strokeOpacity='0.16'
            strokeWidth='1'
          />
          <Line
            x1={0}
            y1={radius}
            x2={circleSize}
            y2={radius}
            stroke={THEME.ringPrimary}
            strokeOpacity='0.16'
            strokeWidth='1'
          />
          <Circle
            cx={radius}
            cy={radius}
            r={Math.max(radius - 1.25, 0)}
            fill='transparent'
            stroke={THEME.ringAccent}
            strokeWidth='2.5'
          />
          <Circle cx={radius} cy={radius} r='2.5' fill={THEME.ringPrimary} fillOpacity='0.22' />
        </Svg>
      </View>
    </View>
  )
}

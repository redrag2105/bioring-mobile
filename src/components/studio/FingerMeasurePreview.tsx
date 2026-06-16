import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'

import { mmToLogicalPixels } from '@/utils/physicalScale'

type FingerMeasurePreviewProps = {
  diameter: string
  diameterMm: number
  size: string
}

const PREVIEW_HEIGHT = mmToLogicalPixels(66)
const FINGER_HEIGHT = mmToLogicalPixels(48)
const NAIL_HEIGHT = mmToLogicalPixels(9)

export function FingerMeasurePreview({ diameter, diameterMm, size }: FingerMeasurePreviewProps) {
  // BẢO TOÀN LOGIC TÍNH TOÁN KÍCH THƯỚC THỰC
  const fingerWidth = mmToLogicalPixels(diameterMm)
  const nailWidth = fingerWidth * 0.72

  return (
    <View
      className='elevation-2 shrink-0 justify-end overflow-hidden rounded-[28px] border border-white shadow-xl shadow-ring-accent/10'
      pointerEvents='none'
      style={{ height: PREVIEW_HEIGHT, minHeight: PREVIEW_HEIGHT, flexShrink: 0 }}
    >
      {/* 1. Background Sạch & Sang trọng hơn (Trắng -> Kem nhạt) */}
      <LinearGradient
        colors={['#FFFFFF', '#FCFAFC', '#F4EFEB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='absolute inset-0'
      />

      {/* 2. Tiêu đề (Đã bỏ đường kẻ ngang, đổi Live Width sang màu Accent) */}
      <View className='absolute left-0 right-0 top-5 items-center' pointerEvents='none'>
        <Text
          allowFontScaling={false}
          className='font-sans-bold text-[10px] uppercase tracking-[0.25em] text-ring-accent'
        >
          Live Width
        </Text>
        <Text allowFontScaling={false} className='mt-1 font-serif text-[24px] leading-7 text-ring-primary'>
          {size}
        </Text>
        <Text allowFontScaling={false} className='font-sans text-[11px] text-txt-muted'>
          {diameter} inner diameter
        </Text>
      </View>

      {/* 3. Mô phỏng kích thước ngón tay */}
      <View className='w-full items-center justify-end' pointerEvents='none'>
        <View
          className='items-center overflow-hidden rounded-b-[28px] rounded-t-full border-[1.5px] border-ring-accent/40'
          pointerEvents='none'
          style={{ width: fingerWidth, height: FINGER_HEIGHT }}
        >
          {/* Gradient Ngón tay bắt mắt hơn (Tông Vàng rực) */}
          <LinearGradient
            colors={['#FDE68A', '#D4AF37', '#A16207']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            className='absolute inset-0 opacity-40'
          />

          {/* Chi tiết móng tay (Hiệu ứng kính mờ nổi bật) */}
          <View
            className='mt-3 rounded-full border-[1.5px] border-white/90 bg-white/40 shadow-sm'
            pointerEvents='none'
            style={{ width: nailWidth, height: NAIL_HEIGHT }}
          />

          {/* Chi tiết lằn ngón tay (Sắc nét hơn với tông vàng) */}
          <View className='mt-5 h-[1.5px] w-[86%] rounded-full bg-ring-accent/50' />
          <View className='mt-3 h-[1.5px] w-[68%] rounded-full bg-ring-accent/30' />
        </View>
      </View>
    </View>
  )
}

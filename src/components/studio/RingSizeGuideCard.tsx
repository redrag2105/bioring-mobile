import { useRouter } from 'expo-router'
import { ScanLine } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import Svg, { Circle, Defs, Line, Mask, Rect } from 'react-native-svg'

import { THEME } from '@/constants/theme'

// Các thông số kích thước lỗ khoét
const CORNER_RADIUS = 16
const NOTCH_RADIUS = 12

export function RingSizeGuideCard() {
  const router = useRouter()
  const scanPosition = useSharedValue(0)

  // State để lưu tọa độ Y của đường cắt, giúp 2 lỗ khoét 2 bên luôn khớp chuẩn xác
  const [dividerY, setDividerY] = useState(0)

  // Animation cho đường kẻ "đang đo"
  useEffect(() => {
    scanPosition.value = withRepeat(withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [scanPosition])

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPosition.value * 120 }],
    opacity: scanPosition.value > 0.1 && scanPosition.value < 0.9 ? 0.8 : 0
  }))

  const handleOpenGuide = () => {
    router.push('/studio-size-guide' as any)
  }

  const handleMeasureNow = () => {
    router.push('/studio-measure-now' as any)
  }

  return (
    // Bỏ background và border ở container chính để SVG đảm nhận việc vẽ hình dáng
    <View className='relative shadow-xl shadow-black/10'>
      {/* --- BACKGROUND VỚI MẶT NẠ KHOÉT LỖ (TRUE TRANSPARENCY) --- */}
      <View className='pointer-events-none absolute inset-0'>
        <Svg width='100%' height='100%'>
          <Defs>
            <Mask id='ticketMask'>
              {/* Phủ trắng toàn bộ (những phần màu trắng sẽ được giữ lại) */}
              <Rect width='100%' height='100%' fill='white' />

              {/* Khoét 4 góc (màu đen sẽ đục thủng background) */}
              <Circle cx='0' cy='0' r={CORNER_RADIUS} fill='black' />
              <Circle cx='100%' cy='0' r={CORNER_RADIUS} fill='black' />
              <Circle cx='0' cy='100%' r={CORNER_RADIUS} fill='black' />
              <Circle cx='100%' cy='100%' r={CORNER_RADIUS} fill='black' />

              {/* Khoét 2 lỗ bên hông (Dựa theo tọa độ Y của đường chia) */}
              {dividerY > 0 && (
                <>
                  <Circle cx='0' cy={dividerY + 12} r={NOTCH_RADIUS} fill='black' />
                  <Circle cx='100%' cy={dividerY + 12} r={NOTCH_RADIUS} fill='black' />
                </>
              )}
            </Mask>
          </Defs>

          {/* Vẽ nền Voucher và áp dụng mặt nạ cắt */}
          <Rect width='100%' height='100%' fill={THEME.ringSurface || '#FFFFFF'} mask='url(#ticketMask)' />

          {/* Vẽ viền ngoài mờ ảo, viền này cũng sẽ bị cắt đứt ở các lỗ khoét */}
          <Rect
            width='100%'
            height='100%'
            fill='none'
            stroke={THEME.ringAccent}
            strokeOpacity='0.3'
            strokeWidth='1'
            mask='url(#ticketMask)'
          />
        </Svg>
      </View>

      {/* --- BACKGROUND THƯỚC ĐO Ở CẠNH PHẢI --- */}
      <View className='pointer-events-none absolute bottom-24 right-0 top-6 w-16 opacity-30'>
        <Svg width='100%' height='100%'>
          {Array.from({ length: 12 }).map((_, i) => {
            const isMajor = i % 5 === 0
            return (
              <Line
                key={i}
                x1={isMajor ? '20%' : '50%'}
                y1={i * 10 + 10}
                x2='100%'
                y2={i * 10 + 10}
                stroke={THEME.ringPrimary}
                strokeWidth={isMajor ? '2' : '1.5'}
              />
            )
          })}
        </Svg>
      </View>

      {/* --- ĐƯỜNG KẺ SCAN QUÉT --- */}
      <Animated.View
        className='absolute right-0 z-10 h-[1.5px] w-16 bg-ring-accent shadow-[0_0_10px_rgba(255,215,0,0.8)]'
        style={[scanLineStyle, { top: 20 }]}
      />

      {/* --- PHẦN 1: NỘI DUNG (TOP SECTION) --- */}
      <View className='relative z-10 p-6 pb-8 pr-12'>
        <View className='mb-3 flex-row items-center gap-2'>
          <ScanLine color={THEME.ringAccent} size={14} strokeWidth={2} />
          <Text className='font-sans-medium text-[9px] uppercase tracking-[0.25em] text-ring-accent'>
            VIP SIZE GUIDANCE
          </Text>
        </View>

        <Text className='mb-2 font-serif text-[26px] leading-[32px] text-ring-primary'>
          Find Your {'\n'}Perfect Fit
        </Text>
        <Text className='font-sans-light text-[13px] leading-5 text-txt-muted'>
          Use our precision tool or view the guide to determine your exact ring size.
        </Text>
      </View>

      {/* --- PHẦN 2: ĐƯỜNG CẮT TICKET --- */}
      <View
        className='relative h-6 w-full justify-center px-6'
        // Lấy tọa độ Y thực tế để đục 2 lỗ khoét trùng khớp với đường line
        onLayout={(e) => setDividerY(e.nativeEvent.layout.y)}
      >
        <View className='opacity-30'>
          <Svg height='1' width='100%'>
            <Line x1='0' y1='0' x2='100%' y2='0' stroke={THEME.ringPrimary} strokeWidth='2' strokeDasharray='6 6' />
          </Svg>
        </View>
      </View>

      {/* --- PHẦN 3: NÚT HÀNH ĐỘNG (BOTTOM SECTION) --- */}
      <View className='relative z-10 flex-row items-center gap-3 p-6 pt-4'>
        <Pressable
          onPress={handleOpenGuide}
          className='flex-1 items-center justify-center rounded-full border-[0.5px] border-ring-primary/40 bg-transparent py-3.5 shadow-sm shadow-black/5'
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text className='font-sans-medium text-[11px] uppercase tracking-wider text-ring-primary'>
            Measure Manually
          </Text>
        </Pressable>

        <Pressable
          onPress={handleMeasureNow}
          className='flex-1 items-center justify-center rounded-full bg-ring-primary py-3.5 shadow-lg shadow-ring-primary/25'
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text className='font-sans-medium text-[11px] uppercase tracking-wider text-white'>Measure Now</Text>
        </Pressable>
      </View>
    </View>
  )
}

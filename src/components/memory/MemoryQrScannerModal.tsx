import { CameraView, useCameraPermissions, type BarcodeScanningResult, type BarcodeSettings } from 'expo-camera'
import { LinearGradient } from 'expo-linear-gradient'
import { QrCode, X } from 'lucide-react-native'
import { cssInterop } from 'nativewind'
import { useEffect, useState } from 'react'
import { Dimensions, Linking, Modal, Pressable, Text, View } from 'react-native'
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Defs, Mask, Rect } from 'react-native-svg'

import { THEME } from '@/constants/theme'

cssInterop(CameraView, { className: 'style' })

const { width, height } = Dimensions.get('window')

// Kích thước và vị trí của vùng quét (vòng tròn tâm)
const VOID_SIZE = width * 0.68
const CUTOUT_X = (width - VOID_SIZE) / 2
const CUTOUT_Y = (height - VOID_SIZE) / 2.3

// Cấu hình cài đặt máy quét (Sử dụng BarcodeSettings type để fix lỗi TypeScript readonly)
const BARCODE_SETTINGS: BarcodeSettings = { barcodeTypes: ['qr'] }

// --- COMPONENT HẠT LẤP LÁNH TĨNH ---
const BlinkingParticle = ({ x, y, size, delay, duration, color }: any) => {
  const opacity = useSharedValue(0.1)

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    )
  }, [])

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: y,
          left: x,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 1,
          shadowRadius: size * 2
        },
        style
      ]}
    />
  )
}

type MemoryQrScannerModalProps = {
  visible: boolean
  onClose: () => void
  onScanned: (code: string) => void
}

export function MemoryQrScannerModal({ visible, onClose, onScanned }: MemoryQrScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [hasScanned, setHasScanned] = useState(false)
  const insets = useSafeAreaInsets()

  // --- ANIMATIONS CHO VÒNG TRÒN QUỸ ĐẠO & NGÔI SAO ---
  const orbitOne = useSharedValue(0)
  const orbitTwo = useSharedValue(0)
  const orbitThree = useSharedValue(0)

  const star1Rotation = useSharedValue(0)
  const star2Rotation = useSharedValue(0)
  const star3Rotation = useSharedValue(0)
  const starBlink = useSharedValue(0.3)

  // Animation cho tia laser và biểu tượng QR khi chưa cấp quyền
  const scannerLineY = useSharedValue(0)
  const qrPulse = useSharedValue(0.5)

  useEffect(() => {
    if (visible) {
      setHasScanned(false)

      orbitOne.value = withRepeat(withTiming(360, { duration: 15000, easing: Easing.linear }), -1, false)
      orbitTwo.value = withRepeat(withTiming(-360, { duration: 20000, easing: Easing.linear }), -1, false)
      orbitThree.value = withRepeat(withTiming(360, { duration: 25000, easing: Easing.linear }), -1, false)

      star1Rotation.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1, false)
      star2Rotation.value = withRepeat(withTiming(-360, { duration: 7000, easing: Easing.linear }), -1, false)
      star3Rotation.value = withRepeat(withTiming(360, { duration: 10000, easing: Easing.linear }), -1, false)

      starBlink.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )

      if (!permission?.granted) {
        scannerLineY.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
        qrPulse.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      }
    }
  }, [visible, permission?.granted])

  // --- STYLE RENDER CHO ANIMATIONS ---
  const animatedOrbitOne = useAnimatedStyle(() => ({ transform: [{ rotate: `${orbitOne.value}deg` }] }))
  const animatedOrbitTwo = useAnimatedStyle(() => ({ transform: [{ rotate: `${orbitTwo.value}deg` }] }))
  const animatedOrbitThree = useAnimatedStyle(() => ({ transform: [{ rotate: `${orbitThree.value}deg` }] }))

  const animatedStar1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${star1Rotation.value}deg` }],
    opacity: starBlink.value
  }))
  const animatedStar2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${star2Rotation.value}deg` }],
    opacity: starBlink.value
  }))
  const animatedStar3 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${star3Rotation.value}deg` }],
    opacity: starBlink.value
  }))

  const animatedLaserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scannerLineY.value, [0, 1], [-25, 25]) }]
  }))
  const animatedQrStyle = useAnimatedStyle(() => ({ opacity: qrPulse.value }))

  // --- EVENT HANDLERS ---
  async function handleRequestPermission() {
    if (!permission) return
    if (!permission.granted && !permission.canAskAgain) {
      Linking.openSettings()
      return
    }
    const result = await requestPermission()
    if (!result.granted && !result.canAskAgain) {
      Linking.openSettings()
    }
  }

  function handleClose() {
    setHasScanned(false)
    onClose()
  }

  function handleBarcodeScanned(result: BarcodeScanningResult) {
    if (hasScanned) return
    setHasScanned(true)
    console.log('QR SCANNED SUCCESSFULLY: ', result.data)
    onScanned(result.data)
  }

  return (
    <Modal visible={visible} animationType='fade' onRequestClose={handleClose} presentationStyle='fullScreen'>
      <View className='flex-1 bg-[#09090D]'>
        {/* --- LAYER 1: CAMERA LENS --- */}
        {permission?.granted ? (
          <View className='absolute inset-0 z-0'>
            <CameraView
              className='flex-1'
              facing='back'
              barcodeScannerSettings={BARCODE_SETTINGS}
              onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
            />
          </View>
        ) : (
          /* --- MÀN HÌNH CHỜ CẤP QUYỀN CAMERA (LUXURY STYLE) --- */
          <View className='absolute inset-0 z-20 bg-[#09090D]/80 backdrop-blur-lg'>
            {/* Nút tắt màn hình cấp quyền */}
            <Animated.View
              entering={FadeInDown.duration(600)}
              className='absolute right-6 z-30'
              style={{ top: insets.top + 16 }}
            >
              <Pressable
                onPress={handleClose}
                className='h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md'
              >
                <X color='#FFFFFF' size={20} strokeWidth={1.5} />
              </Pressable>
            </Animated.View>

            <View className='flex-1 items-center justify-center px-6'>
              <Animated.View
                entering={FadeInDown.duration(800).delay(100)}
                className='w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#12121A]/80 p-8 shadow-[0_0_50px_rgba(182,155,122,0.15)] backdrop-blur-2xl'
              >
                <View className='mb-10 items-center justify-center'>
                  <View className='relative h-28 w-28 items-center justify-center'>
                    <View className='absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-ring-accent/70' />
                    <View className='absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-ring-accent/70' />
                    <View className='absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-ring-accent/70' />
                    <View className='absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-ring-accent/70' />

                    <Animated.View style={animatedQrStyle}>
                      <QrCode color={THEME.ringAccent} size={48} strokeWidth={1.5} className='opacity-80' />
                    </Animated.View>

                    <Animated.View
                      style={[animatedLaserStyle]}
                      className='absolute h-[2px] w-full bg-ring-accent shadow-[0_0_15px_rgba(182,155,122,1)]'
                    />
                  </View>
                </View>

                <Text allowFontScaling={false} className='text-center font-serif text-[26px] tracking-wide text-white'>
                  Enable Camera
                </Text>
                <Text
                  allowFontScaling={false}
                  className='mt-3 text-center font-sans text-[14px] leading-6 text-white/50'
                >
                  Your lens is required to scan the Bioring hallmark and decrypt your memories.
                </Text>

                <View className='mt-8 gap-4'>
                  <Pressable
                    accessibilityRole='button'
                    onPress={handleRequestPermission}
                    className='h-14 items-center justify-center rounded-full bg-ring-accent shadow-[0_0_20px_rgba(182,155,122,0.4)]'
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }]
                    })}
                  >
                    <Text
                      allowFontScaling={false}
                      className='font-sans-bold text-[13px] uppercase tracking-[0.2em] text-[#09090D]'
                    >
                      {permission && !permission.canAskAgain ? 'Open Settings' : 'Grant Access'}
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            </View>
          </View>
        )}

        {/* --- LAYER 2: CÁC THÀNH PHẦN TRANG TRÍ MẶC ĐỊNH --- */}
        {/* SVG Mask đục lỗ xuyên thấu xuống Camera ở dưới */}
        <View className='pointer-events-none absolute inset-0 z-10'>
          <Svg width='100%' height='100%'>
            <Defs>
              <Mask id='voidCutout'>
                <Rect width='100%' height='100%' fill='white' />
                <Circle cx={CUTOUT_X + VOID_SIZE / 2} cy={CUTOUT_Y + VOID_SIZE / 2} r={VOID_SIZE / 2} fill='black' />
              </Mask>
            </Defs>
            <Rect width='100%' height='100%' fill='rgba(9, 9, 13, 0.78)' mask='url(#voidCutout)' />
          </Svg>

          {/* Các hạt lấp lánh trang trí trôi nổi */}
          <BlinkingParticle
            x={width * 0.1}
            y={height * 0.2}
            size={2}
            delay={0}
            duration={3000}
            color={THEME.ringAccent}
          />
          <BlinkingParticle
            x={width * 0.85}
            y={height * 0.15}
            size={1.5}
            delay={1000}
            duration={4000}
            color='#FFFFFF'
          />
          <BlinkingParticle
            x={width * 0.8}
            y={height * 0.75}
            size={2.5}
            delay={500}
            duration={3500}
            color={THEME.ringAccent}
          />
          <BlinkingParticle x={width * 0.2} y={height * 0.8} size={1.5} delay={1500} duration={2500} color='#FFFFFF' />
          <BlinkingParticle
            x={width * 0.5}
            y={height * 0.85}
            size={2}
            delay={800}
            duration={3000}
            color={THEME.ringAccent}
          />

          {/* Các vòng quỹ đạo (Orbits) nằm đè chính xác lên lỗ khoét */}
          <View className='absolute' style={{ left: CUTOUT_X, top: CUTOUT_Y, width: VOID_SIZE, height: VOID_SIZE }}>
            <View className='absolute inset-0 rounded-full border border-ring-accent/10 shadow-[0_0_30px_rgba(182,155,122,0.2)]' />

            <Animated.View style={[animatedOrbitOne]} className='absolute inset-[-4px] items-center justify-center'>
              <View className='h-full w-full rounded-full border-[0.5px] border-ring-accent/40' />
            </Animated.View>
            <Animated.View style={[animatedOrbitTwo]} className='absolute inset-[-16px] items-center justify-center'>
              <View className='h-full w-full rounded-full border-[0.5px] border-white/15' />
            </Animated.View>
            <Animated.View style={[animatedOrbitThree]} className='absolute inset-[-28px] items-center justify-center'>
              <View className='h-full w-full rounded-full border-[0.5px] border-ring-accent/20' />
            </Animated.View>

            {/* Các ngôi sao xoay theo quỹ đạo */}
            <Animated.View style={[animatedStar1, { position: 'absolute', inset: -4 }]}>
              <View className='absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-ring-accent shadow-[0_0_10px_rgba(182,155,122,1)]' />
            </Animated.View>
            <Animated.View style={[animatedStar2, { position: 'absolute', inset: -16 }]}>
              <View className='absolute bottom-0 left-1/3 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' />
            </Animated.View>
            <Animated.View style={[animatedStar3, { position: 'absolute', inset: -28 }]}>
              <View className='absolute right-0 top-1/4 h-1.5 w-1.5 rounded-full bg-ring-accent shadow-[0_0_8px_rgba(182,155,122,0.8)]' />
            </Animated.View>
          </View>
        </View>

        {/* --- LAYER 3: UI TƯƠNG TÁC CHÍNH KHI ĐÃ CẤP QUYỀN CAMERA --- */}
        {permission?.granted && (
          <View className='z-20 flex-1' style={{ paddingTop: insets.top }}>
            {/* Header: Chữ Sync Memory & Nút tắt */}
            <Animated.View
              entering={FadeInDown.duration(600)}
              className='flex-row items-center justify-between px-6 pt-4'
            >
              <View className='w-10' />
              <Text allowFontScaling={false} className='font-serif text-[16px] tracking-widest text-white/90'>
                Sync Memory
              </Text>
              <Pressable
                onPress={handleClose}
                className='h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md'
              >
                <X color='#FFFFFF' size={20} strokeWidth={1.5} />
              </Pressable>
            </Animated.View>

            {/* Footer: Hướng dẫn quét */}
            <Animated.View
              entering={FadeInDown.duration(800).delay(200)}
              className='absolute bottom-0 left-0 right-0 px-8 pb-12 pt-20'
            >
              <LinearGradient
                colors={['transparent', 'rgba(9,9,13,0.85)', '#09090D']}
                className='absolute inset-0 z-0'
              />
              <View className='relative z-10 items-center'>
                <Text allowFontScaling={false} className='text-center font-sans text-[13px] leading-6 text-white/60'>
                  Align the hallmark within the ring to decrypt.
                </Text>
              </View>
            </Animated.View>
          </View>
        )}
      </View>
    </Modal>
  )
}

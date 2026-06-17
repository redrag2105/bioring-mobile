import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowRight, Check, Flower, Link2, ScanLine } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Image, Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Defs, Line, Mask, Rect } from 'react-native-svg'

import { THEME } from '@/constants/theme'

const POST_LOGIN_SETUP_COMPLETE_KEY = '@bioring:post_login_setup_complete'
const RING_OUTLINE_WATERMARK = require('../../assets/images/collections/ring_outline.png')

const CORNER_RADIUS = 24
const ENTRY_DURATION = 540
const NOTCH_RADIUS = 16 // Kích thước lỗ khoét

export async function markPostLoginSetupComplete() {
  await AsyncStorage.setItem(POST_LOGIN_SETUP_COMPLETE_KEY, 'true')
}

export function PostLoginSetupScreen() {
  const router = useRouter()
  const [designCode, setDesignCode] = useState('')
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [isCheckingPreference, setIsCheckingPreference] = useState(true)
  const [dividerY, setDividerY] = useState(0) // Lưu tọa độ Y để đục lỗ cho Card SVG

  const canSync = designCode.trim().length > 0
  const headerEntry = useSharedValue(0)
  const cardShellEntry = useSharedValue(0)
  const cardHeaderEntry = useSharedValue(0)
  const dividerEntry = useSharedValue(0)
  const inputEntry = useSharedValue(0)
  const barcodeEntry = useSharedValue(0)
  const footerEntry = useSharedValue(0)

  // 1. Animation Nhẫn Xoay Vô Tận ở Background
  const rotation = useSharedValue(0)
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 50000, easing: Easing.linear }), -1, false)
  }, [rotation])
  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }))

  // 2. Animation lơ lửng khi đứng yên (Idle Floating - Tạo cảm giác 3D)
  const idleFloat = useSharedValue(0)
  useEffect(() => {
    idleFloat.value = withRepeat(withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [idleFloat])

  // 3. Animation Focus (Kiểm soát zoom in để không chạm chữ)
  const focusProgress = useSharedValue(0)

  useEffect(() => {
    if (isCheckingPreference) {
      return
    }

    headerEntry.value = 0
    cardShellEntry.value = 0
    cardHeaderEntry.value = 0
    dividerEntry.value = 0
    inputEntry.value = 0
    barcodeEntry.value = 0
    footerEntry.value = 0

    const easing = Easing.out(Easing.cubic)
    headerEntry.value = withTiming(1, { duration: ENTRY_DURATION, easing })
    cardShellEntry.value = withDelay(260, withTiming(1, { duration: ENTRY_DURATION, easing }))
    cardHeaderEntry.value = withDelay(420, withTiming(1, { duration: ENTRY_DURATION, easing }))
    dividerEntry.value = withDelay(560, withTiming(1, { duration: ENTRY_DURATION, easing }))
    inputEntry.value = withDelay(700, withTiming(1, { duration: ENTRY_DURATION, easing }))
    barcodeEntry.value = withDelay(840, withTiming(1, { duration: ENTRY_DURATION, easing }))
    footerEntry.value = withDelay(1020, withTiming(1, { duration: ENTRY_DURATION, easing }))
  }, [
    barcodeEntry,
    cardHeaderEntry,
    cardShellEntry,
    dividerEntry,
    footerEntry,
    headerEntry,
    inputEntry,
    isCheckingPreference
  ])

  const handleInputFocus = () => {
    focusProgress.value = withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
  }

  const handleInputBlur = () => {
    focusProgress.value = withTiming(0, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
  }

  // Cấu hình style 3D cho thẻ
  const animatedCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(focusProgress.value, [0, 1], [1, 1.02])

    const floatY = interpolate(idleFloat.value, [0, 1], [0, -6])
    const focusY = interpolate(focusProgress.value, [0, 1], [0, -20])
    const entryY = interpolate(cardShellEntry.value, [0, 1], [-28, 0])
    const translateY = entryY + focusY + floatY * (1 - focusProgress.value)

    const idleShadowOpacity = interpolate(idleFloat.value, [0, 1], [0.12, 0.22])
    const shadowOpacity = interpolate(focusProgress.value, [0, 1], [idleShadowOpacity, 0.3])
    const shadowRadius = interpolate(focusProgress.value, [0, 1], [interpolate(idleFloat.value, [0, 1], [15, 25]), 35])

    return {
      opacity: cardShellEntry.value,
      transform: [{ scale }, { translateY }],
      shadowOpacity,
      shadowRadius,
      shadowOffset: { width: 0, height: interpolate(idleFloat.value, [0, 1], [8, 16]) },
      elevation: interpolate(focusProgress.value, [0, 1], [10, 20])
    }
  })

  // Lớp phủ mờ cinematic background khi nhập liệu
  const animatedHeaderEntryStyle = useAnimatedStyle(() => ({
    opacity: headerEntry.value,
    transform: [{ translateY: interpolate(headerEntry.value, [0, 1], [-18, 0]) }]
  }))

  const animatedCardHeaderEntryStyle = useAnimatedStyle(() => ({
    opacity: cardHeaderEntry.value,
    transform: [{ translateY: interpolate(cardHeaderEntry.value, [0, 1], [-14, 0]) }]
  }))

  const animatedDividerEntryStyle = useAnimatedStyle(() => ({
    opacity: dividerEntry.value,
    transform: [{ translateY: interpolate(dividerEntry.value, [0, 1], [-10, 0]) }]
  }))

  const animatedInputEntryStyle = useAnimatedStyle(() => ({
    opacity: inputEntry.value,
    transform: [{ translateY: interpolate(inputEntry.value, [0, 1], [-12, 0]) }]
  }))

  const animatedBarcodeEntryStyle = useAnimatedStyle(() => ({
    opacity: interpolate(barcodeEntry.value, [0, 1], [0, 0.9]),
    transform: [{ translateY: interpolate(barcodeEntry.value, [0, 1], [-10, 0]) }]
  }))

  const animatedFooterEntryStyle = useAnimatedStyle(() => ({
    opacity: footerEntry.value,
    transform: [{ translateY: interpolate(footerEntry.value, [0, 1], [-16, 0]) }]
  }))

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        ['rgba(253, 253, 251, 0)', 'rgba(253, 253, 251, 0.85)']
      )
    }
  })

  useEffect(() => {
    let isMounted = true
    async function checkPreference() {
      try {
        const isComplete = await AsyncStorage.getItem(POST_LOGIN_SETUP_COMPLETE_KEY)
        if (isComplete === 'true') {
          router.replace('/(dashboard)' as never)
          return
        }
      } catch {
      } finally {
        if (isMounted) setIsCheckingPreference(false)
      }
    }
    checkPreference()
    return () => {
      isMounted = false
    }
  }, [router])

  async function completeAndGoHome(forceComplete: boolean = false) {
    try {
      if (dontShowAgain || forceComplete) await markPostLoginSetupComplete()
    } catch {
    } finally {
      router.replace('/(dashboard)' as never)
    }
  }

  async function handleExploreNow() {
    Keyboard.dismiss()
    handleInputBlur()
    await completeAndGoHome(false)
  }

  async function handleSyncDesign() {
    if (!canSync) return
    Keyboard.dismiss()
    handleInputBlur()
    await completeAndGoHome(false)
  }

  if (isCheckingPreference) return <View className='flex-1 bg-[#FDFDFB]' />

  return (
    <TouchableWithoutFeedback
      accessible={false}
      onPress={() => {
        Keyboard.dismiss()
        handleInputBlur()
      }}
    >
      <View className='flex-1 bg-[#FDFDFB]'>
        {/* Nền Gradient */}
        <LinearGradient
          colors={['#FDFDFB', '#F4F2EB', '#E9E4D8']}
          locations={[0, 0.6, 1]}
          className='absolute inset-0'
        />

        {/* Watermark Xoay */}
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

        <Animated.View pointerEvents='none' className='absolute inset-0 z-10' style={animatedBackdropStyle} />

        <SafeAreaView className='z-20 flex-1'>
          <View className='flex-1 justify-between px-6 pb-8 pt-6'>
            {/* --- TOP: BRANDING HEADER --- */}
            <Animated.View className='items-center' style={animatedHeaderEntryStyle}>
              <Flower color={THEME.ringAccent} size={16} strokeWidth={1.5} />
              <View className='my-2 h-6 w-[1px] bg-ring-primary/20' />
              <Text
                allowFontScaling={false}
                className='mb-2 font-sans-bold text-[10px] uppercase tracking-[0.3em] text-ring-accent'
              >
                Welcome
              </Text>
              <Text allowFontScaling={false} className='font-serif text-[40px] leading-[46px] text-ring-primary'>
                The Canvas
              </Text>
              <Text allowFontScaling={false} className='font-serif text-[40px] leading-[46px] text-ring-primary'>
                Awaits
              </Text>
              <Text
                allowFontScaling={false}
                className='mt-3 max-w-[280px] text-center font-sans text-[13px] leading-5 text-txt-muted'
              >
                Restore your previous vision, or step into the atelier to forge a new legacy.
              </Text>
            </Animated.View>

            {/* --- MIDDLE: THE SVG TICKET CARD --- */}
            <View className='flex-1 items-center justify-center'>
              <Animated.View
                className='relative w-full pb-8 pt-6 shadow-xl shadow-black/10'
                style={[{ shadowColor: THEME.ringPrimary }, animatedCardStyle]}
              >
                {/* --- MẶT NẠ SVG ĐỤC LỖ CHO CARD --- */}
                <View className='pointer-events-none absolute inset-0 z-0'>
                  <Svg width='100%' height='100%'>
                    <Defs>
                      <Mask id='syncTicketMask'>
                        {/* Phủ trắng nền bo góc (chỉ khoét 2 bên, không khoét góc) */}
                        <Rect width='100%' height='100%' rx={CORNER_RADIUS} fill='white' />

                        {/* Chỉ Khoét 2 lỗ bên hông tương ứng đường xé */}
                        {dividerY > 0 && (
                          <>
                            <Circle cx='0' cy={dividerY + 12} r={NOTCH_RADIUS} fill='black' />
                            <Circle cx='100%' cy={dividerY + 12} r={NOTCH_RADIUS} fill='black' />
                          </>
                        )}
                      </Mask>
                    </Defs>

                    {/* Lớp nền của thẻ Ticket (Bo góc tròn 24px) */}
                    <Rect width='100%' height='100%' rx={CORNER_RADIUS} fill='#FCFBF8' mask='url(#syncTicketMask)' />

                    {/* Viền ngoài của thẻ (Bo góc tròn 24px) */}
                    <Rect
                      width='100%'
                      height='100%'
                      rx={CORNER_RADIUS}
                      fill='none'
                      stroke={THEME.ringPrimary}
                      strokeOpacity='0.25'
                      strokeWidth='3'
                      mask='url(#syncTicketMask)'
                    />
                  </Svg>
                </View>

                {/* --- NỘI DUNG THẺ (NỬA TRÊN) --- */}
                <Animated.View className='relative z-10 px-6' style={animatedCardHeaderEntryStyle}>
                  <View className='flex-row items-center justify-between pb-2'>
                    <View>
                      <Text
                        allowFontScaling={false}
                        className='font-sans-bold text-[8px] uppercase tracking-[0.3em] text-ring-primary/40'
                      >
                        Design sync code
                      </Text>
                      <Text
                        allowFontScaling={false}
                        className='font-sans-medium mt-1 text-[12px] tracking-widest text-ring-primary'
                      >
                        FROM WEB
                      </Text>
                    </View>
                    <ScanLine color={THEME.ringAccent} size={24} strokeWidth={1.2} />
                  </View>
                </Animated.View>

                {/* --- ĐƯỜNG XÉ TICKET (Lấy toạ độ để khoét) --- */}
                <Animated.View
                  className='relative my-5 w-full justify-center px-6'
                  onLayout={(e) => setDividerY(e.nativeEvent.layout.y)}
                  style={animatedDividerEntryStyle}
                >
                  <View className='opacity-30'>
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
                </Animated.View>

                {/* --- NỘI DUNG THẺ (NỬA DƯỚI) --- */}
                <View className='relative z-10 px-6'>
                  <Animated.View
                    className='h-[56px] w-full flex-row items-center rounded-full border border-ring-primary/15 bg-white/90 pl-4 pr-1.5 shadow-sm shadow-ring-primary/5'
                    style={animatedInputEntryStyle}
                  >
                    <Link2 color={canSync ? THEME.ringAccent : 'rgba(182,155,122,0.45)'} size={18} strokeWidth={2} />

                    <TextInput
                      value={designCode}
                      onChangeText={setDesignCode}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      autoCapitalize='characters'
                      autoCorrect={false}
                      placeholder='BRG-2048'
                      placeholderTextColor='rgba(182, 155, 122, 0.4)'
                      returnKeyType='done'
                      onSubmitEditing={handleSyncDesign}
                      className='h-full flex-1 px-3 font-sans-bold text-[14px] uppercase tracking-[0.2em] text-ring-primary'
                    />

                    <Pressable
                      disabled={!canSync}
                      onPress={handleSyncDesign}
                      className={`h-[44px] items-center justify-center rounded-full px-6 transition-all ${
                        canSync ? 'bg-ring-primary' : 'bg-transparent'
                      }`}
                      style={({ pressed }) => [
                        { opacity: pressed && canSync ? 0.8 : 1 },
                        canSync && {
                          shadowColor: THEME.ringPrimary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                          elevation: 2
                        }
                      ]}
                    >
                      <Text
                        allowFontScaling={false}
                        className={`font-sans-bold text-[10px] uppercase tracking-wider ${
                          canSync ? 'text-white' : 'text-ring-primary/30'
                        }`}
                      >
                        Sync
                      </Text>
                    </Pressable>
                  </Animated.View>

                  {/* Mã vạch cao và đậm */}
                  <Animated.View className='mt-8 flex-row justify-center gap-[3px]' style={animatedBarcodeEntryStyle}>
                    {[...Array(22)].map((_, i) => (
                      <View
                        key={i}
                        className={`h-12 bg-ring-primary ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-[1.5px]'}`}
                      />
                    ))}
                  </Animated.View>
                </View>
              </Animated.View>
            </View>

            {/* --- BOTTOM: ALTERNATIVE & CHECKBOX --- */}
            <Animated.View className='items-center gap-8' style={animatedFooterEntryStyle}>
              <Pressable
                onPress={handleExploreNow}
                className='flex-row items-center border-b border-ring-primary/30 pb-1.5'
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <Text allowFontScaling={false} className='font-serif text-[18px] text-ring-primary'>
                  Start your design now
                </Text>
                <ArrowRight color={THEME.ringPrimary} size={16} strokeWidth={1.5} className='ml-3' />
              </Pressable>

              <Pressable
                accessibilityRole='checkbox'
                accessibilityState={{ checked: dontShowAgain }}
                onPress={() => setDontShowAgain((current) => !current)}
                className='flex-row items-center gap-2.5'
              >
                <View
                  className={`h-[14px] w-[14px] items-center justify-center rounded-[3px] border transition-colors ${
                    dontShowAgain ? 'border-ring-accent bg-ring-accent' : 'border-ring-primary/40 bg-transparent'
                  }`}
                >
                  {dontShowAgain && <Check color='#FFFFFF' size={10} strokeWidth={2.5} />}
                </View>
                <Text
                  allowFontScaling={false}
                  className='font-sans text-[11px] uppercase tracking-widest text-txt-muted'
                >
                  Hide this prologue next time
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  )
}

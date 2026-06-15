import { Fingerprint, Gem, PenTool } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { HOW_BIORING_WORKS_STEPS } from '@/constants/staticContent'
import { THEME } from '@/constants/theme'

const STEP_ICONS = {
  pen: PenTool,
  biometric: Fingerprint,
  gem: Gem
} as const

const CARD_STYLES = [
  {
    baseBg: 'bg-ring-surface',
    gradStart: THEME.ringAccent,
    startOpacity: 0.45,
    gradEnd: THEME.ringAccent,
    endOpacity: 0.05,
    borderColor: 'border-ring-accent/40',
    iconBg: 'bg-ring-accent/25',
    iconBorder: 'border-ring-accent/40',
    iconColor: THEME.ringPrimary,
    titleColor: 'text-ring-primary',
    descColor: 'text-txt-muted',
    watermarkColor: 'text-ring-accent/15',
    glow: 'bg-ring-accent/20'
  },
  {
    baseBg: 'bg-white',
    gradStart: THEME.ringPrimary,
    startOpacity: 0.08,
    gradEnd: THEME.ringPrimary,
    endOpacity: 0.01,
    borderColor: 'border-ring-primary/15',
    iconBg: 'bg-ring-primary/10',
    iconBorder: 'border-ring-primary/15',
    iconColor: THEME.ringPrimary,
    titleColor: 'text-ring-primary',
    descColor: 'text-txt-muted',
    watermarkColor: 'text-ring-primary/5',
    glow: 'bg-ring-primary/5'
  },
  {
    baseBg: 'bg-ring-secondary',
    gradStart: '#2A5165',
    startOpacity: 0.8,
    gradEnd: THEME.ringSecondary,
    endOpacity: 1,
    borderColor: 'border-ring-surface/10',
    iconBg: 'bg-ring-surface/10',
    iconBorder: 'border-ring-surface/20',
    iconColor: THEME.ringSurface,
    titleColor: 'text-ring-surface',
    descColor: 'text-ring-surface/70',
    watermarkColor: 'text-ring-primary/5',
    glow: 'bg-ring-primary/30'
  }
]

function BreathingIcon({
  icon: Icon,
  colorClass,
  borderClass,
  iconColor
}: {
  icon: any
  colorClass: string
  borderClass: string
  iconColor: string
}) {
  const pulse = useSharedValue(1)

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )
  }, [pulse])

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.3], [0.6, 0])
  }))

  return (
    <View className='relative h-12 w-12 items-center justify-center'>
      <Animated.View className={`absolute inset-0 rounded-full ${colorClass}`} style={haloStyle} />
      <View
        className={`absolute h-10 w-10 items-center justify-center rounded-full border-[0.5px] bg-ring-surface/80 ${borderClass}`}
      >
        <Icon color={iconColor} size={18} strokeWidth={1.2} />
      </View>
    </View>
  )
}

export function HowBioringWorks() {
  return (
    <View className='px-5 py-14'>
      <View className='mb-16 items-center'>
        <View className='mb-4 h-12 w-[1px] bg-ring-accent/40' />
        <Text className='font-sans-medium mb-2 text-[10px] uppercase tracking-[0.3em] text-ring-accent'>
          The Process
        </Text>
        <Text className='text-center font-serif text-[32px] leading-[40px] text-ring-primary'>
          Beginning of a{'\n'}Masterpiece
        </Text>
      </View>

      <View className='gap-14'>
        {HOW_BIORING_WORKS_STEPS.map((step, index) => {
          const stepNumber = `0${index + 1}`
          const isRightSide = index % 2 !== 0
          const styleConfig = CARD_STYLES[index % CARD_STYLES.length]

          return (
            <View key={step.id} className={`relative w-[85%] ${isRightSide ? 'self-end' : 'self-start'}`}>
              {/* CHUYỂN ĐỔI: Dùng z-[-1], leading-[130px] và -right-5/-left-5 thay vì style prop */}
              <Text
                className={`absolute -top-10 z-[-1] font-serif text-[120px] leading-[130px] ${styleConfig.watermarkColor} ${
                  isRightSide ? '-right-5' : '-left-5'
                }`}
              >
                {stepNumber}
              </Text>

              {/* CHUYỂN ĐỔI: Chuyển StyleSheet shadowLayer thành class của Tailwind */}
              <View className='elevation-2 rounded-[32px] bg-transparent shadow-sm shadow-black/5'>
                <View
                  className={`overflow-hidden rounded-[32px] border-[0.5px] ${styleConfig.baseBg} ${styleConfig.borderColor}`}
                >
                  {/* CHUYỂN ĐỔI: Thay StyleSheet.absoluteFill bằng absolute inset-0 */}
                  <View className='absolute inset-0'>
                    <Svg width='100%' height='100%'>
                      <Defs>
                        <LinearGradient id={`grad-${index}`} x1='0%' y1='0%' x2='100%' y2='150%'>
                          <Stop offset='0%' stopColor={styleConfig.gradStart} stopOpacity={styleConfig.startOpacity} />
                          <Stop offset='100%' stopColor={styleConfig.gradEnd} stopOpacity={styleConfig.endOpacity} />
                        </LinearGradient>
                      </Defs>
                      <Rect width='100%' height='100%' fill={`url(#grad-${index})`} />
                    </Svg>
                  </View>

                  <View className='relative z-10 p-6'>
                    <View className={`mb-6 flex-row items-center gap-3 ${isRightSide ? 'flex-row-reverse' : ''}`}>
                      <BreathingIcon
                        icon={STEP_ICONS[step.icon]}
                        colorClass={styleConfig.iconBg}
                        borderClass={styleConfig.iconBorder}
                        iconColor={styleConfig.iconColor}
                      />
                      <View className={isRightSide ? 'items-end' : 'items-start'}>
                        <Text className='font-sans-medium text-[9px] uppercase tracking-widest text-ring-accent/80'>
                          Phase {stepNumber}
                        </Text>
                      </View>
                    </View>

                    <Text
                      className={`mb-3 font-serif text-[22px] leading-8 ${styleConfig.titleColor} ${
                        isRightSide ? 'text-right' : 'text-left'
                      }`}
                    >
                      {step.title}
                    </Text>

                    <Text
                      className={`font-sans-light text-[14px] leading-6 ${styleConfig.descColor} ${
                        isRightSide ? 'text-right' : 'text-left'
                      }`}
                    >
                      {step.description}
                    </Text>
                  </View>
                </View>
              </View>

              {/* CHUYỂN ĐỔI: Thay style={{ zIndex: -2 }} bằng z-[-2] */}
              <View
                className={`absolute -bottom-8 z-[-2] h-32 w-32 rounded-full blur-3xl ${styleConfig.glow} ${
                  isRightSide ? '-left-8' : '-right-8'
                }`}
              />
            </View>
          )
        })}
      </View>
    </View>
  )
}

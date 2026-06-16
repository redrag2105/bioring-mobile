import { StudioFabButton } from '@/components/navigation/StudioFabButton'
import { TabBarButton } from '@/components/navigation/TabBarButton'
import { THEME } from '@/constants/theme'
import { useUIStore } from '@/hooks/useUIStore'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { CreditCard, Home, Package, UserRound } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Dimensions, Keyboard, Platform } from 'react-native'
import Animated, { useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'

const TAB_ICONS = {
  index: Home,
  memory: CreditCard,
  orders: Package,
  profile: UserRound
}

const { width: windowWidth } = Dimensions.get('window')
const AnimatedPath = Animated.createAnimatedComponent(Path)
const UI_BORDER = '#E6E4E0'

export function CustomBottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const isTabBarSticky = useUIStore((store) => store.isTabBarSticky)
  const insets = useSafeAreaInsets()
  const springConfig = { damping: 14, stiffness: 90, mass: 0.8 }

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true))
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false))

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const wrapperAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isKeyboardVisible ? 0 : 1, { duration: 200 }),
    paddingBottom: withSpring(isTabBarSticky ? 0 : Math.max(insets.bottom - 15, 12), springConfig),
    paddingHorizontal: withSpring(isTabBarSticky ? 0 : 20, springConfig),
    transform: [{ translateY: withTiming(isKeyboardVisible ? 100 : 0, { duration: 200 }) }]
  }))

  const animatedPaddingTop = useDerivedValue(() => withSpring(isTabBarSticky ? 10 : 8, springConfig))
  const animatedPaddingBottom = useDerivedValue(() => withSpring(isTabBarSticky ? Math.max(insets.bottom - 16, 4) : 8, springConfig))
  const animatedContentHeight = useDerivedValue(() => withSpring(isTabBarSticky ? 50 : 70, springConfig)) // 50 = icon(42) + pt(8); 70 = icon(42) + pt(8) + mt(4) + text(16)

  const animatedHeight = useDerivedValue(() => animatedPaddingTop.value + animatedContentHeight.value + animatedPaddingBottom.value)

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    paddingBottom: animatedPaddingBottom.value,
    paddingTop: animatedPaddingTop.value
  }))

  const pillWidth = useSharedValue(windowWidth - 40)
  const animatedRadius = useDerivedValue(() => withSpring(isTabBarSticky ? 0 : 28, springConfig))

  const animatedProps = useAnimatedProps(() => {
    const w = pillWidth.value
    const h = animatedHeight.value
    const r = animatedRadius.value

    const cx = w / 2
    const fabCenterY = animatedPaddingTop.value + 6
    const R = 38 // Gap radius
    const rs = 10 // Shoulder radius

    const dy = fabCenterY - rs
    const dx2 = (R + rs) * (R + rs) - dy * dy
    let d = ''

    if (dx2 > 0) {
      const dx = Math.sqrt(dx2)
      const xsLeft = cx - dx
      const xsRight = cx + dx

      const ratio = rs / (R + rs)
      const txLeft = xsLeft + dx * ratio
      const tyLeft = rs + dy * ratio

      const txRight = xsRight - dx * ratio
      const tyRight = rs + dy * ratio

      if (r > 0) {
        d = `
          M ${r} 0
          L ${xsLeft} 0
          A ${rs} ${rs} 0 0 1 ${txLeft} ${tyLeft}
          A ${R} ${R} 0 0 0 ${txRight} ${tyRight}
          A ${rs} ${rs} 0 0 1 ${xsRight} 0
          L ${w - r} 0
          A ${r} ${r} 0 0 1 ${w} ${r}
          L ${w} ${h - r}
          A ${r} ${r} 0 0 1 ${w - r} ${h}
          L ${r} ${h}
          A ${r} ${r} 0 0 1 0 ${h - r}
          L 0 ${r}
          A ${r} ${r} 0 0 1 ${r} 0
          Z
        `
      } else {
        d = `
          M 0 0
          L ${xsLeft} 0
          A ${rs} ${rs} 0 0 1 ${txLeft} ${tyLeft}
          A ${R} ${R} 0 0 0 ${txRight} ${tyRight}
          A ${rs} ${rs} 0 0 1 ${xsRight} 0
          L ${w} 0
          L ${w} ${h}
          L 0 ${h}
          Z
        `
      }
    } else {
      // Fallback if math fails (should not happen)
      d = r > 0
        ? `M ${r} 0 L ${w - r} 0 A ${r} ${r} 0 0 1 ${w} ${r} L ${w} ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} L ${r} ${h} A ${r} ${r} 0 0 1 0 ${h - r} L 0 ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`
        : `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`
    }
    return { d }
  })

  return (
    <Animated.View
      className='absolute bottom-0 left-0 right-0 items-center'
      pointerEvents={isKeyboardVisible ? 'none' : 'auto'}
      style={wrapperAnimatedStyle}
    >
      <Animated.View
        onLayout={(e) => {
          pillWidth.value = e.nativeEvent.layout.width
        }}
        className='w-full flex-row justify-between px-1.5 shadow-tab-bar elevation-12'
        style={pillAnimatedStyle}
      >
        <Svg style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'visible' }}>
          <AnimatedPath
            animatedProps={animatedProps}
            fill={THEME.ringSurface}
            stroke={UI_BORDER}
            strokeWidth={1}
          />
        </Svg>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const focused = state.index === index
          const label = String(options.title ?? route.name)

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          if (route.name === 'studio') {
            return <StudioFabButton key={route.key} focused={focused} isSticky={isTabBarSticky} onPress={onPress} />
          }

          const Icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS]

          if (!Icon) {
            return null
          }

          return (
            <TabBarButton
              key={route.key}
              label={label}
              focused={focused}
              icon={Icon}
              isSticky={isTabBarSticky}
              onPress={onPress}
            />
          )
        })}
      </Animated.View>
    </Animated.View>
  )
}

import { StudioFabButton } from '@/components/navigation/StudioFabButton'
import { TabBarButton } from '@/components/navigation/TabBarButton'
import { useUIStore } from '@/hooks/useUIStore'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { CreditCard, Home, Package, UserRound } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TAB_ICONS = {
  index: Home,
  memory: CreditCard,
  orders: Package,
  profile: UserRound
}

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
    paddingBottom: withSpring(isTabBarSticky ? 0 : Math.max(insets.bottom, 10), springConfig),
    paddingHorizontal: withSpring(isTabBarSticky ? 0 : 20, springConfig),
    transform: [{ translateY: withTiming(isKeyboardVisible ? 100 : 0, { duration: 200 }) }]
  }))

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: withSpring(isTabBarSticky ? 0 : 28, springConfig),
    minHeight: withSpring(isTabBarSticky ? 58 : 76, springConfig),
    paddingBottom: withSpring(isTabBarSticky ? Math.max(insets.bottom - 16, 4) : 8, springConfig),
    paddingTop: withSpring(isTabBarSticky ? 10 : 8, springConfig)
  }))

  return (
    <Animated.View
      className='absolute bottom-0 left-0 right-0 items-center'
      pointerEvents={isKeyboardVisible ? 'none' : 'auto'}
      style={wrapperAnimatedStyle}
    >
      <Animated.View
        className={`w-full flex-row items-center justify-between border border-ui-border bg-ring-surface px-1.5 shadow-tab-bar elevation-12 ${
          isTabBarSticky ? 'border-x-0 border-b-0' : ''
        }`}
        style={pillAnimatedStyle}
      >
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

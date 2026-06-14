import type { LucideIcon } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'

type TabBarButtonProps = {
  label: string
  focused: boolean
  icon: LucideIcon
  isSticky: boolean
  onPress: () => void
}

export function TabBarButton({ label, focused, icon: Icon, isSticky, onPress }: TabBarButtonProps) {
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(focused ? 1.08 : 1, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        })
      }
    ],
  }))

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    }),
    transform: [
      {
        scale: withTiming(focused ? 1 : 0.6, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        })
      },
    ]
  }))

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isSticky ? 0 : 16, { duration: 200, easing: Easing.out(Easing.cubic) }),
    marginTop: withTiming(isSticky ? 0 : 4, { duration: 200, easing: Easing.out(Easing.cubic) }),
    opacity: withTiming(isSticky ? 0 : focused ? 1 : 0.6, { duration: 250, easing: Easing.out(Easing.cubic) }),
    transform: [{ translateY: withTiming(focused ? 0 : 2, { duration: 200, easing: Easing.out(Easing.cubic) }) }]
  }))

  return (
    <TouchableOpacity
      className={`flex-1 items-center justify-center ${isSticky ? 'py-0.5' : 'py-1'}`}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View className='items-center justify-center h-[42px] w-[42px]'>
        <Animated.View
          className='absolute inset-0 rounded-2xl bg-ring-accent/15'
          style={pillAnimatedStyle}
        />

        <Animated.View style={iconAnimatedStyle}>
          <Icon
            size={22}
            color={focused ? '#B69B7A' : undefined}
            className={focused ? undefined : 'text-txt-muted'}
            strokeWidth={focused ? 1.8 : 1.4}
          />
        </Animated.View>
      </View>

      <Animated.View style={labelAnimatedStyle} className='overflow-hidden items-center'>
        <Text
          className={`font-sans-medium text-[10px] tracking-wide ${focused ? 'text-ring-accent' : 'text-txt-muted'}`}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  )
}
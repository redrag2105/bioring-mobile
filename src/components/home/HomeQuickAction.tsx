import { HOME_QUICK_ACTION } from '@/constants/staticContent'
import { THEME } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { Paintbrush } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

export function HomeQuickAction() {
  const router = useRouter()
  // Shared value để điều khiển hiệu ứng Scale
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.95) // Nút co nhẹ khi chạm
  }

  const handlePressOut = () => {
    scale.value = withSpring(1) // Nút bung ra khi thả tay
  }

  return (
    <View className='mx-5 my-12 items-center justify-center'>
      <View className='mb-10 items-center'>
        <Text className='font-sans-medium mb-3 text-[10px] uppercase tracking-[0.3em] text-ring-accent'>
          {HOME_QUICK_ACTION.eyebrow}
        </Text>
        <Text className='text-center font-serif text-[34px] leading-[42px] text-ring-primary'>
          {HOME_QUICK_ACTION.title}
        </Text>
        <Text className='font-sans-light mt-4 max-w-[280px] text-center text-[15px] leading-6 text-txt-muted'>
          {HOME_QUICK_ACTION.description}
        </Text>
      </View>

      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={() => router.push('/(dashboard)/studio' as never)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className='flex-row items-center gap-3 rounded-full border border-ring-primary/20 bg-white px-8 py-4 shadow-2xl shadow-ring-primary/20'
        >
          {/* Icon lấp lánh */}
          <Paintbrush color={THEME.ringAccent} size={16} />

          {/* Label */}
          <Text className='font-sans-bold text-[12px] uppercase tracking-[0.2em] text-ring-primary'>
            {HOME_QUICK_ACTION.ctaLabel}
          </Text>
        </Pressable>
      </Animated.View>

      <View className='mt-12 h-[0.5px] w-full bg-ring-primary/5' />
    </View>
  )
}

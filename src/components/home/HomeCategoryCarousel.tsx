import { useRouter } from 'expo-router'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'

import type { CategoryType } from '@/types/home.types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const CARD_WIDTH = 142
const CARD_GAP = 14

const CARD_THEMES = [
  {
    card: 'border-ui-border bg-ring-surface',
    count: 'text-txt-muted',
    title: 'text-ring-primary',
    accent: 'text-ring-accent',
    halo: 'bg-ring-accent/10',
    footer: 'border-ring-accent/20'
  },
  {
    card: 'border-ring-primary/10 bg-ring-primary',
    count: 'text-ring-surface/60',
    title: 'text-ring-surface',
    accent: 'text-ring-accent',
    halo: 'bg-ring-surface/10',
    footer: 'border-ring-surface/15'
  },
  {
    card: 'border-ring-accent/20 bg-ring-accent/[0.03]',
    count: 'text-txt-muted',
    title: 'text-ring-primary',
    accent: 'text-ring-accent',
    halo: 'bg-ring-primary/5',
    footer: 'border-ring-accent/20'
  }
] as const

function CategoryCard({ category, index }: { category: CategoryType; index: number }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length]
  const pressed = useSharedValue(0)

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * 0.03, { damping: 20, stiffness: 200 }) }]
  }))

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(pressed.value ? -8 : 0, { duration: 400, easing: Easing.out(Easing.exp) }) },
      { scale: withTiming(pressed.value ? 1.08 : 1, { duration: 400, easing: Easing.out(Easing.exp) }) },
      { rotate: `${interpolate(pressed.value, [0, 1], [0, -4])}deg` }
    ]
  }))

  return (
    <AnimatedPressable
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      style={cardAnimatedStyle}
    >
      <View
        // Đã điều chỉnh card primary nhạt hơn một chút (opacity 90)
        className={`elevation-2 h-[218px] w-[142px] justify-between overflow-hidden rounded-[22px] border-[0.5px] p-4 shadow-sm shadow-black/5 ${theme.card.replace('bg-ring-primary', 'bg-ring-primary/90')}`}
      >
        <View className='z-10 flex-row justify-end'>
          <Text className={`font-sans-bold text-[8px] uppercase tracking-[0.18em] ${theme.count}`}>
            {category.productCount} Designs
          </Text>
        </View>

        <View className='relative mt-3 items-center justify-center'>
          <View className={`absolute h-24 w-24 rounded-full ${theme.halo}`} />
          <Animated.View className='z-10 h-[104px] w-[104px]' style={imageAnimatedStyle}>
            <Image source={{ uri: category.thumbnail_url }} resizeMode='contain' className='h-full w-full' />
          </Animated.View>
        </View>

        <View className={`z-10 mt-auto flex-row items-end justify-between border-t-[0.5px] pt-3 ${theme.footer}`}>
          <Text className={`flex-1 pr-2 font-serif text-[17px] leading-6 ${theme.title}`} numberOfLines={2}>
            {category.name}
          </Text>

          {/* Đã bỏ nền và border của dấu + */}
          <View className='h-6 items-center justify-center'>
            <Text className={`font-sans-bold text-lg leading-5 ${theme.accent}`}>+</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  )
}

export function HomeCategorySection({ categories }: { categories: CategoryType[] }) {
  const router = useRouter()

  return (
    <View className='gap-5 py-2'>
      <View>
        <Text className='mb-2 font-sans-bold text-[9px] uppercase tracking-[0.2em] text-ring-accent'>Discover</Text>
        <View className='flex-row items-end justify-between'>
          <Text className='font-serif text-3xl text-ring-primary'>Collections</Text>
          <Pressable onPress={() => router.push('/collections' as never)}>
            <Text className='pb-1 font-sans-bold text-xs text-txt-muted underline decoration-txt-muted/30'>
              See All
            </Text>
          </Pressable>
        </View>
        <View className='mt-4 h-[1px] w-12 bg-ring-accent/40' />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate='fast'
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment='start'
        className='-mr-5 overflow-visible'
        contentContainerClassName='gap-3.5 pb-4 pr-10'
      >
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </ScrollView>
    </View>
  )
}

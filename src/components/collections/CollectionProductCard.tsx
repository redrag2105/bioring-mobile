import { useRouter } from 'expo-router'
import { Image, Pressable, Text, View } from 'react-native'
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import type { CollectionProduct } from '@/types/collection.types'
import { formatPrice } from '@/utils/formatPrice'

type CollectionProductCardProps = {
  product: CollectionProduct
  index?: number
  isDimmed?: boolean
}

export function CollectionProductCard({ product, index = 0, isDimmed = false }: CollectionProductCardProps) {
  const router = useRouter()
  const pressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDimmed ? 0.35 : 1, { duration: 180 }),
      transform: [
        {
          scale: withTiming(pressed.value ? 0.97 : 1, {
            duration: 400,
            easing: Easing.out(Easing.cubic)
          })
        }
      ]
    }
  })

  const handlePress = () => {
    router.push({
      pathname: '/product/[productId]',
      params: { productId: product.id }
    })
  }

  return (
    <Animated.View
      entering={FadeIn.delay(Math.min(index, 10) * 100)
        .duration(800)
        .easing(Easing.out(Easing.exp))}
      className='w-full'
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          className='group w-full'
          disabled={isDimmed}
          onPress={handlePress}
          onPressIn={() => (pressed.value = 1)}
          onPressOut={() => (pressed.value = 0)}
        >
          <View className='elevation-2 aspect-[4/5] w-full overflow-hidden rounded-[32px] border-[0.5px] border-ring-primary/5 bg-white shadow-sm shadow-black/5'>
            <Image
              source={{ uri: product.thumbnail_url }}
              resizeMode='cover'
              className='h-full w-full'
              accessibilityIgnoresInvertColors
            />
          </View>

          <View className='px-1 pt-5'>
            <Text
              className='mb-1.5 font-serif text-[16px] leading-[22px] text-ring-primary'
              numberOfLines={2}
              allowFontScaling={false}
            >
              {product.name}
            </Text>
            <Text
              className='font-sans-bold text-[11px] uppercase tracking-widest text-ring-accent'
              allowFontScaling={false}
            >
              {formatPrice(product.base_price)}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

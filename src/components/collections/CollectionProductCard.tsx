import { Image, Pressable, Text, View } from 'react-native'
import Animated, { FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated'

import type { CollectionProduct } from '@/types/collection.types'
import { formatPrice } from '@/utils/formatPrice'

type CollectionProductCardProps = {
  product: CollectionProduct
  index?: number
  isDimmed?: boolean
}

export function CollectionProductCard({ product, index = 0, isDimmed = false }: CollectionProductCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDimmed ? 0.35 : 1, { duration: 180 }),
      transform: [{ scale: withTiming(isDimmed ? 0.99 : 1, { duration: 180 }) }]
    }
  })

  return (
    <Animated.View
      entering={FadeIn.delay(Math.min(index, 6) * 24).duration(180)}
      className='mb-8 w-[48%]'
      style={animatedStyle}
    >
      <Pressable className='group w-full' disabled={isDimmed}>
        <View className='aspect-[4/5] w-full overflow-hidden bg-ring-surface'>
          <Image
            source={{ uri: product.thumbnail_url }}
            resizeMode='cover'
            className='h-full w-full'
            accessibilityIgnoresInvertColors
          />
        </View>

        <View className='pt-4'>
          <Text
            className='mb-1 font-serif-medium text-[15px] leading-5 text-ring-primary'
            numberOfLines={2}
            allowFontScaling={false}
          >
            {product.name}
          </Text>
          <Text className='font-sans-light text-[13px] tracking-widest text-ring-primary/60' allowFontScaling={false}>
            {formatPrice(product.base_price)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

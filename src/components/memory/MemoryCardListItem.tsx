import { ChevronRight, Fingerprint } from 'lucide-react-native'
import { Image, Pressable, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import { THEME } from '@/constants/theme'
import type { MemoryCard } from '@/types/memory.types'

type MemoryCardListItemProps = {
  memoryCard: MemoryCard
  onPress?: () => void
  index?: number
}

export function MemoryCardListItem({ memoryCard, onPress, index = 0 }: MemoryCardListItemProps) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <Pressable
        onPress={onPress}
        className='mb-4 flex-row items-center rounded-3xl border border-ring-accent/10 bg-ring-surface p-4 shadow-sm'
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        {/* --- 1. KHU VỰC HÌNH ẢNH --- */}
        {/* pointerEvents='none' giúp mảng này không chặn thao tác bấm của người dùng */}
        <View pointerEvents='none' className='h-20 w-20 items-center justify-center rounded-2xl bg-ring-background/80'>
          <Image
            source={{ uri: memoryCard.ringImageUrl }}
            resizeMode='contain'
            className='h-16 w-16'
            accessibilityIgnoresInvertColors
          />
        </View>

        {/* --- 2. KHU VỰC THÔNG TIN --- */}
        <View pointerEvents='none' className='ml-4 flex-1 justify-center'>
          {/* Label */}
          <View className='mb-1.5 flex-row items-center gap-1.5'>
            <Fingerprint color={THEME.ringAccent} size={12} strokeWidth={2} />
            <Text
              allowFontScaling={false}
              className='font-sans-bold text-[9px] uppercase tracking-widest text-ring-accent'
            >
              Bio-Encrypted
            </Text>
          </View>

          {/* Tên Nhẫn */}
          <Text allowFontScaling={false} numberOfLines={1} className='font-serif text-lg text-ring-primary'>
            {memoryCard.productName}
          </Text>

          {/* Ngày kích hoạt */}
          <Text allowFontScaling={false} className='mt-1 font-sans text-xs text-ring-primary/50'>
            Sync: {memoryCard.activatedAt}
          </Text>
        </View>

        {/* --- 3. KHU VỰC ĐIỀU HƯỚNG --- */}
        <View
          pointerEvents='none'
          className='ml-2 h-10 w-10 items-center justify-center rounded-full bg-ring-background'
        >
          <ChevronRight color={THEME.ringAccent} size={18} strokeWidth={1.5} />
        </View>
      </Pressable>
    </Animated.View>
  )
}

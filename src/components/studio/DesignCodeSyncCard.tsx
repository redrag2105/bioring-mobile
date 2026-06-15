import { Link2 } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { STUDIO_SYNC_CONTENT } from '@/constants/staticContent'
import { THEME } from '@/constants/theme'

export function DesignCodeSyncCard() {
  const [designCode, setDesignCode] = useState('')
  const isReadyToSync = designCode.trim().length > 0

  // Animation cho icon sync
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.9)
  }
  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  return (
    // Giảm gap xuống 3 để text và input gần nhau hơn, tạo tính liên kết
    <View className='gap-3 p-2'>
      {/* Header */}
      <View className='px-1'>
        <Text className='font-sans-medium text-[9px] uppercase tracking-[0.3em] text-ring-accent/70'>
          {STUDIO_SYNC_CONTENT.eyebrow}
        </Text>
        <Text className='mt-1 font-serif text-[20px] text-ring-primary'>{STUDIO_SYNC_CONTENT.title}</Text>
      </View>

      {/* Input & Integrated Sync Button */}
      {/* Đưa h-14 lên container bọc ngoài, dùng overflow-hidden để cắt góc mượt mà */}
      <View className='h-14 flex-row items-center overflow-hidden rounded-2xl border border-ring-primary/10 bg-white/60'>
        <TextInput
          value={designCode}
          onChangeText={setDesignCode}
          autoCapitalize='characters'
          autoCorrect={false}
          placeholder={STUDIO_SYNC_CONTENT.placeholder}
          placeholderTextColor='rgba(212, 175, 55, 0.4)'
          // Input kéo giãn phần còn lại, full chiều cao
          className='h-full flex-1 px-4 font-sans-bold text-[15px] uppercase tracking-[0.2em] text-ring-primary'
        />

        {/* Nút bấm ôm trọn viền phải */}
        <Animated.View style={[animatedStyle, { height: '100%' }]}>
          <Pressable
            disabled={!isReadyToSync}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            // Thay vì bo tròn, cho nút cao bằng input (h-full) với padding ngang (px-5)
            className={`h-full items-center justify-center px-5 ${
              isReadyToSync ? 'bg-ring-accent/15' : 'bg-transparent'
            }`}
          >
            <Link2 color={isReadyToSync ? THEME.ringAccent : '#94A3B8'} size={20} />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  )
}

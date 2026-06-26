import { ArrowLeft } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { FONTS, THEME } from '@/constants/theme'

type Props = {
  onBack: () => void
  animatedStyle: object
}

export function ProductDetailHeader({ onBack, animatedStyle }: Props) {
  return (
    <Animated.View style={animatedStyle} className='z-30 flex-row items-center justify-between px-6 pb-2 pt-2'>
      <Pressable
        onPress={onBack}
        className='h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 bg-white/5 active:opacity-70'
      >
        <ArrowLeft color={THEME.ringSurface} size={18} strokeWidth={1} />
      </Pressable>
      <Text
        allowFontScaling={false}
        style={{ fontFamily: FONTS.serif }}
        className='text-[14px] uppercase tracking-[0.3em] text-white/80'
      >
        BIORING
      </Text>
      <View className='h-10 w-10' />
    </Animated.View>
  )
}

import { BackButton } from '@/components/navigation/BackButton'
import { Text, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { FONTS } from '@/constants/theme'

type Props = {
  onBack: () => void
  animatedStyle: object
}

export function ProductDetailHeader({ onBack, animatedStyle }: Props) {
  return (
    <Animated.View style={animatedStyle} className='z-30 flex-row items-center justify-between px-6 pb-2 pt-2'>
      <BackButton onPress={onBack} variant='dark' />
      <Text
        allowFontScaling={false}
        style={{ fontFamily: FONTS.serif }}
        className='text-[14px] uppercase tracking-[0.3em] text-white/80'
      >
        BIORING
      </Text>
      <View className='h-9 w-9' />
    </Animated.View>
  )
}

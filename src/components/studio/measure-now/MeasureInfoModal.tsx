import { THEME } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { X } from 'lucide-react-native'
import { Modal, Pressable, Text, View } from 'react-native'

type MeasureInfoModalProps = {
  visible: boolean
  title: string
  description: string
  onClose: () => void
}

export function MeasureInfoModal({ visible, title, description, onClose }: MeasureInfoModalProps) {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <View className='flex-1 justify-center bg-ring-secondary/60 px-5'>
        <View className='overflow-hidden rounded-[28px] border border-ring-accent/20 shadow-2xl shadow-ring-secondary/20'>
          <LinearGradient
            colors={['#FFFFFF', '#F7F5EF', '#EEF3EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className='absolute inset-0'
          />
          <View className='gap-5 p-5'>
            <View className='flex-row items-start justify-between gap-4'>
              <View className='flex-1'>
                <Text
                  allowFontScaling={false}
                  className='font-sans-bold text-[10px] uppercase tracking-[0.22em] text-ring-accent'
                >
                  Accuracy Tip
                </Text>
                <Text allowFontScaling={false} className='mt-2 font-serif text-[26px] leading-8 text-ring-primary'>
                  {title}
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className='h-10 w-10 items-center justify-center rounded-full bg-ring-background'
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <X color={THEME.ringPrimary} size={18} strokeWidth={1.8} />
              </Pressable>
            </View>

            <Text allowFontScaling={false} className='font-sans text-sm leading-6 text-txt-body'>
              {description}
            </Text>

            <Pressable
              onPress={onClose}
              className='h-12 items-center justify-center rounded-full bg-ring-primary'
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Text
                allowFontScaling={false}
                className='font-sans-bold text-xs uppercase tracking-wider text-txt-inverse'
              >
                Got it
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

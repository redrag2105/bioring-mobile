import { PosterCanvas } from '@/components/ring-studio/poster-design/PosterCanvas'
import { POSTER_TEMPLATES } from '@/constants/posterTemplates'
import { THEME } from '@/constants/theme'
import type { MemoryCard } from '@/types/memory.types'
import { LinearGradient } from 'expo-linear-gradient'
import { Fingerprint, RefreshCcw, X } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

type MemoryPosterCatalogItemProps = {
  memoryCard: MemoryCard
  index: number
  onPress?: () => void
}

export function MemoryPosterCatalogItem({ memoryCard, index, onPress }: MemoryPosterCatalogItemProps) {
  const template = POSTER_TEMPLATES.find((item) => item.id === memoryCard.templateId) ?? POSTER_TEMPLATES[0]
  const isOffset = index % 2 === 1

  const isFlipped = useSharedValue(0)

  const flipToBack = () => {
    isFlipped.value = withSpring(1, { damping: 18, stiffness: 90 })
  }

  const flipToFront = () => {
    isFlipped.value = withSpring(0, { damping: 18, stiffness: 90 })
  }

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [0, 180])
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
      zIndex: isFlipped.value < 0.5 ? 1 : 0
    }
  })

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [180, 360])
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: isFlipped.value > 0.5 ? 1 : 0
    }
  })

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .duration(600)
        .springify()}
      className='w-[48%]'
      style={{ marginTop: isOffset ? 40 : index > 1 ? 16 : 0 }}
    >
      <View className='relative pb-6'>
        {/* ==============================================================
            MẶT TRƯỚC: POSTER CANVAS
        ============================================================== */}
        <Animated.View style={frontAnimatedStyle}>
          <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
              opacity: pressed ? 0.95 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            <View className='relative rounded-[3px] border border-ring-primary/5 bg-[#FDFCFB] p-2 pb-2 shadow-2xl shadow-ring-primary/15'>
              <View className='absolute -top-2 left-1/2 z-30 h-4 w-11 -translate-x-1/2 -rotate-3 border border-white/50 bg-[#EFEBE4]/90 shadow-sm shadow-ring-primary/10' />

              <View className='relative z-10 overflow-hidden border border-ring-primary/10 bg-[#F4F1EB]'>
                <LinearGradient
                  colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.1)']}
                  locations={[0, 0.4, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className='absolute inset-0 z-10'
                  pointerEvents='none'
                />

                <View className='absolute right-1.5 top-1.5 z-20 overflow-hidden rounded-[2px] border border-white/60 bg-white/70 px-1.5 py-[3px] backdrop-blur-md'>
                  <Text
                    allowFontScaling={false}
                    className='font-sans-bold text-[5.5px] uppercase tracking-[0.25em] text-ring-primary/80'
                  >
                    Exh. {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>

                {/* ==============================================================
                    ULTRA-MINIMAL FLIP HINT (Mặt trước - Dấu flip in chìm, sát down)
                ============================================================== */}
                <Pressable
                  onPress={flipToBack}
                  hitSlop={{ top: 25, left: 25, right: 15, bottom: 15 }}
                  className='absolute bottom-0 right-1 z-50 p-1'
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.2 : 0.4,
                    transform: [{ scale: pressed ? 0.85 : 1 }]
                  })}
                >
                  <RefreshCcw size={12} color={THEME.ringPrimary} strokeWidth={1.5} />
                </Pressable>

                <View className='shadow-inner'>
                  <PosterCanvas template={template} previewMode draftOverride={memoryCard.posterDraft} />
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* ==============================================================
            MẶT SAU: THÔNG TIN LƯU TRỮ (ARCHIVAL RECORD)
        ============================================================== */}
        <Animated.View style={backAnimatedStyle}>
          <Pressable onPress={flipToFront} className='h-full w-full'>
            <View className='relative h-full w-full items-center justify-center overflow-hidden rounded-[3px] border border-ring-primary/10 bg-[#F4F1EB] p-3 shadow-2xl shadow-ring-primary/15'>
              {/* ==============================================================
                  ULTRA-MINIMAL CLOSE HINT (Mặt sau - Dấu X in chìm)
              ============================================================== */}
              <View className='absolute right-1.5 top-1.5 z-50 p-2 opacity-30'>
                <X size={12} color={THEME.ringPrimary} strokeWidth={1.5} />
              </View>

              <View className='absolute opacity-[0.03]'>
                <Fingerprint color={THEME.ringPrimary} size={140} strokeWidth={1} />
              </View>

              <View className='z-10 w-full items-center'>
                <Text
                  allowFontScaling={false}
                  className='mb-3 font-sans-bold text-[6px] uppercase tracking-[0.4em] text-ring-accent'
                >
                  Archival Record
                </Text>

                <Text
                  allowFontScaling={false}
                  numberOfLines={3}
                  className='text-center font-serif text-[18px] leading-[22px] text-ring-primary'
                >
                  {template.name}
                </Text>

                <View className='my-4 h-[1px] w-8 bg-ring-primary/20' />

                <Text
                  allowFontScaling={false}
                  className='mb-6 font-sans text-[8px] uppercase tracking-[0.25em] text-ring-primary/50'
                >
                  {memoryCard.activatedAt}
                </Text>

                <View className='w-[90%] items-center border border-ring-primary/10 bg-white/40 p-2.5'>
                  <Fingerprint color={THEME.ringAccent} size={14} strokeWidth={1.5} className='mb-1.5' />
                  <Text
                    allowFontScaling={false}
                    className='font-sans-bold text-[6.5px] uppercase tracking-[0.2em] text-ring-primary/60'
                  >
                    Verified Origin
                  </Text>
                  <Text
                    allowFontScaling={false}
                    className='mt-1 font-sans text-[6px] uppercase tracking-[0.2em] text-ring-primary/40'
                  >
                    ID • {memoryCard.archivalId}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  )
}

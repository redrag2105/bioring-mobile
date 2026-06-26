import { POSTER_TEMPLATES } from '@/constants/posterTemplates'
import { THEME } from '@/constants/theme'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import type { MemoryCardDraft } from '@/types/ring-studio.types'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import { PosterCanvas } from './PosterCanvas'

function createSampleDraft(templateId: string): MemoryCardDraft {
  return {
    templateId,
    cardTitle: templateId === 'minimalist-photo-bottom' ? 'A & N' : 'Our Keepsake',
    secretMessage: 'A quiet record of one promise, one rhythm, and one small forever.',
    dateLabel: 'June 19, 2026',
    reuseSoundWaveVoice: true,
    userPhotoUri: undefined,
    userPhotoOffset: { x: 0, y: 0 },
    userPhotoScale: 1
  }
}

// -------------------------------------------------------------
// COMPONENT: Breathing Swipe Hint (Chữ Swipe đập nhịp nhàng)
// -------------------------------------------------------------
function BreathingSwipeHint() {
  const translateX = useSharedValue(0)

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(4, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }))

  return (
    <Animated.View style={style} className='flex-row items-center gap-1.5 pl-3'>
      <ArrowRight color={THEME.ringPrimary} size={10} strokeWidth={1.5} />
    </Animated.View>
  )
}

// -------------------------------------------------------------
// COMPONENT: Animated Poster Card (Hiệu ứng chìm mềm mại)
// -------------------------------------------------------------
function AnimatedPosterCard({ template, index, layout, scrollX, layoutWidth, openTemplate }: any) {
  const posterStyle = useAnimatedStyle(() => {
    if (layoutWidth.value === 0) return {}

    const position = (scrollX.value - index * layoutWidth.value) / layoutWidth.value

    // Hiệu ứng "Editorial Fade": Thu nhỏ cực êm, hơi nâng nhẹ lên và mờ đi
    const translateY = interpolate(Math.abs(position), [0, 1], [0, -12], Extrapolation.CLAMP)
    const scale = interpolate(Math.abs(position), [0, 1], [1, 0.94], Extrapolation.CLAMP)
    const opacity = interpolate(Math.abs(position), [0, 0.8, 1], [1, 0.4, 0], Extrapolation.CLAMP)

    return {
      opacity,
      transform: [{ translateY }, { scale }]
    }
  })

  return (
    <View className='justify-center px-6' style={{ width: layout.width, height: layout.height }}>
      <Animated.View style={posterStyle} className='relative'>
        {/* Tem số thứ tự giữ nguyên ở góc */}
        <View pointerEvents='none' className='absolute -left-2 top-6 z-20 bg-ring-primary px-3 py-1.5 shadow-sm'>
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.25em] text-white'>
            {String(index + 1).padStart(2, '0')}
          </Text>
        </View>

        <Pressable onPress={() => openTemplate(template.id)} className='active:opacity-95'>
          <View className='bg-white/40 p-3 shadow-2xl shadow-ring-primary/5'>
            <LinearGradient colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.5)']} className='absolute inset-0' />
            <View className='border border-ring-primary/5 bg-[#FBF7F0] p-3'>
              <PosterCanvas template={template} previewMode draftOverride={createSampleDraft(template.id)} />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  )
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export function PosterTemplateGallery() {
  const router = useRouter()
  const updateMemoryCard = useRingDesignStore((state) => state.updateMemoryCard)

  const [layout, setLayout] = useState({ width: 0, height: 0 })
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollX = useSharedValue(0)
  const layoutWidth = useSharedValue(0)
  const lastIndex = useSharedValue(0)

  const openTemplate = (templateId: string) => {
    updateMemoryCard({ templateId })
    router.push('/(screens)/poster-design-editor' as never)
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
      const currentIndex = Math.round(event.contentOffset.x / event.layoutMeasurement.width)

      if (currentIndex !== lastIndex.value && currentIndex >= 0 && currentIndex < POSTER_TEMPLATES.length) {
        lastIndex.value = currentIndex
        runOnJS(setActiveIndex)(currentIndex)
      }
    }
  })

  // 1. Hiệu ứng thanh trượt (Track 64px, Thumb 16px -> trượt tối đa 48px)
  const indicatorThumbStyle = useAnimatedStyle(() => {
    if (layoutWidth.value === 0 || POSTER_TEMPLATES.length <= 1) return { transform: [{ translateX: 0 }] }
    const maxScroll = layoutWidth.value * (POSTER_TEMPLATES.length - 1)
    const progress = Math.max(0, Math.min(1, scrollX.value / maxScroll))

    return {
      transform: [{ translateX: progress * 48 }] // 64(w-16) - 16(w-4) = 48
    }
  })

  // 2. Chữ "Swipe" tự động mờ đi khi người dùng đã hiểu thao tác
  const hintOpacityStyle = useAnimatedStyle(() => {
    if (layoutWidth.value === 0) return { opacity: 0.5 }
    const maxScroll = layoutWidth.value * (POSTER_TEMPLATES.length - 1)
    const progress = Math.max(0, Math.min(1, scrollX.value / maxScroll))

    // Khi cuộn được 20% chặng đường đầu tiên, chữ sẽ mờ hẳn
    const opacity = interpolate(progress, [0, 0.2], [0.5, 0], Extrapolation.CLAMP)
    return { opacity }
  })

  return (
    <View className='flex-1'>
      <View
        className='flex-1'
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout
          if (width > 0 && height > 0 && (width !== layout.width || height !== layout.height)) {
            setLayout({ width, height })
            layoutWidth.value = width
          }
        }}
      >
        {layout.width > 0 && layout.height > 0 ? (
          <Animated.ScrollView
            horizontal
            pagingEnabled
            snapToInterval={layout.width}
            decelerationRate='fast'
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            className='flex-1'
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {POSTER_TEMPLATES.map((template, index) => (
              <AnimatedPosterCard
                key={template.id}
                template={template}
                index={index}
                layout={layout}
                scrollX={scrollX}
                layoutWidth={layoutWidth}
                openTemplate={openTemplate}
              />
            ))}
          </Animated.ScrollView>
        ) : null}
      </View>

      {/* BOTTOM BAR: CHỈ BÁO TINH TẾ & NÚT CUSTOMIZE */}
      <View className='flex-row items-center justify-between px-8 pb-10 pt-4'>
        {/* Cụm điều hướng: Track line + Smart Text */}
        <View className='flex-row items-center'>
          <View className='h-[1px] w-16 overflow-hidden bg-ring-primary/20'>
            <Animated.View className='h-full w-4 bg-ring-primary' style={indicatorThumbStyle} />
          </View>

          <Animated.View style={hintOpacityStyle}>
            <BreathingSwipeHint />
          </Animated.View>
        </View>

        {/* Nút Customize */}
        <Pressable onPress={() => openTemplate(POSTER_TEMPLATES[activeIndex].id)} className='active:opacity-70'>
          <View className='flex-row items-center gap-3 rounded-full border border-ring-primary/20 bg-white/60 px-5 py-2.5'>
            <Text className='font-sans-bold text-[9px] uppercase tracking-[0.2em] text-ring-primary'>Customize</Text>
            <ArrowRight color={THEME.ringPrimary} size={11} strokeWidth={1.8} />
          </View>
        </Pressable>
      </View>
    </View>
  )
}

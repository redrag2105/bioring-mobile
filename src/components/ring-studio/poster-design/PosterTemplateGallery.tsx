import { POSTER_TEMPLATES } from '@/constants/posterTemplates'
import { THEME } from '@/constants/theme'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import type { MemoryCardDraft } from '@/types/ring-studio.types'
import { ChevronDown } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated'
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

function ScrollHint() {
  const translateY = useSharedValue(0)

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )
  }, [translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  return (
    <Animated.View pointerEvents='none' className='items-center' style={animatedStyle}>
      <ChevronDown color={THEME.ringPrimary} size={28} strokeWidth={1.2} opacity={0.4} />
    </Animated.View>
  )
}

export function PosterTemplateGallery() {
  const router = useRouter()
  const updateMemoryCard = useRingDesignStore((state) => state.updateMemoryCard)
  const [pageHeight, setPageHeight] = useState(0)

  return (
    <View
      className='flex-1'
      onLayout={(event) => {
        const nextHeight = Math.round(event.nativeEvent.layout.height)
        if (nextHeight > 0 && nextHeight !== pageHeight) setPageHeight(nextHeight)
      }}
    >
      {pageHeight > 0 ? (
        <ScrollView
          pagingEnabled
          snapToInterval={pageHeight}
          decelerationRate='fast'
          showsVerticalScrollIndicator={false}
          className='flex-1'
        >
          {POSTER_TEMPLATES.map((template, index) => (
            <View key={template.id} className='relative px-5 pt-4' style={{ height: pageHeight }}>
              <View className='gap-4'>
                <View>
                  <Text className='font-sans-bold text-[9px] uppercase tracking-[0.28em] text-ring-accent'>
                    Pic {index + 1}
                  </Text>
                  <Text className='mt-2 font-serif text-[30px] leading-9 text-ring-primary'>{template.name}</Text>
                  <Text className='mt-1 font-sans text-[12px] leading-5 text-txt-muted'>{template.caption}</Text>
                  <Text className='mt-2 font-sans-bold text-[9px] uppercase tracking-[0.18em] text-ring-primary/45'>
                    Tap poster to edit
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    updateMemoryCard({ templateId: template.id })
                    router.push('/(screens)/poster-design-editor' as never)
                  }}
                  className='active:opacity-90'
                >
                  <PosterCanvas template={template} previewMode draftOverride={createSampleDraft(template.id)} />
                </Pressable>
              </View>

              {index < POSTER_TEMPLATES.length - 1 ? (
                <View className='absolute bottom-7 left-0 right-0'>
                  <ScrollHint />
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  )
}

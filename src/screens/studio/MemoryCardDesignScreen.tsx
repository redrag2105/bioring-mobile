import { PosterTemplateGallery } from '@/components/ring-studio/poster-design/PosterTemplateGallery'
import { THEME } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowLeft, Images } from 'lucide-react-native'
import { useCallback } from 'react'
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function MemoryCardDesignScreen() {
  const router = useRouter()

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/(screens)/design-review' as never)
  }, [router])

  return (
    <View className='flex-1 bg-ring-background'>
      <LinearGradient
        colors={['#FDFDFB', '#F5F0E8', '#E9E1D4']}
        locations={[0, 0.52, 1]}
        className='absolute inset-0'
      />

      <SafeAreaView className='flex-1' edges={['top']}>
        <View className='z-30 flex-row items-center justify-between px-5 pt-2'>
          <Pressable
            onPress={handleBack}
            className='h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/65 shadow-sm shadow-ring-primary/10 active:opacity-75'
          >
            <ArrowLeft color={THEME.ringPrimary} size={21} strokeWidth={1.5} />
          </Pressable>
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.3em] text-ring-primary/45'>Poster Design</Text>
          <View className='h-11 w-11 items-center justify-center rounded-full border border-ring-accent/20 bg-ring-accent/10'>
            <Images color={THEME.ringAccent} size={18} strokeWidth={1.4} />
          </View>
        </View>

        <PosterTemplateGallery />
      </SafeAreaView>
    </View>
  )
}

export default MemoryCardDesignScreen

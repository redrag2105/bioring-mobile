import { PosterTemplateGallery } from '@/components/ring-studio/poster-design/PosterTemplateGallery'
import { StudioHeader } from '@/components/ring-studio/StudioHeader'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function MemoryCardDesignScreen() {
  const router = useRouter()

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/(screens)/design-review' as never)
  }, [router])

  return (
    <View className='flex-1 bg-[#F8F6F0]'>
      <LinearGradient colors={['#FFFFFF', '#F2EFE9', '#E6E0D4']} locations={[0, 0.4, 1]} className='absolute inset-0' />
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.45 }}
        className='absolute left-0 right-0 top-0 h-[350px]'
      />

      <SafeAreaView className='flex-1' edges={['top']}>
        <StudioHeader onBack={handleBack} eyebrow='Memory Card' title='Poster Collection' />
        <PosterTemplateGallery />
      </SafeAreaView>
    </View>
  )
}

export default MemoryCardDesignScreen

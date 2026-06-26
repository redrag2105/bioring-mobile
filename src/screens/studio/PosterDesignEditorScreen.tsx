import { PriceText } from '@/components/common/PriceText'
import { PosterEditor } from '@/components/ring-studio/poster-design/PosterEditor'
import { StudioHeader } from '@/components/ring-studio/StudioHeader'
import { useSaveDesignDraftMutation } from '@/hooks/mutations/useSaveDesignDraftMutation'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { cropPosterPhoto } from '@/utils/cropPosterPhoto'
import { useRouter } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function PosterDesignEditorScreen() {
  const router = useRouter()
  const estimatedPrice = useRingDesignStore((state) => state.estimated_price)
  const getDraftPayload = useRingDesignStore((state) => state.getDraftPayload)
  const updateMemoryCard = useRingDesignStore((state) => state.updateMemoryCard)
  const saveDraftMutation = useSaveDesignDraftMutation()
  const [isPreparingSave, setIsPreparingSave] = useState(false)
  const isSaving = isPreparingSave || saveDraftMutation.isPending

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/(screens)/memory-card-design' as never)
  }, [router])

  const handleCheckout = useCallback(async () => {
    if (isSaving) return
    setIsPreparingSave(true)

    try {
      const payload = getDraftPayload()
      const croppedUserPhotoUri = await cropPosterPhoto(payload.memory_card)
      const memoryCard = croppedUserPhotoUri
        ? {
            ...payload.memory_card,
            croppedUserPhotoUri,
            userPhotoUri: croppedUserPhotoUri
          }
        : payload.memory_card

      if (croppedUserPhotoUri) updateMemoryCard({ croppedUserPhotoUri, userPhotoUri: croppedUserPhotoUri })
      saveDraftMutation.mutate({ ...payload, memory_card: memoryCard })
    } finally {
      setIsPreparingSave(false)
    }
  }, [getDraftPayload, isSaving, saveDraftMutation, updateMemoryCard])

  return (
    <View className='flex-1 bg-white'>
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PosterEditor />
      </KeyboardAvoidingView>

      <SafeAreaView edges={['top']} className='absolute left-0 right-0 top-0 z-40'>
        <StudioHeader onBack={handleBack} eyebrow='Memory Card' />
      </SafeAreaView>

      <SafeAreaView
        edges={['bottom']}
        className='absolute bottom-0 left-0 right-0 z-40 justify-center border-t border-white/70 bg-[#F8F7F5]/95 px-5 pt-4 shadow-2xl shadow-ring-primary/10'
      >
        <View className='flex-row items-center justify-between gap-4'>
          <View className='flex-1'>
            <Text className='font-sans-bold text-[8px] uppercase tracking-[0.22em] text-ring-primary/45'>
              Deposit Basis
            </Text>
            <PriceText value={estimatedPrice} className='text-[20px] leading-6 text-ring-primary' />
          </View>

          <Pressable
            onPress={handleCheckout}
            disabled={isSaving}
            className='h-[44px] flex-row items-center gap-2.5 rounded-full bg-ring-primary px-5 shadow-lg shadow-ring-primary/25 active:opacity-85'
          >
            <Text className='font-sans-bold text-[9px] uppercase tracking-[0.18em] text-white'>
              {isSaving ? 'Saving' : 'Proceed to Checkout'}
            </Text>
            <ArrowRight color='#FFFFFF' size={16} strokeWidth={1.5} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default PosterDesignEditorScreen

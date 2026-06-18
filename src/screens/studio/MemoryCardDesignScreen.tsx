import { MemoryCardPanel } from '@/components/ring-studio/MemoryCardPanel'
import { THEME } from '@/constants/theme'
import { useSaveDesignDraftMutation } from '@/hooks/mutations/useSaveDesignDraftMutation'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { formatPrice } from '@/utils/formatPrice'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowLeft, ArrowRight, CreditCard } from 'lucide-react-native'
import { useCallback } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export function MemoryCardDesignScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const estimatedPrice = useRingDesignStore((state) => state.estimated_price)
  const getDraftPayload = useRingDesignStore((state) => state.getDraftPayload)
  const saveDraftMutation = useSaveDesignDraftMutation()

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/(screens)/design-review' as never)
  }, [router])

  const handleCheckout = useCallback(() => {
    saveDraftMutation.mutate(getDraftPayload())
  }, [getDraftPayload, saveDraftMutation])

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
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.3em] text-ring-primary/45'>Memory Card</Text>
          <View className='h-11 w-11 items-center justify-center rounded-full border border-ring-accent/20 bg-ring-accent/10'>
            <CreditCard color={THEME.ringAccent} size={18} strokeWidth={1.4} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1 px-5'
          contentContainerStyle={{ paddingBottom: insets.bottom + 108, paddingTop: 22 }}
        >
          <View className='mb-5'>
            <Text className='font-sans-bold text-[9px] uppercase tracking-[0.34em] text-ring-accent'>
              04 QR Memory Design
            </Text>
            <Text className='mt-3 font-serif text-[38px] leading-[42px] text-ring-primary'>Memory Card Design</Text>
          </View>

          <MemoryCardPanel />
        </ScrollView>
      </SafeAreaView>

      <View
        className='absolute bottom-0 left-0 right-0 z-40 justify-center border-t border-white/70 bg-[#F8F7F5] px-5 shadow-2xl shadow-ring-primary/10'
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
          paddingTop: 16
        }}
      >
        <View className='flex-row items-center justify-between gap-4'>
          <View className='flex-1'>
            <Text className='font-sans-bold text-[8px] uppercase tracking-[0.22em] text-ring-primary/45'>
              Deposit Basis
            </Text>
            <Text className='font-serif text-[20px] leading-6 text-ring-primary'>{formatPrice(estimatedPrice)}</Text>
          </View>

          <Pressable
            onPress={handleCheckout}
            disabled={saveDraftMutation.isPending}
            className='h-[44px] flex-row items-center gap-2.5 rounded-full bg-ring-primary px-5 shadow-lg shadow-ring-primary/25 active:opacity-85'
          >
            <Text className='font-sans-bold text-[9px] uppercase tracking-[0.18em] text-white'>
              {saveDraftMutation.isPending ? 'Saving' : 'Proceed to Checkout'}
            </Text>
            <ArrowRight color='#FFFFFF' size={16} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default MemoryCardDesignScreen

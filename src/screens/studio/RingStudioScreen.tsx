import { BasicSpecsPanel } from '@/components/ring-studio/BasicSpecsPanel'
import { Canvas3D } from '@/components/ring-studio/Canvas3D'
import { PackageSelector } from '@/components/ring-studio/PackageSelector'
import { StudioHeader } from '@/components/ring-studio/StudioHeader'
import { StudioStepIndicator } from '@/components/ring-studio/StudioStepIndicator'
import { THEME } from '@/constants/theme'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { formatPrice } from '@/utils/formatPrice'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowRight, Gem } from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

function StudioPanelContent() {
  const activeTab = useRingDesignStore((state) => state.activeTab)

  if (activeTab === 'package') return <PackageSelector />
  return <BasicSpecsPanel />
}

function StickyFooter({ onAction }: { onAction: () => void }) {
  const insets = useSafeAreaInsets()
  const estimatedPrice = useRingDesignStore((state) => state.estimated_price)
  const activeTab = useRingDesignStore((state) => state.activeTab)
  const label = activeTab === 'package' ? 'Next: Engrave' : 'Continue'

  return (
    <View
      className='absolute bottom-0 left-0 right-0 z-40 justify-center border-t border-white/70 bg-[#F8F7F5]/90 px-5 shadow-2xl shadow-ring-primary/10'
      style={{
        height: (insets.bottom > 0 ? insets.bottom : 0) + 60,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 0
      }}
    >
      <View className='flex-row items-center justify-between gap-4'>
        <View className='flex-1'>
          <Text className='font-sans-bold text-[8px] uppercase tracking-[0.22em] text-ring-primary/45'>
            Estimated Price
          </Text>
          <Text className='font-serif text-[20px] leading-6 text-ring-primary'>{formatPrice(estimatedPrice)}</Text>
        </View>

        <Pressable
          onPress={onAction}
          className='h-[44px] flex-row items-center gap-2.5 rounded-full bg-ring-primary px-5 shadow-lg shadow-ring-primary/25 active:opacity-85'
        >
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.2em] text-white'>{label}</Text>
          <ArrowRight color='#FFFFFF' size={16} strokeWidth={1.5} />
        </Pressable>
      </View>
    </View>
  )
}

export function RingStudioScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ templateId?: string; productId?: string }>()
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  const activeTab = useRingDesignStore((state) => state.activeTab)
  const setActiveTab = useRingDesignStore((state) => state.setActiveTab)
  const setProductId = useRingDesignStore((state) => state.setProductId)

  useEffect(() => {
    setProductId(params.productId ?? params.templateId)
  }, [params.productId, params.templateId, setProductId])

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true))
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false))

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  const panelTitle = useMemo(() => {
    if (activeTab === 'package') return '02 Biometric Package'
    return '01 Material Architecture'
  }, [activeTab])

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/(dashboard)/studio' as never)
  }, [router])

  const handleFooterAction = useCallback(() => {
    if (activeTab === 'basic') {
      setActiveTab('package')
      return
    }

    router.push('/(screens)/bio-engraving-studio' as never)
  }, [activeTab, router, setActiveTab])

  return (
    <View className='flex-1 bg-ring-background'>
      <Canvas3D />
      <LinearGradient
        colors={['rgba(248,247,245,0)', '#F8F7F5']}
        locations={[0.25, 1]}
        className='absolute bottom-0 left-0 right-0 z-[1] h-[50%]'
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='z-20 flex-1'
        keyboardVerticalOffset={0}
      >
        <SafeAreaView className='flex-1' edges={['top']}>
          <StudioHeader onBack={handleBack} />

          <View
            className='flex-1 justify-end px-0'
            style={{ paddingBottom: isKeyboardVisible ? 8 : insets.bottom + 76 }}
          >
            <View
              className={`overflow-hidden rounded-t-[34px] border border-white/70 bg-white/65 shadow-2xl shadow-ring-primary/15 ${
                isKeyboardVisible ? 'max-h-[84%]' : 'max-h-[66%]'
              }`}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.92)', 'rgba(248,247,245,0.74)']}
                className='absolute inset-0'
              />

              <View className='border-b border-ring-primary/10 px-5 pb-3 pt-4'>
                <View className='mb-3 flex-row items-center justify-between'>
                  <View>
                    <Text className='font-sans-bold text-[8px] uppercase tracking-[0.32em] text-ring-accent'>
                      {panelTitle}
                    </Text>
                    <Text className='mt-0.5 font-serif text-[27px] leading-8 text-ring-primary'>Bioring Studio</Text>
                  </View>
                  <View className='h-9 w-9 items-center justify-center rounded-full border border-ring-accent/20 bg-ring-accent/10'>
                    <Gem color={THEME.ringAccent} size={16} strokeWidth={1.4} />
                  </View>
                </View>

                <StudioStepIndicator activeTab={activeTab} onChange={setActiveTab} />
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode='interactive'
                automaticallyAdjustKeyboardInsets
                className='px-5'
                contentContainerStyle={{
                  paddingBottom: isKeyboardVisible ? 140 : activeTab === 'basic' ? 10 : 28,
                  paddingTop: 22
                }}
              >
                <StudioPanelContent />
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {isKeyboardVisible ? null : <StickyFooter onAction={handleFooterAction} />}
    </View>
  )
}

export default RingStudioScreen

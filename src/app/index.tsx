import { OnboardingScreen } from '@/components/onboarding/OnboardingCarousel'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useState } from 'react'
import { View } from 'react-native'

const ONBOARDING_COMPLETE_KEY = '@bioring:onboarding_complete'

export default function WelcomeScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // useEffect(() => {
  //   const clearOnLoad = async () => {
  //     try {
  //       await AsyncStorage.clear()
  //       console.log('Onboarding async storage cleared on load')
  //     } catch (error) {
  //       console.error('Failed to clear async storage:', error)
  //     }
  //   }

  //   clearOnLoad()
  // }, [])

  const completeOnboarding = useCallback(async () => {
    try {
      setIsLoading(true)
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true')
    } catch (error) {
      console.error('Failed to persist onboarding state:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSkip = useCallback(async () => {
    await completeOnboarding()
    router.replace('/(auth)/login')
  }, [completeOnboarding, router])

  const handleContinueToLogin = useCallback(() => {
    router.replace('/(auth)/login')
  }, [router])

  return (
    <View className='flex-1 bg-ring-background'>
      <StatusBar style='dark' translucent backgroundColor='transparent' />
      <OnboardingScreen onSkip={handleSkip} onStartNow={handleContinueToLogin} isLoading={isLoading} />
    </View>
  )
}

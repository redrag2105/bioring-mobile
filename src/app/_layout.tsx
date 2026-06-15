import '@/global.css'
import { useFonts } from 'expo-font'
import * as Linking from 'expo-linking'
import { Stack, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export { ErrorBoundary } from 'expo-router'

/**
 * Hook to handle authentication deeplinks at the app level
 * This ensures tokens are captured even when the app is not on the login screen
 */
function useAuthDeepLinkHandler() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event
      const parsed = Linking.parse(url)

      // Check if this is our auth callback with tokens
      const accessToken = (parsed.queryParams?.accessToken || parsed.queryParams?.token) as string | undefined
      const refreshToken = parsed.queryParams?.refreshToken as string | undefined

      if ((parsed.path === 'auth' || parsed.hostname === 'auth') && accessToken) {
        try {
          // Store the tokens securely
          await SecureStore.setItemAsync('access_token', accessToken)
          console.log('Access token stored successfully via deeplink')

          if (refreshToken) {
            await SecureStore.setItemAsync('refresh_token', refreshToken)
            console.log('Refresh token stored successfully via deeplink')
          }

          // Navigate to dashboard
          router.replace('/(dashboard)')
        } catch (err) {
          console.error('Failed to store tokens from deeplink:', err)
        }
      }
    }

    // Listen for deeplink events while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink)

    // Check if app was opened via deeplink (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url })
      }
      setIsReady(true)
    })

    return () => {
      subscription.remove()
    }
  }, [router])

  return isReady
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2
    }
  }
})

export default function RootLayout() {
  useAuthDeepLinkHandler()
  const [fontsLoaded] = useFonts({
    'Gretha-Regular': require('../assets/fonts/Gretha Regular.ttf'),
    'Gretha-Medium': require('../assets/fonts/Gretha Medium.ttf'),
    'Gretha-Bold': require('../assets/fonts/Gretha Bold.ttf'),
    'Gretha-SemiBoldItalic': require('../assets/fonts/Gretha-SemiBoldItalic.otf')
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode='light'>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <StatusBar style='dark' />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name='index' />
              <Stack.Screen name='(auth)' />
              <Stack.Screen name='(dashboard)' />
              <Stack.Screen name='studio-size-guide' />
              <Stack.Screen name='studio-measure-now' />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </QueryClientProvider>
  )
}

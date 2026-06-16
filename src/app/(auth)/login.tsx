import { THEME } from '@/constants/theme'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Fingerprint } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native'
import Animated, {
  Easing,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path } from 'react-native-svg'

// Google SVG icon
function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24'>
      <Path
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
        fill='#4285F4'
      />
      <Path
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
        fill='#34A853'
      />
      <Path
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
        fill='#FBBC05'
      />
      <Path
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
        fill='#EA4335'
      />
    </Svg>
  )
}

export default function LoginScreen() {
  const router = useRouter()

  const handleAuthSuccess = async (token: string) => {
    console.log('Authentication successful!')
    try {
      const isComplete = await AsyncStorage.getItem('@bioring:post_login_setup_complete')
      if (isComplete === 'true') {
        router.replace('/(dashboard)' as any)
      } else {
        router.replace('/post-login-setup' as any)
      }
    } catch {
      router.replace('/post-login-setup' as any)
    }
  }

  const { signInWithGoogle, isLoading, error } = useGoogleAuth(handleAuthSuccess)

  const handleGoogleSignIn = async () => {
    // try {
    //   await signInWithGoogle()
    // } catch (err) {
    //   Alert.alert('Sign-in failed', 'Unable to sign in with Google. Please try again.')
    // }

    // --- Temporary Bypass Check ---
    try {
      const isComplete = await AsyncStorage.getItem('@bioring:post_login_setup_complete')
      if (isComplete === 'true') {
        return router.replace('/(dashboard)' as any)
      }
    } catch {}

    return router.replace('/post-login-setup' as any)
  }

  useEffect(() => {
    if (error) {
      Alert.alert('Sign-in Error', error)
    }
  }, [error])

  const rotation = useSharedValue(0)
  const breathing = useSharedValue(0)

  const pressOpacity = useSharedValue(1)

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 60000, easing: Easing.linear }), -1, false)
    breathing.value = withRepeat(withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }), -1, true)
  }, [rotation, breathing])

  const animatedBlueprintStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: interpolate(breathing.value, [0, 1], [0.98, 1.02]) }]
    }
  })

  const animatedPressStyle = useAnimatedStyle(() => {
    return {
      opacity: isLoading ? 0.85 : pressOpacity.value
    }
  })

  return (
    <View className='flex-1 bg-[#FDFDFB]'>
      {/* Rich Paper Gradient Background */}
      <LinearGradient colors={['#FDFDFB', '#F8F6F0', '#EAE6DB']} locations={[0, 0.5, 1]} className='absolute inset-0' />

      {/* Out-of-the-box Geometric "Atelier Blueprint" Graphic */}
      <View className='absolute -right-[150px] -top-[120px] opacity-[0.25]'>
        <Animated.View style={animatedBlueprintStyle}>
          <Svg width='600' height='600' viewBox='0 0 500 500'>
            <Circle
              cx='250'
              cy='250'
              r='220'
              stroke={THEME.ringPrimary}
              strokeWidth='0.8'
              fill='none'
              strokeDasharray='4 8'
            />
            <Circle cx='250' cy='250' r='180' stroke={THEME.ringAccent} strokeWidth='0.5' fill='none' />
            <Circle
              cx='250'
              cy='250'
              r='140'
              stroke={THEME.ringPrimary}
              strokeWidth='0.5'
              fill='none'
              strokeDasharray='12 4'
            />
            <Circle cx='250' cy='250' r='100' stroke={THEME.ringAccent} strokeWidth='0.5' fill='none' />
            <Path
              d='M 250 0 L 250 500 M 0 250 L 500 250'
              stroke={THEME.ringPrimary}
              strokeWidth='0.5'
              strokeOpacity='0.3'
            />
          </Svg>
        </Animated.View>
      </View>

      <SafeAreaView className='flex-1 justify-between'>
        {/* --- MINIMALIST BRANDING BAR --- */}
        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          className='flex-row items-center justify-between px-8 pt-6'
        >
          <Text className='font-sans-bold text-[12px] tracking-[0.3em] text-ring-primary'>BIORING</Text>
          <Fingerprint color={THEME.ringAccent} size={22} strokeWidth={1.2} />
        </Animated.View>

        {/* --- HUGE EDITORIAL HERO CONTENT --- */}
        <View className='flex-1 justify-center px-8'>
          <Animated.View entering={FadeInRight.delay(200).duration(1000).springify()}>
            <Text style={{ fontFamily: 'Gretha-Regular', fontSize: 50, lineHeight: 56, color: THEME.ringPrimary }}>
              Your Essence,
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInRight.delay(350).duration(1000).springify()}>
            <Text
              style={{ fontFamily: 'Gretha-SemiBoldItalic', fontSize: 50, lineHeight: 56, color: THEME.ringAccent }}
            >
              Forged.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(1000).springify()}>
            <View className='my-8 h-[1px] w-12 bg-ring-primary/30' />
            <Text className='font-sans-light max-w-[280px] text-[15px] leading-7 text-txt-body'>
              Step into the atelier. Connect your biometric rhythm to a piece of eternal craftsmanship.
            </Text>
          </Animated.View>
        </View>

        {/* --- LUXURY ACTION AREA --- */}
        <Animated.View entering={FadeInUp.delay(700).duration(1000).springify()} className='px-8 pb-10'>
          <Pressable
            onPressIn={() => {
              if (!isLoading) {
                pressOpacity.value = withTiming(0.85, { duration: 150 })
              }
            }}
            onPressOut={() => {
              pressOpacity.value = withTiming(1, { duration: 200 })
            }}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Animated.View
              className='h-[56px] w-full flex-row items-center justify-center gap-3 rounded-full bg-ring-primary shadow-lg shadow-ring-primary/20'
              style={animatedPressStyle}
            >
              {isLoading ? (
                <ActivityIndicator color='#FFFFFF' />
              ) : (
                <>
                  <View className='rounded-full bg-white p-[4px] shadow-sm'>
                    <GoogleLogo size={16} />
                  </View>
                  <Text className='ml-[1px] font-sans-bold text-[11px] tracking-[2px] text-white'>
                    CONTINUE WITH GOOGLE
                  </Text>
                </>
              )}
            </Animated.View>
          </Pressable>

          <Text className='mt-8 text-center font-sans text-[11px] leading-5 text-txt-muted'>
            By continuing, you agree to our <Text className='text-ring-primary/70 underline'>Terms of Service</Text> and{' '}
            <Text className='text-ring-primary/70 underline'>Privacy Policy</Text>.
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  )
}

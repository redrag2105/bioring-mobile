import { logout } from '@/core/apis/auth.api'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { useResetTabOnBlur } from '@/hooks/useResetTabOnBlur'
import { useFocusEffect } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Bell, ChevronRight, CircleUser, HelpCircle, LogOut, Moon, Shield, type LucideIcon } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type SettingsItemProps = {
  icon: LucideIcon
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
}

function SettingsItem({ icon: Icon, label, value, onPress, danger }: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className='flex-row items-center border-b border-ui-border px-4 py-3.5'
    >
      <View className={`mr-3.5 h-9 w-9 items-center justify-center rounded-[10px] ${danger ? 'bg-status-error/10' : 'bg-ring-accent/10'}`}>
        <Icon size={18} className={danger ? 'text-status-error' : 'text-ring-accent'} />
      </View>
      <Text className={`flex-1 font-sans text-[15px] ${danger ? 'text-status-error' : 'text-txt-main'}`}>
        {label}
      </Text>
      {value ? <Text className='mr-2 font-sans text-sm text-txt-body'>{value}</Text> : null}
      {onPress ? <ChevronRight size={18} className='text-txt-body' /> : null}
    </TouchableOpacity>
  )
}

export function ProfileScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const handleScroll = useDynamicBottomTab()
  const [profile, setProfile] = useState<{ email?: string; id?: string }>({})
  const [refreshing, setRefreshing] = useState(false)
  const resetProfileState = useCallback(() => {
    setProfile({})
    setRefreshing(false)
  }, [])
  const { resetKey, scrollRef } = useResetTabOnBlur({ onReset: resetProfileState })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries()
    setRefreshing(false)
  }, [queryClient])

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token')

        if (token) {
          const { jwtDecode } = await import('jwt-decode')
          const decoded: any = jwtDecode(token)
          setProfile({
            email: decoded.email || decoded.username || '',
            id: decoded.sub || decoded.id || ''
          })
        }
      } catch (error) {
        console.error(error)
      }
    }

      loadProfile()
    }, [])
  )

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out of BioRing?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout()
          } catch (error) {
            console.error('Logout failed', error)
            Alert.alert('Error', 'Failed to log out cleanly. You have been forced out locally.')
          } finally {
            await SecureStore.deleteItemAsync('token')
            queryClient.clear()
            router.replace('/(auth)/login' as never)
          }
        }
      }
    ])
  }

  return (
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <View className='flex-row items-center justify-between px-5 pb-2 pt-4'>
          <Text className='py-2 font-serif-semibold text-[28px] leading-9 text-txt-main'>Profile</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          key={resetKey}
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className='gap-6 px-5 pb-40'>
            <View className='elevation-1 flex-row items-center gap-3.5 rounded-[18px] border border-ui-border bg-ring-surface p-4 shadow-tab-bar'>
              <View className='h-14 w-14 items-center justify-center rounded-full bg-btn-disabled'>
                <CircleUser size={28} className='text-txt-muted' strokeWidth={1.5} />
              </View>
              <View className='flex-1 justify-center'>
                <Text className='font-sans-bold text-base text-txt-main'>
                  {profile.email?.split('@')[0] || 'Guest User'}
                </Text>
                <Text className='mt-0.5 font-sans text-[13px] text-txt-body'>{profile.email || 'Not logged in'}</Text>
              </View>
              <TouchableOpacity className='rounded-full bg-btn-disabled px-4 py-2'>
                <Text className='font-sans-bold text-xs text-txt-main'>Edit</Text>
              </TouchableOpacity>
            </View>

            <View className='gap-2.5'>
              <Text className='px-1 font-sans-bold text-xs uppercase tracking-wide text-txt-body'>Preferences</Text>
              <View className='overflow-hidden rounded-2xl border border-ui-border bg-ring-surface'>
                <SettingsItem icon={Bell} label='Notifications' value='Enabled' onPress={() => Alert.alert('Coming Soon')} />
                <SettingsItem icon={Moon} label='Appearance' value='Light' onPress={() => Alert.alert('Coming Soon')} />
              </View>
            </View>

            <View className='gap-2.5'>
              <Text className='px-1 font-sans-bold text-xs uppercase tracking-wide text-txt-body'>Support</Text>
              <View className='overflow-hidden rounded-2xl border border-ui-border bg-ring-surface'>
                <SettingsItem icon={HelpCircle} label='Help Center' onPress={() => router.push('/(modals)/help-center' as never)} />
                <SettingsItem icon={Shield} label='Privacy Policy' onPress={() => router.push('/(modals)/privacy-policy' as never)} />
              </View>
            </View>

            <View className='overflow-hidden rounded-2xl border border-ui-border bg-ring-surface'>
              <SettingsItem icon={LogOut} label='Log Out' danger onPress={handleLogout} />
            </View>

            <Text className='text-center font-sans text-xs text-txt-muted'>BioRing v1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

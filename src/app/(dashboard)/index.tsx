import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { useQueryClient } from '@tanstack/react-query'

export default function Dashboard() {
  const router = useRouter()
  const handleScroll = useDynamicBottomTab()
  const queryClient = useQueryClient()

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries()
    setRefreshing(false)
  }, [queryClient])

  return (
    <View className='flex-1 bg-paper'>
      <SafeAreaView className='flex-1' edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)}>
          <HStack className='items-center justify-between px-5 py-4'>
            <VStack>
              <Text className='font-sans text-[13px] uppercase tracking-wider text-ink-muted'> Good morning</Text>
              <Text className='mt-1 py-2 font-serif text-[28px] font-semibold leading-9 text-ink'>
                Your <Text className='font-serif italic' style={{ color: THEME.bioringMain }}>Sanctuary</Text>
              </Text>
            </VStack>
          </HStack>
        </Animated.View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 20 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}  />}
        >
          {/* Bottom spacing for tab bar */}
          <View className='h-[100px]' />
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

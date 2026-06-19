import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { CurrentDesignStatusCard } from '@/components/studio/CurrentDesignStatusCard'
import { DesignCodeSyncCard } from '@/components/studio/DesignCodeSyncCard'
import { RingSizeGuideCard } from '@/components/studio/RingSizeGuideCard'
import { StudioCreationOptions } from '@/components/studio/StudioCreationOptions'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function StudioScreen() {
  const handleScroll = useDynamicBottomTab()

  return (
    <View className='flex-1 bg-[#F6F4EF]'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <ScreenHeader eyebrow='Start now' title='Create your' accent='BioRing' />

        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className='gap-8 px-5 pb-40'>
            <DesignCodeSyncCard />

            <CurrentDesignStatusCard />

            <StudioCreationOptions />

            <RingSizeGuideCard />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

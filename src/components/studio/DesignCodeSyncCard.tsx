import { useState } from 'react'
import { Text, View } from 'react-native'

import { STUDIO_SYNC_CONTENT } from '@/constants/staticContent'
import { DesignCodeSyncInput } from './DesignCodeSyncInput'

export function DesignCodeSyncCard() {
  const [designCode, setDesignCode] = useState('')

  return (
    <View className='gap-3 px-1'>
      <View className='px-1'>
        <Text
          allowFontScaling={false}
          className='font-sans-medium text-[9px] uppercase tracking-[0.3em] text-ring-accent/70'
        >
          {STUDIO_SYNC_CONTENT.eyebrow}
        </Text>
        <Text allowFontScaling={false} className='mt-0.5 font-serif-semibold text-[16px] leading-6 text-ring-primary'>
          {STUDIO_SYNC_CONTENT.title}
        </Text>
      </View>

      <DesignCodeSyncInput value={designCode} onChangeText={setDesignCode} />
    </View>
  )
}

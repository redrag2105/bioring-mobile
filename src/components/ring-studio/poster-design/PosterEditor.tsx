import { POSTER_TEMPLATES } from '@/constants/posterTemplates'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { useEffect } from 'react'
import { Keyboard, ScrollView, useWindowDimensions, View } from 'react-native'
import { PosterCanvas } from './PosterCanvas'

export function PosterEditor() {
  const { height } = useWindowDimensions()
  const memory = useRingDesignStore((state) => state.memory_card)
  const updateMemoryCard = useRingDesignStore((state) => state.updateMemoryCard)
  const template = POSTER_TEMPLATES.find((item) => item.id === memory.templateId) ?? POSTER_TEMPLATES[0]
  const posterHeight = Math.max(680, height)

  useEffect(() => {
    if (template.id !== memory.templateId) updateMemoryCard({ templateId: template.id })
  }, [memory.templateId, template.id, updateMemoryCard])

  return (
    <ScrollView
      className='flex-1 bg-white'
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={Keyboard.dismiss}
      contentContainerStyle={{ minHeight: posterHeight + 160, paddingBottom: 140 }}
    >
      <View style={{ height: posterHeight }}>
        <PosterCanvas template={template} editable fullScreen />
      </View>
    </ScrollView>
  )
}

import { POSTER_TEMPLATES } from '@/constants/posterTemplates'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { LinearGradient } from 'expo-linear-gradient'
import { Mail } from 'lucide-react-native'
import { useEffect } from 'react'
import { Keyboard, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native'
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
      className='flex-1 bg-[#F8F7F3]'
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={Keyboard.dismiss}
      contentContainerStyle={{ minHeight: posterHeight + 220, paddingBottom: 172 }}
    >
      <LinearGradient
        colors={['#FFFDF9', '#F7F2EA', '#E6DCCE']}
        locations={[0, 0.55, 1]}
        className='absolute inset-0'
      />

      <View className='px-3 pb-8 pt-32' style={{ minHeight: posterHeight }}>
        <View className='mb-5'>
          <View className='px-2'>
            <Text className='font-sans-bold text-[8px] uppercase tracking-[0.32em] text-ring-accent'>
              Memory Atelier
            </Text>
            <Text className='mt-2 font-serif text-[34px] leading-10 text-ring-primary'>{template.name}</Text>
            <Text className='mt-2 font-sans text-[12px] leading-5 text-ring-primary/60'>{template.caption}</Text>
          </View>
        </View>

        <View className='border border-white/80 bg-white/55 p-1.5 shadow-2xl shadow-ring-primary/15'>
          <View className='border border-ring-primary/10 bg-[#FDFBF7] p-1.5'>
            <PosterCanvas template={template} editable />
          </View>
        </View>

        <View className='mt-5 border border-ring-primary/10 bg-white/65 px-4 py-4 shadow-sm shadow-ring-primary/10'>
          <View className='flex-row items-start gap-3'>
            <View className='mt-0.5 h-9 w-9 items-center justify-center rounded-full border border-ring-accent/25 bg-ring-accent/10'>
              <Mail color='#B69B7A' size={16} strokeWidth={1.5} />
            </View>
            <View className='min-w-0 flex-1'>
              <Text className='font-sans-bold text-[8px] uppercase tracking-[0.28em] text-ring-accent'>
                QR Recipient
              </Text>
              <Text className='mt-1 font-sans text-[11px] leading-5 text-ring-primary/55'>
                This email can activate the QR experience. It will not appear on the Memory Card design.
              </Text>
            </View>
          </View>

          <View className='mt-4 border border-ring-primary/10 bg-[#FBF8F2] px-3 py-2.5'>
            <TextInput
              value={memory.recipientEmail ?? ''}
              onChangeText={(recipientEmail) => updateMemoryCard({ recipientEmail: recipientEmail.trim() })}
              placeholder='recipient@email.com'
              placeholderTextColor='rgba(26,54,66,0.35)'
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              className='m-0 p-0 font-sans text-[14px] text-ring-primary'
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

import type { RingStudioTab } from '@/types/ring-studio.types'
import { Pressable, Text, View } from 'react-native'

const STEPS: { id: RingStudioTab; label: string }[] = [
  { id: 'basic', label: 'Specs' },
  { id: 'package', label: 'Bio' }
]

type StudioStepIndicatorProps = {
  activeTab: RingStudioTab
  onChange: (tab: RingStudioTab) => void
}

export function StudioStepIndicator({ activeTab, onChange }: StudioStepIndicatorProps) {
  return (
    <View className='flex-row items-center justify-between rounded-full border border-white/60 bg-white/40 p-1'>
      {STEPS.map((step, index) => {
        const isActive = activeTab === step.id
        return (
          <Pressable
            key={step.id}
            onPress={() => onChange(step.id)}
            className={`h-9 flex-1 flex-row items-center justify-center gap-1 rounded-full ${
              isActive ? 'bg-ring-primary' : 'bg-transparent'
            }`}
          >
            <Text className={`font-serif text-[13px] ${isActive ? 'text-ring-accent' : 'text-ring-primary/35'}`}>
              {index + 1}
            </Text>
            <Text
              className={`font-sans-bold text-[8px] uppercase tracking-[0.16em] ${
                isActive ? 'text-white' : 'text-ring-primary/45'
              }`}
            >
              {step.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

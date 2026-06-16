import { LinearGradient } from 'expo-linear-gradient'
import { Clock3, Layers } from 'lucide-react-native'
import { Text, View } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'

import { STUDIO_CURRENT_DESIGN } from '@/constants/staticContent'
import { THEME } from '@/constants/theme'

const JOURNEY_STEPS = ['Design', 'Review', 'Crafting', 'QA', 'Ready']

export function CurrentDesignStatusCard() {
  const currentStepIndex = 2

  return (
    <View className='relative overflow-hidden rounded-[24px] border-[0.5px] border-white/10 shadow-sm shadow-ring-secondary/10'>
      <LinearGradient colors={['#1A3642', '#0C1F27']} className='absolute inset-0' />

      <View className='gap-6 p-7'>
        {/* Header Section */}
        <View className='flex-row items-center justify-between'>
          <Text className='font-sans-medium text-[9px] uppercase tracking-[0.3em] text-ring-accent'>
            {STUDIO_CURRENT_DESIGN.eyebrow}
          </Text>
          <View className='flex-row items-center gap-1.5 rounded-full border border-ring-accent/30 bg-ring-accent/10 px-3 py-1'>
            <View className='h-1.5 w-1.5 rounded-full bg-ring-accent' />
            <Text className='font-sans-bold text-[9px] uppercase tracking-wider text-ring-accent'>
              {STUDIO_CURRENT_DESIGN.status}
            </Text>
          </View>
        </View>

        <Text className='font-serif text-[24px] text-white'>{STUDIO_CURRENT_DESIGN.name}</Text>

        {/* Journey Progress */}
        <View className='relative flex-row items-center justify-between py-4'>
          <View className='absolute left-6 right-6 top-[30px] h-[0.5px] bg-white/10' />

          {JOURNEY_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex

            return (
              <View key={step} className='items-center gap-3'>
                <View
                  style={
                    isCompleted
                      ? {
                          shadowColor: THEME.ringAccent,
                          shadowOpacity: 0.55,
                          shadowRadius: 10,
                          shadowOffset: { width: 0, height: 0 }
                        }
                      : undefined
                  }
                >
                  <Svg
                    width='22'
                    height='22'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke={isCompleted ? THEME.ringAccent : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isCompleted ? 1.8 : 1.5}
                  >
                    <Circle cx='12' cy='13' r='6' />
                    <Path d='M12 7V5' strokeWidth={isCompleted ? 2.2 : 2} />
                    <Circle cx='12' cy='4' r='1' fill={isCompleted ? THEME.ringAccent : 'rgba(255,255,255,0.2)'} />
                  </Svg>
                </View>

                <Text
                  className={`text-[8px] uppercase tracking-widest ${
                    isCompleted ? 'font-sans-bold text-ring-accent' : 'text-white/20'
                  }`}
                  style={
                    isCompleted
                      ? {
                          textShadowColor: THEME.ringAccent,
                          textShadowOffset: { width: 0, height: 0 },
                          textShadowRadius: 8
                        }
                      : undefined
                  }
                >
                  {step}
                </Text>
              </View>
            )
          })}
        </View>

        {/* Footer */}
        <View className='flex-row items-center justify-between border-t border-white/10 pt-5'>
          <View className='flex-row items-center gap-2'>
            <Clock3 color={THEME.ringAccent} size={13} />
            <Text className='font-sans text-[10px] uppercase tracking-wider text-white/40'>
              {STUDIO_CURRENT_DESIGN.updatedAt}
            </Text>
          </View>
          <Layers color={THEME.ringAccent} size={16} />
        </View>
      </View>
    </View>
  )
}

import { THEME } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { Activity, Fingerprint, Mic } from 'lucide-react-native'
import { Text, View } from 'react-native'

type Props = {
  supportedBiometrics: string[]
}

export function ProductBiometrics({ supportedBiometrics }: Props) {
  return (
    <View className='overflow-hidden rounded-[16px] border-[0.5px] border-white/20 shadow-sm shadow-ring-secondary/10'>
      <LinearGradient colors={['#1A3642', '#0C1F27']} className='absolute inset-0' />
      <View className='p-5'>
        <View className='mb-5 flex-row items-center justify-between'>
          <Text
            allowFontScaling={false}
            className='font-sans-medium text-[9px] uppercase tracking-[0.3em] text-ring-accent'
          >
            Biometric Modules
          </Text>
          <View className='flex-row items-center gap-1.5 rounded-full border border-ring-accent/30 bg-ring-accent/10 px-2 py-0.5'>
            <View className='h-1.5 w-1.5 animate-pulse rounded-full bg-ring-accent' />
            <Text className='font-sans-bold text-[8px] uppercase tracking-wider text-ring-accent'>Active</Text>
          </View>
        </View>

        <View className='flex-row justify-between px-2'>
          {supportedBiometrics.includes('fingerprint') && (
            <View className='items-center gap-2'>
              <Fingerprint color={THEME.ringAccent} size={20} strokeWidth={1.5} />
              <Text className='font-sans-medium text-[8px] uppercase tracking-wider text-white/70'>Print</Text>
            </View>
          )}
          {supportedBiometrics.includes('heartbeat') && (
            <View className='items-center gap-2'>
              <Activity color={THEME.ringAccent} size={20} strokeWidth={1.5} />
              <Text className='font-sans-medium text-[8px] uppercase tracking-wider text-white/70'>Pulse</Text>
            </View>
          )}
          {supportedBiometrics.includes('sound_wave') && (
            <View className='items-center gap-2'>
              <Mic color={THEME.ringAccent} size={20} strokeWidth={1.5} />
              <Text className='font-sans-medium text-[8px] uppercase tracking-wider text-white/70'>Vocal</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

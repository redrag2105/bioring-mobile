import { NoticeMessage } from '@/components/common/NoticeMessage'
import { THEME } from '@/constants/theme'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import type { BioEngravingType } from '@/types/ring-studio.types'
import { Check, Fingerprint, HeartPulse, Mic2 } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

type PackageOption = {
  id: BioEngravingType
  title: string
  description: string
  accent: string
  icon: typeof Mic2
}

const PACKAGES: PackageOption[] = [
  {
    id: 'fingerprint',
    title: 'FingerPrint',
    description: 'A tactile signature for your Memory Card.',
    accent: '#7D9A8F',
    icon: Fingerprint
  },
  {
    id: 'heartbeat',
    title: 'HeartBeat',
    description: 'A quiet line drawn from your rhythm.',
    accent: '#B68178',
    icon: HeartPulse
  },
  {
    id: 'sound_wave',
    title: 'SoundWave',
    description: 'A short message shaped into a waveform.',
    accent: '#B69B7A',
    icon: Mic2
  }
]

function PackageRow({
  item,
  isActive,
  isLast,
  onPress
}: {
  item: PackageOption
  isActive: boolean
  isLast: boolean
  onPress: () => void
}) {
  const Icon = item.icon

  // Tách class thành chuỗi tĩnh không nội suy để tránh lỗi NativeWind
  const rowClass = isLast
    ? 'flex-row items-center gap-5 py-5'
    : 'flex-row items-center gap-5 py-5 border-b-[0.5px] border-ring-primary/10'

  const checkClass = isActive
    ? 'h-[18px] w-[18px] items-center justify-center rounded-[4px] border-[0.5px] border-transparent'
    : 'h-[18px] w-[18px] items-center justify-center rounded-[4px] border-[0.5px] border-ring-primary/30 bg-transparent'

  return (
    <Pressable onPress={onPress} className={rowClass} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
      {/* Icon */}
      <View
        className='h-11 w-11 items-center justify-center rounded-[8px] border-[0.5px] bg-transparent'
        style={{ borderColor: isActive ? item.accent : 'rgba(26, 54, 66, 0.2)' }}
      >
        <Icon color={isActive ? item.accent : THEME.ringPrimary} size={20} strokeWidth={1} />
      </View>

      <View className='min-w-0 flex-1'>
        <View className='flex-row items-center gap-2.5'>
          {/* Tiêu đề (Đã bỏ đi dấu chấm nhỏ) */}
          <Text allowFontScaling={false} className='font-serif text-[18px] leading-6 text-ring-primary'>
            {item.title}
          </Text>
        </View>

        {/* Description */}
        <Text allowFontScaling={false} className='mt-0.5 font-sans text-[12px] leading-5 text-ring-primary/80'>
          {item.description}
        </Text>
      </View>

      {/* Checkbox vuông */}
      <View className={checkClass} style={isActive ? { backgroundColor: item.accent } : undefined}>
        {isActive ? <Check color='#FFFFFF' size={11} strokeWidth={2.5} /> : null}
      </View>
    </Pressable>
  )
}

function BioNotice({ selectedTypes }: { selectedTypes: BioEngravingType[] }) {
  const onlySoundWave = selectedTypes.length === 1 && selectedTypes.includes('sound_wave')
  const text = onlySoundWave
    ? 'SoundWave can be recorded and trimmed in the engraving step.'
    : 'After offline biometric capture at the Atelier, mock data is used for layout alignment.'

  return <NoticeMessage message={text} variant={onlySoundWave ? 'info' : 'warning'} />
}

export function PackageSelector() {
  const selectedTypes = useRingDesignStore((state) => state.package_types)
  const togglePackageType = useRingDesignStore((state) => state.togglePackageType)

  return (
    <View className='gap-6 pb-6 pt-2'>
      {/* --- BIO NOTICE (Moved Up) --- */}
      <BioNotice selectedTypes={selectedTypes} />

      {/* --- PACKAGE LIST --- */}
      <View>
        {PACKAGES.map((item, index) => (
          <PackageRow
            key={item.id}
            item={item}
            isActive={selectedTypes.includes(item.id)}
            isLast={index === PACKAGES.length - 1}
            onPress={() => togglePackageType(item.id)}
          />
        ))}
      </View>
    </View>
  )
}

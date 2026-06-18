import { THEME } from '@/constants/theme'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import type { BioEngravingType } from '@/types/ring-studio.types'
import { Check, Fingerprint, HeartPulse, Mic2, ShieldCheck } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

type PackageOption = {
  id: BioEngravingType
  title: string
  subtitle: string
  description: string
  accent: string
  icon: typeof Mic2
}

const PACKAGES: PackageOption[] = [
  {
    id: 'fingerprint',
    title: 'FingerPrint',
    subtitle: 'Ridge archive',
    description: 'A tactile signature for your Memory Card.',
    accent: '#7D9A8F',
    icon: Fingerprint
  },
  {
    id: 'heartbeat',
    title: 'HeartBeat',
    subtitle: 'Pulse trace',
    description: 'A quiet line drawn from your rhythm.',
    accent: '#B68178',
    icon: HeartPulse
  },
  {
    id: 'sound_wave',
    title: 'SoundWave',
    subtitle: 'Voice imprint',
    description: 'A short message shaped into a waveform.',
    accent: '#B69B7A',
    icon: Mic2
  }
]

// Ô checkbox vuông
const CHECK_BOX_CLASS = 'h-[18px] w-[18px] items-center justify-center rounded-[4px] border-[0.5px]'

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

  // Nét cắt ngang mỏng manh giữa các hàng
  const rowClass = `flex-row items-center gap-5 py-5 ${isLast ? '' : 'border-b-[0.5px] border-ring-primary/10'}`

  const checkClass = isActive
    ? `${CHECK_BOX_CLASS} border-transparent`
    : `${CHECK_BOX_CLASS} border-ring-primary/30 bg-transparent`

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
          {/* Tiêu đề */}
          <Text allowFontScaling={false} className='font-serif text-[18px] leading-6 text-ring-primary'>
            {item.title}
          </Text>
          <View
            className='h-[2px] w-[2px] rounded-full'
            style={{ backgroundColor: isActive ? item.accent : 'rgba(26, 54, 66, 0.3)' }}
          />
          <Text
            allowFontScaling={false}
            className='font-sans-light text-[9px] uppercase tracking-[0.2em]'
            style={{ color: isActive ? item.accent : 'rgba(26, 54, 66, 0.6)' }}
          >
            {item.subtitle}
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
    : 'Multiple biometrics use offline data capture at the Atelier. The next step uses mock data for layout alignment.'

  return (
    <View className='flex-row items-center gap-3 rounded-[8px] border-[0.5px] border-ring-primary/10 bg-ring-surface px-4 py-3.5'>
      <ShieldCheck color={THEME.ringAccent} size={16} strokeWidth={1.2} />
      <Text allowFontScaling={false} className='flex-1 font-sans text-[11px] leading-4 text-ring-primary/80'>
        {text}
      </Text>
    </View>
  )
}

export function PackageSelector() {
  const selectedTypes = useRingDesignStore((state) => state.package_types)
  const togglePackageType = useRingDesignStore((state) => state.togglePackageType)

  return (
    <View className='gap-6 pb-6 pt-2'>
      {/* --- HEADER --- */}
      <View className='flex-row items-end justify-between gap-4'>
        <View className='flex-1'>
          <Text
            allowFontScaling={false}
            className='font-sans-bold text-[9px] uppercase tracking-[0.3em] text-ring-accent'
          >
            Package Selection
          </Text>
          <Text allowFontScaling={false} className='mt-2 font-serif text-[22px] leading-7 text-ring-primary'>
            Biometric story.
          </Text>
        </View>

        {/* Counter*/}
        <Text
          allowFontScaling={false}
          className='font-sans-light mb-1 text-[11px] tracking-[0.15em] text-ring-primary/50'
        >
          <Text className='font-sans text-ring-primary'>{selectedTypes.length}</Text> / 3
        </Text>
      </View>

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

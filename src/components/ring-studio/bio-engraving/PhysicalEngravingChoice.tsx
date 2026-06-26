import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import type { BioEngravingType } from '@/types/ring-studio.types'
import { Pressable, Text, View } from 'react-native'
import { BIO_LABELS, BIO_META } from './bioEngravingConfig'

function MarkChoiceRow({
  type,
  isActive,
  onPress
}: {
  type: BioEngravingType
  isActive: boolean
  onPress: () => void
}) {
  const meta = BIO_META[type]
  const Icon = meta.icon
  const checkClass = isActive
    ? 'h-[20px] w-[20px] items-center justify-center rounded-full border-[0.5px] border-transparent'
    : 'h-[20px] w-[20px] items-center justify-center rounded-full border-[0.5px] border-ring-primary/30 bg-transparent'

  return (
    <Pressable
      onPress={onPress}
      className='flex-row items-center gap-5 border-b-[0.5px] border-ring-primary/10 py-5'
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
    >
      <View
        className='h-11 w-11 items-center justify-center rounded-[8px] border-[0.5px] bg-transparent'
        style={{ borderColor: isActive ? meta.accent : 'rgba(26, 54, 66, 0.2)' }}
      >
        <Icon color={isActive ? meta.accent : '#1A3642'} size={20} strokeWidth={1} />
      </View>

      <View className='min-w-0 flex-1'>
        <View className='flex-row items-center gap-2.5'>
          <Text allowFontScaling={false} className='font-serif text-[18px] leading-6 text-ring-primary'>
            {BIO_LABELS[type]}
          </Text>
          <View
            className='h-[2px] w-[2px] rounded-full'
            style={{ backgroundColor: isActive ? meta.accent : 'rgba(26, 54, 66, 0.3)' }}
          />
        </View>

        <Text allowFontScaling={false} className='mt-0.5 font-sans text-[12px] leading-5 text-ring-primary/80'>
          {meta.description}
        </Text>
      </View>

      <View className={checkClass} style={isActive ? { backgroundColor: meta.accent } : undefined}>
        {isActive ? <View className='h-[7px] w-[7px] rounded-full bg-white' /> : null}
      </View>
    </Pressable>
  )
}

export function PhysicalEngravingChoice() {
  const selectedTypes = useRingDesignStore((state) => state.package_types)
  const physicalEngravingType = useRingDesignStore((state) => state.customization_config.physicalEngravingType)
  const setPhysicalEngravingType = useRingDesignStore((state) => state.setPhysicalEngravingType)
  const engravableTypes = selectedTypes.filter((type) => type !== 'heartbeat')

  if (selectedTypes.length < 2 || engravableTypes.length === 0) return null

  return (
    <View className='gap-2'>
      <View className='flex-row items-end justify-between gap-4'>
        <View className='flex-1'>
          <Text
            allowFontScaling={false}
            className='mt-0.5 text-[10px] font-light uppercase leading-7 tracking-[0.32em] text-ring-primary'
          >
            Choose 1 mark to engrave on the ring.
          </Text>
        </View>
      </View>

      <View className='-mt-1'>
        {engravableTypes.map((type) => (
          <MarkChoiceRow
            key={type}
            type={type}
            isActive={physicalEngravingType === type}
            onPress={() => setPhysicalEngravingType(type)}
          />
        ))}
      </View>
    </View>
  )
}

import { PositionSlider } from '@/components/ring-studio/PositionSlider'
import { THEME } from '@/constants/theme'
import { ShieldCheck } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { PLACEMENTS } from './bioEngravingConfig'

type PlacementId = (typeof PLACEMENTS)[number]['id']

type LayoutSliderGroupProps = {
  position: number
  scale: number
  rotation: number
  onPositionChange: (position: number) => void
  onScaleChange: (scale: number) => void
  onRotationChange: (rotation: number) => void
}

export function EngravingNotice({ onlySoundWave }: { onlySoundWave: boolean }) {
  return (
    <View className='flex-row items-center gap-3 rounded-[8px] border-[0.5px] border-ring-primary/10 bg-ring-surface px-4 py-3.5'>
      <ShieldCheck color={THEME.ringAccent} size={16} strokeWidth={1.2} />
      <Text allowFontScaling={false} className='flex-1 font-sans text-[11px] leading-4 text-ring-primary/80'>
        {onlySoundWave
          ? 'The highlighted 3-second SoundWave segment will be rendered on the ring preview.'
          : 'Real biometric data will be captured offline. Saved position, scale, and rotation are used for final mapping.'}
      </Text>
    </View>
  )
}

export function PlacementControl({
  placement,
  onChange
}: {
  placement: PlacementId
  onChange: (placement: PlacementId) => void
}) {
  return (
    <View className='gap-3'>
      <Text
        allowFontScaling={false}
        className='px-1 font-sans-bold text-[9px] uppercase tracking-[0.24em] text-ring-primary/50'
      >
        Engraving Placement
      </Text>

      <View className='rounded-[24px] border border-white/70 bg-white/45 p-1.5'>
        <View className='flex-row gap-1.5'>
          {PLACEMENTS.map((item) => {
            const isActive = placement === item.id

            return (
              <Pressable
                key={item.id}
                onPress={() => onChange(item.id)}
                className={`flex-1 items-center justify-center rounded-[20px] px-3 py-3 ${
                  isActive ? 'bg-ring-primary' : 'bg-transparent'
                }`}
                style={({ pressed }) => ({ opacity: pressed && !isActive ? 0.62 : 1 })}
              >
                <Text
                  allowFontScaling={false}
                  className={`font-sans-bold text-[10px] uppercase tracking-[0.18em] ${
                    isActive ? 'text-white' : 'text-ring-primary/55'
                  }`}
                >
                  {item.label}
                </Text>
                <Text
                  allowFontScaling={false}
                  className={`mt-1 font-sans text-[10px] ${isActive ? 'text-white/60' : 'text-txt-muted'}`}
                >
                  {item.note}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export function LayoutSliderGroup({
  position,
  scale,
  rotation,
  onPositionChange,
  onScaleChange,
  onRotationChange
}: LayoutSliderGroupProps) {
  return (
    <View className='gap-5 rounded-[24px] border border-white/70 bg-white/45 p-5 shadow-sm shadow-ring-primary/5'>
      <PositionSlider
        label='Orbit'
        value={position}
        valueLabel={`${Math.round(position * 360)} deg`}
        onChange={onPositionChange}
      />
      <PositionSlider
        label='Scale'
        value={scale}
        valueLabel={`${Math.round(50 + scale * 100)}%`}
        onChange={onScaleChange}
      />
      <PositionSlider
        label='Rotate'
        value={rotation}
        valueLabel={`${Math.round((rotation - 0.5) * 180)} deg`}
        onChange={onRotationChange}
      />
    </View>
  )
}

export function AlignmentToolPanel(props: LayoutSliderGroupProps) {
  return (
    <View className='gap-5'>
      <LayoutSliderGroup {...props} />
    </View>
  )
}

import { NoticeMessage } from '@/components/common/NoticeMessage'
import { PositionSlider } from '@/components/ring-studio/PositionSlider'
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
  const message = onlySoundWave
    ? 'The highlighted 3-second SoundWave segment will be rendered on the ring preview.'
    : 'Real biometric data will be captured offline. Saved position, scale, and rotation are used for final mapping.'

  return <NoticeMessage message={message} variant={onlySoundWave ? 'info' : 'warning'} />
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

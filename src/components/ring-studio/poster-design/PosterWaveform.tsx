import { View } from 'react-native'

const HEIGHT_CLASSES = ['h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-7', 'h-8', 'h-9', 'h-10', 'h-12'] as const

function getHeightClass(value: number) {
  const normalized = Math.min(Math.max(value, 0), 88)
  const index = Math.min(HEIGHT_CLASSES.length - 1, Math.floor((normalized / 89) * HEIGHT_CLASSES.length))
  return HEIGHT_CLASSES[index]
}

type PosterWaveformProps = {
  values: number[]
  type: 'sound_wave' | 'heartbeat'
}

function sampleFullWaveform(values: number[], targetSize = 28) {
  if (values.length <= targetSize) return values

  return Array.from({ length: targetSize }, (_, index) => {
    const sourceIndex = Math.min(Math.floor((index / targetSize) * values.length), values.length - 1)
    return values[sourceIndex]
  })
}

export function PosterWaveform({ values, type }: PosterWaveformProps) {
  if (!values.length) return null

  const activeClass = type === 'heartbeat' ? 'bg-status-success' : 'bg-ring-primary'
  const displayedValues = sampleFullWaveform(values)

  return (
    <View className='h-full w-full flex-row items-center justify-between gap-1 overflow-hidden'>
      {displayedValues.map((value, index) => (
        <View key={`${type}-${value}-${index}`} className={`w-[2px] rounded-full ${getHeightClass(value)} ${activeClass}`} />
      ))}
    </View>
  )
}

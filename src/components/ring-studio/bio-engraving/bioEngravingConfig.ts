import { THEME } from '@/constants/theme'
import type { BioEngravingType } from '@/types/ring-studio.types'
import { Fingerprint, HeartPulse, Mic2 } from 'lucide-react-native'

export const BIO_LABELS: Record<BioEngravingType, string> = {
  sound_wave: 'SoundWave',
  fingerprint: 'FingerPrint',
  heartbeat: 'HeartBeat'
}

export const BIO_META: Record<
  BioEngravingType,
  {
    description: string
    accent: string
    icon: typeof Mic2
  }
> = {
  sound_wave: {
    description: 'Use a mock waveform to reserve the 3-second engraving layout.',
    accent: THEME.ringAccent,
    icon: Mic2
  },
  fingerprint: {
    description: 'A tactile ridge pattern prepared for a precise physical engraving.',
    accent: '#7D9A8F',
    icon: Fingerprint
  },
  heartbeat: {
    description: 'A quiet rhythm line prepared for a personal engraved trace.',
    accent: '#B68178',
    icon: HeartPulse
  }
}

export const PLACEMENTS = [
  { id: 'outer_band', label: 'Outer Band', note: 'Visible mark' },
  { id: 'inner_band', label: 'Inner Band', note: 'Private mark' }
] as const

export const SOUNDWAVE_CROP_SECONDS = 3
export const MOCK_SOUNDWAVE = [18, 28, 44, 26, 56, 72, 34, 48, 86, 52, 38, 64, 30, 46, 74, 58, 36, 68, 42, 24]

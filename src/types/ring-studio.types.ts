export type BioEngravingType = 'sound_wave' | 'fingerprint' | 'heartbeat'

export type EngravingPlacement = 'outer_band' | 'inner_band'

export type RingStudioTab = 'basic' | 'package' | 'engraving' | 'memory'

export type SavedRingMeasurement = {
  name: string
  size: string
  diameterMm: number
  mode: 'finger' | 'ring'
}

export type SoundWaveClip = {
  sourceUri?: string
  durationSeconds: number
  cropStartSeconds: number
  cropDurationSeconds: number
  amplitudes: number[]
}

export type BioEngravingConfig = {
  selectedTypes: BioEngravingType[]
  physicalEngravingType?: BioEngravingType
  placement: EngravingPlacement
  position: number
  scale: number
  rotation: number
  offsetX: number
  offsetY: number
  soundWave?: SoundWaveClip
  mockFingerprintSeed?: string
  mockHeartbeatPattern?: number[]
}

export type MemoryCardDraft = {
  cardTitle: string
  secretMessage: string
  dateLabel: string
  reuseSoundWaveVoice: boolean
  templateId: string
  userPhotoUri?: string
  croppedUserPhotoUri?: string
  userPhotoOffset?: {
    x: number
    y: number
  }
  userPhotoScale?: number
  userPhotoSourceSize?: {
    width: number
    height: number
  }
  userPhotoCrop?: {
    offset: {
      x: number
      y: number
    }
    size: {
      width: number
      height: number
    }
    displaySize: {
      width: number
      height: number
    }
    resizeMode: 'cover'
  }
}

export type RingDesignDraftPayload = {
  product_id?: string
  selected_material_id?: string
  selected_gemstone_id?: string
  selected_gemstone_shape?: string
  ring_size?: string
  selected_user_ring_size_id?: string
  package_types: BioEngravingType[]
  customization_config: BioEngravingConfig
  memory_card: MemoryCardDraft
  estimated_price: number
}

export type RingDesignDraftResponse = RingDesignDraftPayload & {
  id: string
  status: 'draft'
  updated_at: string
}

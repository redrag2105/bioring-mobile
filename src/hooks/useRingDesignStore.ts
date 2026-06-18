import type {
  BioEngravingConfig,
  BioEngravingType,
  EngravingPlacement,
  MemoryCardDraft,
  RingDesignDraftPayload,
  RingStudioTab,
  SoundWaveClip
} from '@/types/ring-studio.types'
import { create } from 'zustand'

const DEFAULT_AMPLITUDES = [18, 28, 44, 26, 56, 72, 34, 48, 86, 52, 38, 64, 30, 46, 74, 58, 36, 68, 42, 24]
const MOCK_HEARTBEAT = [8, 12, 54, 18, 10, 82, 20, 12, 46, 16, 8, 64, 22]

type RingDesignState = RingDesignDraftPayload & {
  activeTab: RingStudioTab
  setActiveTab: (tab: RingStudioTab) => void
  setProductId: (productId?: string) => void
  setBasicSpec: (
    spec: Partial<
      Pick<
        RingDesignDraftPayload,
        | 'selected_material_id'
        | 'selected_gemstone_id'
        | 'selected_gemstone_shape'
        | 'ring_size'
        | 'selected_user_ring_size_id'
      >
    >
  ) => void
  togglePackageType: (type: BioEngravingType) => void
  setPhysicalEngravingType: (type: BioEngravingType) => void
  setEngravingPosition: (position: number) => void
  setEngravingScale: (scale: number) => void
  setEngravingRotation: (rotation: number) => void
  setEngravingOffset: (axis: 'x' | 'y', value: number) => void
  setEngravingPlacement: (placement: EngravingPlacement) => void
  setSoundWaveClip: (clip: SoundWaveClip) => void
  updateSoundWaveCrop: (cropStartSeconds: number) => void
  updateMemoryCard: (memory: Partial<MemoryCardDraft>) => void
  getDraftPayload: () => RingDesignDraftPayload
}

const initialConfig: BioEngravingConfig = {
  selectedTypes: ['sound_wave'],
  physicalEngravingType: 'sound_wave',
  placement: 'outer_band',
  position: 0.42,
  scale: 0.62,
  rotation: 0.5,
  offsetX: 0.5,
  offsetY: 0.5,
  soundWave: {
    durationSeconds: 9,
    cropStartSeconds: 2,
    cropDurationSeconds: 3,
    amplitudes: DEFAULT_AMPLITUDES
  },
  mockFingerprintSeed: 'BIORING-STUDIO-FP',
  mockHeartbeatPattern: MOCK_HEARTBEAT
}

const calculateEstimatedPrice = (state: Pick<RingDesignDraftPayload, 'package_types' | 'selected_gemstone_id'>) => {
  const packagePremium = state.package_types.length * 780000
  const gemstonePremium = state.selected_gemstone_id ? 3200000 : 0
  return 2450000 + packagePremium + gemstonePremium
}

export const useRingDesignStore = create<RingDesignState>((set, get) => ({
  activeTab: 'basic',
  product_id: undefined,
  selected_material_id: 'm1-uuid',
  selected_gemstone_id: undefined,
  selected_gemstone_shape: 'Round',
  ring_size: 'Size 6',
  selected_user_ring_size_id: undefined,
  package_types: ['sound_wave'],
  customization_config: initialConfig,
  memory_card: {
    secretMessage: '',
    anniversaryDate: undefined,
    reuseSoundWaveVoice: true,
    templateId: 'ivory-vow'
  },
  estimated_price: calculateEstimatedPrice({ package_types: ['sound_wave'], selected_gemstone_id: undefined }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setProductId: (product_id) => set({ product_id }),
  setBasicSpec: (spec) =>
    set((state) => {
      const next = { ...state, ...spec }
      return {
        ...spec,
        estimated_price: calculateEstimatedPrice(next)
      }
    }),
  togglePackageType: (type) =>
    set((state) => {
      const exists = state.package_types.includes(type)
      const nextTypes = exists ? state.package_types.filter((item) => item !== type) : [...state.package_types, type]
      const guardedTypes = nextTypes.length ? nextTypes : state.package_types
      const physicalEngravingType =
        guardedTypes.length === 1
          ? guardedTypes[0]
          : state.package_types.length === 1 && guardedTypes.length > 1
            ? undefined
            : guardedTypes.includes(state.customization_config.physicalEngravingType as BioEngravingType)
              ? state.customization_config.physicalEngravingType
              : undefined

      return {
        package_types: guardedTypes,
        estimated_price: calculateEstimatedPrice({ ...state, package_types: guardedTypes }),
        customization_config: {
          ...state.customization_config,
          selectedTypes: guardedTypes,
          physicalEngravingType
        }
      }
    }),
  setPhysicalEngravingType: (physicalEngravingType) =>
    set((state) => ({
      customization_config: {
        ...state.customization_config,
        physicalEngravingType
      }
    })),
  setEngravingPosition: (position) =>
    set((state) => ({
      customization_config: {
        ...state.customization_config,
        position
      }
    })),
  setEngravingScale: (scale) =>
    set((state) => ({
      customization_config: {
        ...state.customization_config,
        scale
      }
    })),
  setEngravingRotation: (rotation) =>
    set((state) => ({
      customization_config: {
        ...state.customization_config,
        rotation
      }
    })),
  setEngravingOffset: (axis, value) =>
    set((state) => ({
      customization_config: {
        ...state.customization_config,
        [axis === 'x' ? 'offsetX' : 'offsetY']: value
      }
    })),
  setEngravingPlacement: (placement) =>
    set((state) => ({
      customization_config: {
        ...state.customization_config,
        placement
      }
    })),
  setSoundWaveClip: (clip) =>
    set((state) => ({
      customization_config: {
        ...state.customization_config,
        soundWave: clip
      }
    })),
  updateSoundWaveCrop: (cropStartSeconds) =>
    set((state) => ({
      customization_config: {
        ...state.customization_config,
        soundWave: state.customization_config.soundWave
          ? {
              ...state.customization_config.soundWave,
              cropStartSeconds
            }
          : undefined
      }
    })),
  updateMemoryCard: (memory) =>
    set((state) => ({
      memory_card: {
        ...state.memory_card,
        ...memory
      }
    })),
  getDraftPayload: () => {
    const state = get()
    return {
      product_id: state.product_id,
      selected_material_id: state.selected_material_id,
      selected_gemstone_id: state.selected_gemstone_id,
      selected_gemstone_shape: state.selected_gemstone_shape,
      ring_size: state.ring_size,
      selected_user_ring_size_id: state.selected_user_ring_size_id,
      package_types: state.package_types,
      customization_config: state.customization_config,
      memory_card: state.memory_card,
      estimated_price: state.estimated_price
    }
  }
}))

import { POSTER_MESSAGE_MAX_CHARS, POSTER_MOCK_BIOMETRICS, type PosterTemplate } from '@/constants/posterTemplates'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import type { MemoryCardDraft } from '@/types/ring-studio.types'
import { useSoundWavePlayback } from '@/components/ring-studio/bio-engraving/useSoundWavePlayback'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useMemo, useState } from 'react'
import { ImageBackground, View } from 'react-native'
import {
  EditableTextLayer,
  PosterBiometricLayer,
  PosterPhotoLayer
} from './PosterEditableLayers'

type PosterCanvasProps = {
  template: PosterTemplate
  editable?: boolean
  previewMode?: boolean
  fullScreen?: boolean
  draftOverride?: MemoryCardDraft
}

type CanvasSize = {
  width: number
  height: number
}

export function PosterCanvas({
  template,
  editable = false,
  previewMode = false,
  fullScreen = false,
  draftOverride
}: PosterCanvasProps) {
  const memory = useRingDesignStore((state) => state.memory_card)
  const packageTypes = useRingDesignStore((state) => state.package_types)
  const soundWave = useRingDesignStore((state) => state.customization_config.soundWave)
  const heartbeat = useRingDesignStore((state) => state.customization_config.mockHeartbeatPattern)
  const updateMemoryCard = useRingDesignStore((state) => state.updateMemoryCard)
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 0, height: 0 })
  const [isPickingPhoto, setIsPickingPhoto] = useState(false)
  const posterDraft = draftOverride ?? memory
  const isReadOnlyPreview = Boolean(draftOverride)
  const isOnlyRecordedSoundWave =
    !previewMode &&
    !isReadOnlyPreview &&
    packageTypes.length === 1 &&
    packageTypes.includes('sound_wave') &&
    Boolean(soundWave?.sourceUri)
  const photoUri = posterDraft.userPhotoUri || template.userPhotoPlaceholderUrl
  const shouldUseMockBiometrics = previewMode || packageTypes.length >= 2
  const soundWaveValues = shouldUseMockBiometrics ? POSTER_MOCK_BIOMETRICS.sound_wave : soundWave?.amplitudes ?? []
  const heartbeatValues = shouldUseMockBiometrics ? POSTER_MOCK_BIOMETRICS.heartbeat : heartbeat ?? []
  const shouldRenderSoundWave =
    Boolean(template.elements.sound_wave) &&
    (shouldUseMockBiometrics || packageTypes.includes('sound_wave')) &&
    Boolean(soundWaveValues.length)
  const shouldRenderHeartbeat =
    Boolean(template.elements.heartbeat) &&
    (shouldUseMockBiometrics || packageTypes.includes('heartbeat')) &&
    Boolean(heartbeatValues.length)
  const messageValue = useMemo(
    () => posterDraft.secretMessage.slice(0, POSTER_MESSAGE_MAX_CHARS),
    [posterDraft.secretMessage]
  )
  const { activePlaybackMode, handlePreviewPress } = useSoundWavePlayback({
    sourceUri: isOnlyRecordedSoundWave ? soundWave?.sourceUri : null,
    cropStart: soundWave?.cropStartSeconds ?? 0,
    trimEnd: soundWave?.durationSeconds ?? 0,
    duration: soundWave?.durationSeconds ?? 0
  })
  const rootClassName = fullScreen
    ? 'flex-1 w-full overflow-hidden bg-white'
    : 'aspect-[3/4] w-full overflow-hidden rounded-[24px] bg-white shadow-xl shadow-ring-primary/10'

  const handlePickImage = useCallback(async () => {
    if (isReadOnlyPreview) return
    setIsPickingPhoto(true)

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9
      })

      if (result.canceled) return
      const asset = result.assets[0]
      if (!asset?.uri) return
      updateMemoryCard({
        userPhotoUri: asset.uri,
        croppedUserPhotoUri: undefined,
        userPhotoOffset: { x: 0, y: 0 },
        userPhotoScale: 1,
        userPhotoSourceSize:
          asset.width && asset.height
            ? {
                width: asset.width,
                height: asset.height
              }
            : undefined,
        userPhotoCrop: undefined
      })
    } finally {
      setIsPickingPhoto(false)
    }
  }, [isReadOnlyPreview, updateMemoryCard])

  const handlePhotoTransformChange = useCallback(
    ({ offset, scale }: { offset: { x: number; y: number }; scale: number }) => {
      if (!isReadOnlyPreview) updateMemoryCard({ userPhotoOffset: offset, userPhotoScale: scale })
    },
    [isReadOnlyPreview, updateMemoryCard]
  )

  const handlePhotoCropChange = useCallback(
    (userPhotoCrop: MemoryCardDraft['userPhotoCrop']) => {
      if (!isReadOnlyPreview) updateMemoryCard({ userPhotoCrop })
    },
    [isReadOnlyPreview, updateMemoryCard]
  )

  return (
    <View
      className={rootClassName}
      pointerEvents={previewMode ? 'none' : 'auto'}
      onLayout={(event) => {
        setCanvasSize({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height
        })
      }}
    >
      <ImageBackground
        source={{ uri: template.backgroundImageUrl }}
        resizeMode='cover'
        className={`h-full w-full overflow-hidden ${template.backgroundClass}`}
      >
        {template.elements.photo && photoUri ? (
          <PosterPhotoLayer
            frame={template.elements.photo}
            uri={photoUri}
            editable={editable && !isReadOnlyPreview}
            isPicking={isPickingPhoto}
            offset={posterDraft.userPhotoOffset ?? { x: 0, y: 0 }}
            scale={posterDraft.userPhotoScale ?? 1}
            sourceSize={posterDraft.userPhotoSourceSize}
            onPickImage={handlePickImage}
            onTransformChange={handlePhotoTransformChange}
            onCropChange={handlePhotoCropChange}
          />
        ) : null}

        {template.elements.date ? (
          <EditableTextLayer
            frame={template.elements.date}
            value={posterDraft.dateLabel}
            editable={editable && !isReadOnlyPreview}
            onChangeText={(dateLabel) => {
              if (!isReadOnlyPreview) updateMemoryCard({ dateLabel })
            }}
            canvasWidth={canvasSize.width}
          />
        ) : null}

        {template.elements.title ? (
          <EditableTextLayer
            frame={template.elements.title}
            value={posterDraft.cardTitle}
            editable={editable && !isReadOnlyPreview}
            onChangeText={(cardTitle) => {
              if (!isReadOnlyPreview) updateMemoryCard({ cardTitle })
            }}
            canvasWidth={canvasSize.width}
          />
        ) : null}

        {template.elements.message ? (
          <EditableTextLayer
            frame={template.elements.message}
            value={messageValue}
            editable={editable && !isReadOnlyPreview}
            onChangeText={(secretMessage) =>
              !isReadOnlyPreview &&
              updateMemoryCard({ secretMessage: secretMessage.slice(0, POSTER_MESSAGE_MAX_CHARS) })
            }
            canvasWidth={canvasSize.width}
            showCounter
          />
        ) : null}

        {shouldRenderSoundWave && template.elements.sound_wave ? (
          <PosterBiometricLayer
            type='sound_wave'
            values={soundWaveValues}
            frame={template.elements.sound_wave}
            playback={
              isOnlyRecordedSoundWave
                ? {
                    isPlaying: activePlaybackMode === 'full',
                    durationSeconds: soundWave?.durationSeconds ?? 15,
                    onPress: () => void handlePreviewPress('full')
                  }
                : undefined
            }
          />
        ) : null}

        {shouldRenderHeartbeat && template.elements.heartbeat ? (
          <PosterBiometricLayer type='heartbeat' values={heartbeatValues} frame={template.elements.heartbeat} />
        ) : null}

        {previewMode ? <View className='absolute inset-0 bg-black/0' /> : null}
      </ImageBackground>
    </View>
  )
}

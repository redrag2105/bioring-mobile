import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import * as DocumentPicker from 'expo-document-picker'
import {
  RecordingPresets,
  createAudioPlayer,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from 'expo-audio'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Animated, Easing, Text, View } from 'react-native'
import { LayoutSliderGroup } from './EngravingControls'
import { SoundWaveRecorderCard } from './SoundWaveRecorderCard'
import { SoundWaveTrimDeck } from './SoundWaveTrimDeck'
import { MOCK_SOUNDWAVE, SOUNDWAVE_CROP_SECONDS } from './bioEngravingConfig'
import { meteringToAmplitude, normalizeAmplitudes } from './soundWaveUtils'
import { useSoundWavePlayback } from './useSoundWavePlayback'

const AUDIO_RECORDING_OPTIONS = { ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true }
const MAX_RECORDING_SECONDS = 15
const UPLOAD_DURATION_TOLERANCE_SECONDS = 0.25

type OnlineSoundWaveEditorProps = {
  position: number
  scale: number
  rotation: number
  onPositionChange: (position: number) => void
  onScaleChange: (scale: number) => void
  onRotationChange: (rotation: number) => void
  placementControl?: ReactNode
  allowCapture?: boolean
}

async function getAudioDurationSeconds(uri: string) {
  const player = createAudioPlayer({ uri }, { updateInterval: 80 })

  try {
    for (let attempt = 0; attempt < 35; attempt += 1) {
      const duration = player.duration || player.currentStatus.duration
      if (Number.isFinite(duration) && duration > 0) return duration
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
  } finally {
    player.remove()
  }

  return 0
}

export function OnlineSoundWaveEditor({
  position,
  scale,
  rotation,
  onPositionChange,
  onScaleChange,
  onRotationChange,
  placementControl,
  allowCapture = true
}: OnlineSoundWaveEditorProps) {
  const soundWave = useRingDesignStore((state) => state.customization_config.soundWave)
  const setSoundWaveClip = useRingDesignStore((state) => state.setSoundWaveClip)
  const updateSoundWaveCrop = useRingDesignStore((state) => state.updateSoundWaveCrop)
  const audioRecorder = useAudioRecorder(AUDIO_RECORDING_OPTIONS)
  const recorderState = useAudioRecorderState(audioRecorder, 120)
  const [isPreparing, setIsPreparing] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [meterSamples, setMeterSamples] = useState<number[]>([])
  const recordingPulse = useRef(new Animated.Value(1)).current
  const recordingLimitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stopRecordingRef = useRef<() => void>(() => undefined)
  const isMountedRef = useRef(true)
  const isStoppingRef = useRef(false)

  const duration = soundWave?.durationSeconds ?? MAX_RECORDING_SECONDS
  const cropDuration = soundWave?.cropDurationSeconds ?? SOUNDWAVE_CROP_SECONDS
  const hasRecordedClip = Boolean(soundWave?.sourceUri)
  const cropStart = soundWave?.cropStartSeconds ?? 0
  const amplitudes = useMemo(
    () => (hasRecordedClip ? (soundWave?.amplitudes ?? MOCK_SOUNDWAVE) : []),
    [hasRecordedClip, soundWave?.amplitudes]
  )
  const isRecording = recorderState.isRecording
  const trimEnd = Math.min(cropStart + cropDuration, duration)
  const { activePlaybackMode, handlePreviewPress, playbackTime, stopPlayback } = useSoundWavePlayback({
    sourceUri: soundWave?.sourceUri,
    cropStart,
    trimEnd,
    duration,
    onPlaybackError: () => setRecordingError('Playback could not start. Please try again.')
  })

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      if (recordingLimitTimeoutRef.current) {
        clearTimeout(recordingLimitTimeoutRef.current)
        recordingLimitTimeoutRef.current = null
      }
      void stopPlayback()
    }
  }, [stopPlayback])

  useEffect(() => {
    if (!isRecording) {
      recordingPulse.stopAnimation()
      recordingPulse.setValue(1)
      return
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(recordingPulse, {
          toValue: 0.48,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(recordingPulse, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    )

    pulseLoop.start()
    return () => pulseLoop.stop()
  }, [isRecording, recordingPulse])

  useEffect(() => {
    if (!recorderState.isRecording) return
    const amplitude = meteringToAmplitude(recorderState.metering)
    if (!amplitude) return

    setMeterSamples((current) => [...current.slice(-95), amplitude])
  }, [recorderState.durationMillis, recorderState.isRecording, recorderState.metering])

  const startRecording = async () => {
    setIsPreparing(true)
    setRecordingError(null)
    void stopPlayback()

    try {
      const permission = await requestRecordingPermissionsAsync()
      if (!permission.granted) {
        setRecordingError('Microphone permission is required to record SoundWave.')
        return
      }

      await setAudioModeAsync({
        allowsRecording: true,
        interruptionMode: 'doNotMix',
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false
      })
      setMeterSamples([])
      await audioRecorder.prepareToRecordAsync(AUDIO_RECORDING_OPTIONS)
      audioRecorder.record()
      recordingLimitTimeoutRef.current = setTimeout(() => {
        stopRecordingRef.current()
      }, MAX_RECORDING_SECONDS * 1000)
    } catch (e) {
      console.error('==== CANNOT RECORD ====', e)
      if (isMountedRef.current) setRecordingError('Recording could not start. Please try again.')
    } finally {
      if (isMountedRef.current) setIsPreparing(false)
    }
  }

  const stopRecording = async () => {
    if (isStoppingRef.current) return
    isStoppingRef.current = true
    setIsPreparing(true)
    setRecordingError(null)
    if (recordingLimitTimeoutRef.current) {
      clearTimeout(recordingLimitTimeoutRef.current)
      recordingLimitTimeoutRef.current = null
    }

    try {
      await audioRecorder.stop()
      const status = audioRecorder.getStatus()
      const recordingUri = audioRecorder.uri ?? status.url
      if (!recordingUri) throw new Error('Missing recording URI')

      const nextDuration = Math.max(
        SOUNDWAVE_CROP_SECONDS,
        Math.min(
          MAX_RECORDING_SECONDS,
          Number(((status.durationMillis || recorderState.durationMillis || 9000) / 1000).toFixed(1))
        )
      )

      setSoundWaveClip({
        sourceUri: recordingUri,
        durationSeconds: nextDuration,
        cropStartSeconds: 0,
        cropDurationSeconds: SOUNDWAVE_CROP_SECONDS,
        amplitudes: normalizeAmplitudes(meterSamples)
      })
    } catch {
      if (isMountedRef.current) setRecordingError('Recording could not be saved. Please try again.')
    } finally {
      isStoppingRef.current = false
      if (isMountedRef.current) setIsPreparing(false)
    }
  }

  useEffect(() => {
    stopRecordingRef.current = () => {
      void stopRecording()
    }
  })

  const handleRecordPress = () => {
    if (!allowCapture) return
    if (isRecording) void stopRecording()
    else void startRecording()
  }

  const handleUploadPress = async () => {
    if (!allowCapture || isPreparing || isRecording) return
    setIsPreparing(true)
    setRecordingError(null)
    void stopPlayback()

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: false,
        base64: false
      })

      if (result.canceled) return

      const asset = result.assets[0]
      if (!asset?.uri) throw new Error('Missing uploaded audio URI')

      const uploadedDuration = await getAudioDurationSeconds(asset.uri)
      if (!uploadedDuration) {
        setRecordingError('Uploaded audio could not be read. Please choose another file.')
        return
      }

      if (uploadedDuration > MAX_RECORDING_SECONDS + UPLOAD_DURATION_TOLERANCE_SECONDS) {
        setRecordingError('Please upload an audio file that is 15 seconds or shorter.')
        return
      }

      setSoundWaveClip({
        sourceUri: asset.uri,
        durationSeconds: Math.max(SOUNDWAVE_CROP_SECONDS, Number(uploadedDuration.toFixed(1))),
        cropStartSeconds: 0,
        cropDurationSeconds: SOUNDWAVE_CROP_SECONDS,
        amplitudes: normalizeAmplitudes([])
      })
    } catch (e) {
      console.error('==== CANNOT UPLOAD AUDIO ====', e)
      if (isMountedRef.current) setRecordingError('Audio upload could not be completed. Please try again.')
    } finally {
      if (isMountedRef.current) setIsPreparing(false)
    }
  }

  const handleCropChange = (nextCropStart: number) => {
    void stopPlayback()
    updateSoundWaveCrop(nextCropStart)
  }

  return (
    <View className='gap-5'>
      {!allowCapture ? (
        <View className='rounded-[18px] border border-ring-accent/20 bg-ring-accent/5 px-4 py-3'>
          <Text className='font-sans text-[11px] leading-5 text-ring-primary/75'>
            SoundWave is used as the visual engraving mark for this package. Recording and upload are available only when SoundWave is the only selected package.
          </Text>
        </View>
      ) : null}

      {allowCapture ? (
        <SoundWaveRecorderCard
          isPreparing={isPreparing}
          isRecording={isRecording}
          hasRecordedClip={hasRecordedClip}
          durationMillis={recorderState.durationMillis}
          recordingError={recordingError}
          recordingPulse={recordingPulse}
          onRecordPress={handleRecordPress}
          onUploadPress={handleUploadPress}
        />
      ) : null}

      {allowCapture && hasRecordedClip ? (
        <SoundWaveTrimDeck
          amplitudes={amplitudes}
          cropStart={cropStart}
          duration={duration}
          cropDuration={cropDuration}
          trimEnd={trimEnd}
          playheadTime={playbackTime}
          activePlaybackMode={activePlaybackMode}
          onCropChange={handleCropChange}
          onPreviewPress={handlePreviewPress}
        />
      ) : null}

      {allowCapture ? (
        hasRecordedClip ? (
          <>
            {placementControl}
            <LayoutSliderGroup
              position={position}
              scale={scale}
              rotation={rotation}
              onPositionChange={onPositionChange}
              onScaleChange={onScaleChange}
              onRotationChange={onRotationChange}
            />
          </>
        ) : null
      ) : (
        <>
          {placementControl}
          <LayoutSliderGroup
            position={position}
            scale={scale}
            rotation={rotation}
            onPositionChange={onPositionChange}
            onScaleChange={onScaleChange}
            onRotationChange={onRotationChange}
          />
        </>
      )}
    </View>
  )
}

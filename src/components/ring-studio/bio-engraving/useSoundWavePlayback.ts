import { setAudioModeAsync, setIsAudioActiveAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { useCallback, useEffect, useState } from 'react'

export type SoundWavePlaybackMode = 'full' | 'trim'

type UseSoundWavePlaybackParams = {
  sourceUri?: string | null
  cropStart: number
  trimEnd: number
  duration: number
  onPlaybackError?: () => void
}

async function waitForNativePlayerLoad(player: { isLoaded: boolean }) {
  const startedAt = Date.now()

  while (!player.isLoaded && Date.now() - startedAt < 1200) {
    await new Promise((resolve) => {
      setTimeout(resolve, 50)
    })
  }
}

export function useSoundWavePlayback({
  sourceUri,
  cropStart,
  trimEnd,
  duration,
  onPlaybackError
}: UseSoundWavePlaybackParams) {
  const audioPlayer = useAudioPlayer(sourceUri ?? null, { updateInterval: 80 })
  const audioPlayerStatus = useAudioPlayerStatus(audioPlayer)
  const [activePlaybackMode, setActivePlaybackMode] = useState<SoundWavePlaybackMode | null>(null)
  const playbackTime = activePlaybackMode ? audioPlayerStatus.currentTime : cropStart

  const safePausePlayer = useCallback(() => {
    try {
      audioPlayer.pause()
    } catch {
      // expo-audio can invalidate native shared objects while source hooks swap.
    }
  }, [audioPlayer])

  const safeSeekPlayer = useCallback(
    async (time: number) => {
      try {
        await audioPlayer.seekTo(time)
      } catch {
        // Ignore stale native player handles during source swaps.
      }
    },
    [audioPlayer]
  )

  const safeReplacePlayerSource = useCallback(() => {
    if (!sourceUri) return false

    try {
      audioPlayer.replace(sourceUri)
      audioPlayer.volume = 1
      return true
    } catch {
      onPlaybackError?.()
      setActivePlaybackMode(null)
      return false
    }
  }, [audioPlayer, onPlaybackError, sourceUri])

  const safePlayPlayer = useCallback(() => {
    try {
      audioPlayer.play()
      return true
    } catch {
      onPlaybackError?.()
      setActivePlaybackMode(null)
      return false
    }
  }, [audioPlayer, onPlaybackError])

  const stopPlayback = useCallback(
    async (resetTime = cropStart) => {
      safePausePlayer()
      await safeSeekPlayer(resetTime)
      setActivePlaybackMode(null)
    },
    [cropStart, safePausePlayer, safeSeekPlayer]
  )

  useEffect(() => {
    return () => {
      safePausePlayer()
    }
  }, [safePausePlayer])

  useEffect(() => {
    if (!activePlaybackMode) return
    if (!audioPlayerStatus.playing) return

    const endTime = activePlaybackMode === 'trim' ? trimEnd : duration
    const resetTime = activePlaybackMode === 'trim' ? cropStart : 0

    if (audioPlayerStatus.currentTime >= endTime || audioPlayerStatus.didJustFinish) {
      void stopPlayback(resetTime)
    }
  }, [
    activePlaybackMode,
    audioPlayerStatus.currentTime,
    audioPlayerStatus.didJustFinish,
    audioPlayerStatus.playing,
    cropStart,
    duration,
    stopPlayback,
    trimEnd
  ])

  const handlePreviewPress = useCallback(
    async (mode: SoundWavePlaybackMode) => {
      if (!sourceUri) return

      try {
        if (activePlaybackMode === mode) {
          await stopPlayback(mode === 'trim' ? cropStart : 0)
          return
        }

        if (audioPlayerStatus.playing) safePausePlayer()

        await setIsAudioActiveAsync(true)
        await setAudioModeAsync({
          allowsRecording: false,
          interruptionMode: 'mixWithOthers',
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          shouldRouteThroughEarpiece: false
        })
        if (!safeReplacePlayerSource()) return
        await waitForNativePlayerLoad(audioPlayer)
        await safeSeekPlayer(mode === 'trim' ? cropStart : 0)
        if (safePlayPlayer()) setActivePlaybackMode(mode)
      } catch {
        onPlaybackError?.()
        setActivePlaybackMode(null)
      }
    },
    [
      activePlaybackMode,
      audioPlayerStatus.playing,
      audioPlayer,
      cropStart,
      onPlaybackError,
      safePausePlayer,
      safePlayPlayer,
      safeReplacePlayerSource,
      safeSeekPlayer,
      sourceUri,
      stopPlayback
    ]
  )

  return {
    activePlaybackMode,
    handlePreviewPress,
    playbackTime,
    stopPlayback
  }
}

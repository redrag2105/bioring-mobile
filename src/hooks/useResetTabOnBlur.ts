import { useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import type { ScrollView } from 'react-native'

type ResetTabOnBlurOptions = {
  onReset?: () => void
}

export function useResetTabOnBlur(options: ResetTabOnBlurOptions = {}) {
  const scrollRef = useRef<ScrollView>(null)
  const [resetKey, setResetKey] = useState(0)
  const { onReset } = options

  useFocusEffect(
    useCallback(() => {
      return () => {
        scrollRef.current?.scrollTo({ y: 0, animated: false })
        onReset?.()
        setResetKey((currentKey) => currentKey + 1)
      }
    }, [onReset])
  )

  return { resetKey, scrollRef }
}

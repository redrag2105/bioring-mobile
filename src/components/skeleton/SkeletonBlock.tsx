import { View } from 'react-native'
import type { ReactNode } from 'react'

type SkeletonBlockProps = {
  children?: ReactNode
  className?: string
}

export function SkeletonBlock({ children, className = '' }: SkeletonBlockProps) {
  return <View className={`rounded-[18px] border border-ui-border bg-ring-surface ${className}`}>{children}</View>
}

import { Platform } from 'react-native'

export const THEME = {
  paper: '#f9f9f9',
  paperDark: '#f0f0f0',
  forest: '#14281d',
  bioringMain: '#d4a574',
  bioringDeep: '#0d1a13',
  ink: '#14281d',
  inkLight: '#3a5a40',
  inkMuted: '#5a7a68',
  clay: '#e6b8a2',
  gold: '#d4a574',
  info: '#3b82f6',
  infoBg: '#eff6ff',
  warningBg: '#fef3c7',
  warning: '#d97706',
  error: '#ef4444', //#dc2626
  errorLight: '#dc26261a',
  errorBg: '#fef2f2'
} as const

export const FONTS = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' })
} as const

export type ThemeColors = keyof typeof THEME

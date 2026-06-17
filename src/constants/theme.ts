import { Platform } from 'react-native'

export const THEME = {
  ringPrimary: '#1A3642',
  ringSecondary: '#0C1F27',
  ringAccent: '#B69B7A',
  ringBackground: '#F8F7F5',
  ringSurface: '#FFFFFF',

  textMain: '#1E2328',
  textBody: '#4A525A',
  textMuted: '#8C939A',
  textInverse: '#FFFFFF',

  btnPrimaryBg: '#B69B7A',
  btnPrimaryText: '#1E2328',
  btnPrimaryHover: '#A08768',
  btnSecondaryBorder: '#1A3642',
  btnDisabledBg: '#EAE7E1',
  btnDisabledText: '#A8A39C',
  borderLight: '#E6E4E0',

  statusError: '#A85A54',
  statusSuccess: '#4A6B5C',
} as const

export const FONTS = {
  serif: Platform.select({ ios: 'Gretha-Regular', android: 'Gretha-Regular', default: 'Gretha-Regular' }),
  serifItalic: Platform.select({ ios: 'Gretha-SemiBoldItalic', android: 'Gretha-SemiBoldItalic', default: 'Gretha-SemiBoldItalic' }),
  serifMedium: Platform.select({ ios: 'Gretha-Medium', android: 'Gretha-Medium', default: 'Gretha-Medium' }),
  serifSemibold: Platform.select({ ios: 'Gretha-Medium', android: 'Gretha-Medium', default: 'Gretha-Medium' }),
  serifBold: Platform.select({ ios: 'Gretha-Bold', android: 'Gretha-Bold', default: 'Gretha-Bold' }),
  sans: Platform.select({ ios: 'Lato', android: 'Lato', default: 'Lato' }),
  sansBold: Platform.select({ ios: 'Lato-Bold', android: 'Lato-Bold', default: 'Lato-Bold' }),
} as const

export type ThemeColors = keyof typeof THEME

export const SPACING = {
  screenX: 'px-5',
  sectionGap: 'gap-5',
  cardGap: 'gap-3',
  controlPadding: 'px-4 py-3',
  cardPadding: 'p-3',
} as const

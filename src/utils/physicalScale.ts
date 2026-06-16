import { PixelRatio } from 'react-native'

const MILLIMETERS_PER_INCH = 25.4
const DENSITY_INDEPENDENT_PIXELS_PER_INCH = 160

export function mmToLogicalPixels(mm: number) {
  return PixelRatio.roundToNearestPixel((mm / MILLIMETERS_PER_INCH) * DENSITY_INDEPENDENT_PIXELS_PER_INCH)
}

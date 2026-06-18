import { STUDIO_PHYSICAL_MEASURE_OPTIONS } from '@/constants/studioMeasure'

export function getSizeNumber(size?: string) {
  return size?.replace(/[^0-9]/g, '') ?? ''
}

export function findSizeOptionByNumber(sizeNumber: string) {
  return STUDIO_PHYSICAL_MEASURE_OPTIONS.find((option) => getSizeNumber(option.size) === sizeNumber)
}

export function generateSoundWaveAmplitudes() {
  return Array.from({ length: 64 }, (_, index) => {
    const breath = Math.sin(index * 0.58) * 24
    const consonant = index % 9 === 0 ? 28 : 0
    const pause = index % 17 === 0 ? -12 : 0
    return Math.max(12, Math.round(38 + Math.abs(breath) + consonant + pause))
  })
}

export function meteringToAmplitude(metering?: number) {
  if (typeof metering !== 'number') return undefined
  const normalized = Math.min(Math.max((metering + 60) / 60, 0), 1)
  return Math.round(12 + normalized * 76)
}

export function normalizeAmplitudes(samples: number[], size = 64) {
  if (!samples.length) return generateSoundWaveAmplitudes()

  return Array.from({ length: size }, (_, index) => {
    const sourceIndex = Math.min(Math.floor((index / size) * samples.length), samples.length - 1)
    return Math.max(12, Math.min(88, Math.round(samples[sourceIndex])))
  })
}

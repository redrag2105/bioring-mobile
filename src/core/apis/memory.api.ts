import type { MemoryCard } from '@/types/memory.types'

const memoryCards: MemoryCard[] = [
  {
    id: 'memory-signature-band',
    productName: 'Signature Memory Band',
    activatedAt: 'Activated May 18, 2026',
    ringImageUrl: 'https://pngimg.com/uploads/ring/ring_PNG10.png',
    qrCode: 'BRG-MEM-2048',
    templateId: 'champagne-archive',
    archivalId: 'BRG-MEM-2048',
    posterDraft: {
      cardTitle: 'A Quiet Vow',
      secretMessage: 'The afternoon light stayed with us, folded into every small promise we kept after.',
      dateLabel: 'May 18, 2026',
      reuseSoundWaveVoice: true,
      templateId: 'champagne-archive'
    }
  },
  {
    id: 'memory-heartbeat-duo',
    productName: 'Heartbeat Duo Ring',
    activatedAt: 'Activated May 02, 2026',
    ringImageUrl: 'https://pngimg.com/uploads/ring/ring_PNG24.png',
    qrCode: 'BRG-MEM-1932',
    templateId: 'avant-garde-offset',
    archivalId: 'BRG-MEM-1932',
    posterDraft: {
      cardTitle: 'North Window',
      secretMessage: 'A song, a street corner, and the exact second the city felt newly ours.',
      dateLabel: 'May 02, 2026',
      reuseSoundWaveVoice: true,
      templateId: 'avant-garde-offset'
    }
  },
  {
    id: 'memory-anniversary-gold',
    productName: 'Anniversary Gold Loop',
    activatedAt: 'Activated April 11, 2026',
    ringImageUrl: 'https://pngimg.com/uploads/ring/ring_PNG54.png',
    qrCode: 'BRG-MEM-1821',
    templateId: 'royal-botanical',
    archivalId: 'BRG-MEM-1821',
    posterDraft: {
      cardTitle: 'Garden Hour',
      secretMessage: 'A private archive of laughter, fingerprints, and one golden evening we keep returning to.',
      dateLabel: 'April 11, 2026',
      reuseSoundWaveVoice: true,
      templateId: 'royal-botanical'
    }
  },
  {
    id: 'memory-ivory-keepsake',
    productName: 'Ivory Keepsake Ring',
    activatedAt: 'Activated March 24, 2026',
    ringImageUrl: 'https://pngimg.com/uploads/ring/ring_PNG14.png',
    qrCode: 'BRG-MEM-1764',
    templateId: 'minimalist-photo-bottom',
    archivalId: 'BRG-MEM-1764',
    posterDraft: {
      cardTitle: 'Soft Arrival',
      secretMessage: 'The first morning after, when every room seemed to understand our names.',
      dateLabel: 'March 24, 2026',
      reuseSoundWaveVoice: true,
      templateId: 'minimalist-photo-bottom'
    }
  }
]

export async function getMemoryCards(): Promise<MemoryCard[]> {
  return memoryCards
}

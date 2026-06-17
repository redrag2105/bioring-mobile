import type { MemoryCard } from '@/types/memory.types'

const memoryCards: MemoryCard[] = [
  {
    id: 'memory-signature-band',
    productName: 'Signature Memory Band',
    activatedAt: 'Activated May 18, 2026',
    ringImageUrl: 'https://pngimg.com/uploads/ring/ring_PNG10.png',
    qrCode: 'BRG-MEM-2048'
  },
  {
    id: 'memory-heartbeat-duo',
    productName: 'Heartbeat Duo Ring',
    activatedAt: 'Activated May 02, 2026',
    ringImageUrl: 'https://pngimg.com/uploads/ring/ring_PNG24.png',
    qrCode: 'BRG-MEM-1932'
  },
  {
    id: 'memory-anniversary-gold',
    productName: 'Anniversary Gold Loop',
    activatedAt: 'Activated April 11, 2026',
    ringImageUrl: 'https://pngimg.com/uploads/ring/ring_PNG54.png',
    qrCode: 'BRG-MEM-1821'
  }
]

export async function getMemoryCards(): Promise<MemoryCard[]> {
  return memoryCards
}

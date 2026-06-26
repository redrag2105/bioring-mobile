import type { MemoryCardDraft } from './ring-studio.types'

export type MemoryCard = {
  id: string
  productName: string
  activatedAt: string
  ringImageUrl: string
  qrCode: string
  templateId: string
  archivalId: string
  posterDraft: MemoryCardDraft
}

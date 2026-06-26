import type { OrderStatus } from '@/types/orders.types'

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'DRAFT',
  'PENDING_REVIEW',
  'PENDING_DEPOSIT',
  'IN_PRODUCTION',
  'READY_FOR_DELIVERY',
  'SHIPPING',
  'COMPLETED'
]

export const PICKUP_STATUS_FLOW: OrderStatus[] = [
  'DRAFT',
  'PENDING_REVIEW',
  'PENDING_DEPOSIT',
  'IN_PRODUCTION',
  'READY_FOR_DELIVERY',
  'READY_FOR_PICKUP',
  'COMPLETED'
]

export const ORDER_STATUS_META: Record<
  OrderStatus,
  {
    label: string
    shortLabel: string
    title: string
    description: string
    actions: string[]
  }
> = {
  DRAFT: {
    label: 'Draft',
    shortLabel: 'Draft',
    title: 'Design is still yours to shape',
    description: 'You can continue editing the ring model, engraving position, and attached biometric data.',
    actions: ['Continue Designing', 'Submit for Review']
  },
  PENDING_REVIEW: {
    label: 'Pending Review',
    shortLabel: 'Review',
    title: 'BioRing is checking feasibility',
    description: 'The design is locked while Manager/Admin reviews production constraints and engraving quality.',
    actions: ['View Design Details']
  },
  PENDING_DEPOSIT: {
    label: 'Pending Deposit',
    shortLabel: 'Deposit',
    title: 'Approved design, deposit needed',
    description: 'Pay the deposit to release this order to the workshop immediately.',
    actions: ['Pay Deposit', 'View Offline Payment Guide']
  },
  IN_PRODUCTION: {
    label: 'In Production',
    shortLabel: 'Crafting',
    title: 'Your ring is being crafted',
    description: 'Goldsmiths are producing the ring and preparing it for workshop QA.',
    actions: ['View Production Progress']
  },
  READY_FOR_DELIVERY: {
    label: 'Ready for Delivery',
    shortLabel: 'Ready',
    title: 'Actual media is ready',
    description: 'Review real photos/videos, choose delivery, and settle the balance.',
    actions: ['View Actual Photos/Videos', 'Select Delivery Method & Pay Balance']
  },
  SHIPPING: {
    label: 'Shipping',
    shortLabel: 'Shipping',
    title: 'Full payment received',
    description: 'Your package is on the way and will complete after successful delivery.',
    actions: ['Track Shipping']
  },
  READY_FOR_PICKUP: {
    label: 'Ready for Pickup',
    shortLabel: 'Pickup',
    title: 'Waiting at the counter',
    description: 'Bring your pickup QR to the store counter to receive the finished ring.',
    actions: ['Scan QR for Pickup']
  },
  COMPLETED: {
    label: 'Completed',
    shortLabel: 'Done',
    title: 'The ring is in your hands',
    description: 'Warranty, QR Memory Card management, and Secret code controls are now unlocked.',
    actions: ['Manage QR & Secret Code', 'Request Service / Warranty']
  }
}

export type OrderFilterKey = 'ALL' | OrderStatus

export const ORDER_FILTERS: { key: OrderFilterKey; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'PENDING_REVIEW', label: 'Review' },
  { key: 'PENDING_DEPOSIT', label: 'Deposit' },
  { key: 'IN_PRODUCTION', label: 'Production' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready' },
  { key: 'SHIPPING', label: 'Shipping' },
  { key: 'READY_FOR_PICKUP', label: 'Pickup' },
  { key: 'COMPLETED', label: 'Done' }
]

import type { OrderRecord, OrderStatus, OrderSummary } from '@/types/orders.types'

const now = '2026-06-26T09:00:00.000Z'

const statusNotes: Record<OrderStatus, string> = {
  DRAFT: 'Saved from Ring Studio before submit.',
  PENDING_REVIEW: 'Design locked for manager feasibility review.',
  PENDING_DEPOSIT: 'Manager approved. Deposit is required before production.',
  IN_PRODUCTION: 'Deposit confirmed. Workshop is crafting the ring.',
  READY_FOR_DELIVERY: 'Actual photos uploaded. Customer must pay balance.',
  SHIPPING: 'Paid in full and handed to carrier.',
  READY_FOR_PICKUP: 'Paid in full and waiting at store counter.',
  COMPLETED: 'Delivered to customer. Warranty activated.'
}

function makeOrder(index: number, status: OrderStatus, overrides: Partial<OrderRecord> = {}): OrderRecord {
  const total = 6800000 + index * 920000
  const paid =
    status === 'DRAFT' || status === 'PENDING_REVIEW' || status === 'PENDING_DEPOSIT' ? 0 : Math.round(total * 0.4)
  const fullyPaid = status === 'SHIPPING' || status === 'READY_FOR_PICKUP' || status === 'COMPLETED'

  return {
    id: `ord_${index}`,
    order_code: `BRG-2026-${1040 + index}`,
    user_id: 'usr_2048',
    guest_customer_id: null,
    design_draft_id: `draft_${index}`,
    order_type: index === 3 ? 'OFFLINE' : 'ONLINE',
    package_type: index % 3 === 0 ? 'FINGERPRINT' : index % 2 === 0 ? 'SOUNDWAVE' : 'HEARTBEAT',
    capture_route: index === 3 ? 'STORE_BIOMETRIC' : 'RING_STUDIO',
    design_source: index === 3 ? 'STAFF_CAPTURED' : 'CUSTOMER_DRAFT',
    status,
    subtotal: total - 350000,
    service_fee: 250000,
    extra_fee: 100000,
    discount_amount: 0,
    total_price: total,
    paid_amount: fullyPaid ? total : paid,
    remaining_amount: fullyPaid ? 0 : total - paid,
    note: statusNotes[status],
    created_by_staff_id: index === 3 ? 'staff_store_12' : null,
    approved_by_manager_id: [
      'PENDING_DEPOSIT',
      'IN_PRODUCTION',
      'READY_FOR_DELIVERY',
      'SHIPPING',
      'READY_FOR_PICKUP',
      'COMPLETED'
    ].includes(status)
      ? 'mgr_rose_01'
      : null,
    created_at: `2026-06-${10 + index}T08:30:00.000Z`,
    updated_at: now,
    ...overrides
  }
}

function makeSummary(index: number, status: OrderStatus, extra: Partial<OrderSummary> = {}): OrderSummary {
  const order = makeOrder(index, status, extra.order)
  const engravingId = `eng_${index}`
  const approved = order.approved_by_manager_id ? `ver_${index}_2` : null
  const deposit = Math.round(order.total_price * 0.4)

  return {
    order,
    engraving: {
      id: engravingId,
      order_id: order.id,
      product_id: `ring_${index}`,
      unique_product_id: status === 'COMPLETED' ? `u_ring_${index}` : null,
      approved_version_id: approved,
      biometric_consent_at:
        order.capture_route === 'STORE_BIOMETRIC' ? '2026-06-13T03:20:00.000Z' : '2026-06-12T14:18:00.000Z',
      raw_biometric_deleted_at: status === 'COMPLETED' ? '2026-06-25T10:00:00.000Z' : null,
      status: approved ? 'APPROVED' : 'DRAFTING',
      created_at: order.created_at,
      updated_at: order.updated_at
    },
    biometrics: [
      {
        id: `bio_${index}_finger`,
        engraving_id: engravingId,
        biometric_type: 'FINGERPRINT',
        required_channel: order.capture_route === 'STORE_BIOMETRIC' ? 'STORE_SCAN' : 'ONLINE_UPLOAD',
        raw_file_url: `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80&auto=format&fit=crop`,
        processed_svg_url: `https://bioring.local/mock/fingerprint-${index}.svg`,
        extra_data: { dpi: 500, finger: 'left_ring' },
        status: approved ? 'PROCESSED' : 'PENDING',
        created_at: order.created_at,
        updated_at: order.updated_at
      },
      {
        id: `bio_${index}_sound`,
        engraving_id: engravingId,
        biometric_type: 'SOUND_WAVE',
        required_channel: 'ONLINE_UPLOAD',
        raw_file_url: `https://bioring.local/mock/voice-${index}.m4a`,
        processed_svg_url: `https://bioring.local/mock/wave-${index}.svg`,
        extra_data: { duration_seconds: 18, phrase: 'always with you' },
        status: 'PROCESSED',
        created_at: order.created_at,
        updated_at: order.updated_at
      }
    ],
    versions: [
      {
        id: `ver_${index}_1`,
        engraving_id: engravingId,
        version_number: 1,
        selected_material_id: 'mat_18k_yellow_gold',
        selected_gemstone_id: index % 2 === 0 ? 'gem_moonstone' : null,
        ring_size: index % 2 === 0 ? 'US 7' : 'US 6',
        ring_style: index % 2 === 0 ? 'Soft bevel' : 'Classic comfort',
        ring_shape: 'Round band',
        customization_config: {
          bio_package: index % 2 === 0 ? ['FINGERPRINT', 'SOUND_WAVE'] : ['FINGERPRINT'],
          physical_engraving_type: index % 2 === 0 ? 'SOUND_WAVE' : 'FINGERPRINT',
          placement: 'inner_band',
          depth_mm: 0.24,
          matte_finish: index % 2 === 0
        },
        preview_image_url: `https://pngimg.com/uploads/ring/ring_PNG${index % 2 === 0 ? '24' : '10'}.png`,
        model_3d_url: `https://bioring.local/mock/model-${index}.glb`,
        production_file_url: approved ? `https://bioring.local/mock/production-${index}.zip` : null,
        status: approved ? 'SUPERSEDED' : 'DRAFT',
        manager_id: null,
        manager_note: null,
        reviewed_at: null,
        created_at: order.created_at
      },
      {
        id: `ver_${index}_2`,
        engraving_id: engravingId,
        version_number: 2,
        selected_material_id: 'mat_18k_yellow_gold',
        selected_gemstone_id: index % 2 === 0 ? 'gem_moonstone' : null,
        ring_size: index % 2 === 0 ? 'US 7' : 'US 6',
        ring_style: index % 2 === 0 ? 'Soft bevel' : 'Classic comfort',
        ring_shape: 'Round band',
        customization_config: {
          bio_package: index % 2 === 0 ? ['FINGERPRINT', 'SOUND_WAVE'] : ['FINGERPRINT'],
          physical_engraving_type: index % 2 === 0 ? 'SOUND_WAVE' : 'FINGERPRINT',
          placement: 'inner_band',
          depth_mm: 0.18,
          qa_clearance_mm: 0.8,
          matte_finish: index % 2 === 0
        },
        preview_image_url: `https://pngimg.com/uploads/ring/ring_PNG${index % 2 === 0 ? '54' : '14'}.png`,
        model_3d_url: `https://bioring.local/mock/model-final-${index}.glb`,
        production_file_url: approved ? `https://bioring.local/mock/production-final-${index}.zip` : null,
        status: approved ? 'APPROVED' : 'WAITING_REVIEW',
        manager_id: order.approved_by_manager_id,
        manager_note: approved ? 'Feasible. Engraving depth adjusted for production safety.' : null,
        reviewed_at: approved ? '2026-06-18T11:15:00.000Z' : null,
        created_at: order.updated_at
      }
    ],
    deposit_amount: deposit,
    balance_due: Math.max(order.total_price - order.paid_amount, 0),
    delivery_method:
      status === 'SHIPPING' || status === 'COMPLETED'
        ? 'HOME_DELIVERY'
        : status === 'READY_FOR_PICKUP'
          ? 'STORE_PICKUP'
          : null,
    actual_media_urls: [
      'https://pngimg.com/uploads/ring/ring_PNG54.png',
      'https://pngimg.com/uploads/ring/ring_PNG24.png'
    ],
    memory_card: {
      id: `mem_${index}`,
      name: index % 2 === 0 ? 'Champagne Archive Memory Card' : 'Ivory Keepsake Memory Card',
      template_id: index % 2 === 0 ? 'champagne-archive' : 'minimalist-photo-bottom',
      preview_image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=80&auto=format&fit=crop'
    },
    ...extra
  }
}

const orders: OrderSummary[] = [
  makeSummary(1, 'DRAFT'),
  makeSummary(2, 'PENDING_REVIEW', { rejection_reason: 'Previous draft had engraving too close to the stone seat.' }),
  makeSummary(3, 'PENDING_DEPOSIT'),
  makeSummary(4, 'IN_PRODUCTION'),
  makeSummary(5, 'READY_FOR_DELIVERY'),
  makeSummary(6, 'SHIPPING', { shipping_code: 'GHN-BRG-884201' }),
  makeSummary(7, 'READY_FOR_PICKUP', { pickup_qr_code: 'BRG-PICKUP-2026-1047' }),
  makeSummary(8, 'COMPLETED', { pickup_qr_code: 'BRG-MEM-2048' })
]

export async function getOrders(): Promise<OrderSummary[]> {
  return orders
}

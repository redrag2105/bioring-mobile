export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PENDING_DEPOSIT'
  | 'IN_PRODUCTION'
  | 'READY_FOR_DELIVERY'
  | 'SHIPPING'
  | 'READY_FOR_PICKUP'
  | 'COMPLETED'

export type OrderType = 'ONLINE' | 'OFFLINE'
export type PackageType = 'HEARTBEAT' | 'SOUNDWAVE' | 'FINGERPRINT'
export type CaptureRoute = 'RING_STUDIO' | 'STORE_BIOMETRIC'
export type DesignSource = 'CUSTOMER_DRAFT' | 'STAFF_CAPTURED'
export type BiometricType = 'FINGERPRINT' | 'SOUND_WAVE' | 'HANDWRITING'
export type RequiredChannel = 'ONLINE_UPLOAD' | 'STORE_SCAN'

export type OrderRecord = {
  id: string
  order_code: string
  user_id: string | null
  guest_customer_id: string | null
  design_draft_id: string | null
  order_type: OrderType
  package_type: PackageType
  capture_route: CaptureRoute
  design_source: DesignSource
  status: OrderStatus
  subtotal: number
  service_fee: number
  extra_fee: number
  discount_amount: number
  total_price: number
  paid_amount: number
  remaining_amount: number
  note: string | null
  created_by_staff_id: string | null
  approved_by_manager_id: string | null
  created_at: string
  updated_at: string
}

export type EngravingRecord = {
  id: string
  order_id: string
  product_id: string
  unique_product_id: string | null
  approved_version_id: string | null
  biometric_consent_at: string | null
  raw_biometric_deleted_at: string | null
  status: string
  created_at: string
  updated_at: string
}

export type EngravingBiometricRecord = {
  id: string
  engraving_id: string
  biometric_type: BiometricType
  required_channel: RequiredChannel
  raw_file_url: string | null
  processed_svg_url: string | null
  extra_data: Record<string, string | number | boolean>
  status: string
  created_at: string
  updated_at: string
}

export type CustomizationValue = string | number | boolean | string[]

export type EngravingVersionRecord = {
  id: string
  engraving_id: string
  version_number: number
  selected_material_id: string
  selected_gemstone_id: string | null
  ring_size: string
  ring_style: string
  ring_shape: string
  customization_config: Record<string, CustomizationValue>
  preview_image_url: string
  model_3d_url: string | null
  production_file_url: string | null
  status: string
  manager_id: string | null
  manager_note: string | null
  reviewed_at: string | null
  created_at: string
}

export type OrderSummary = {
  order: OrderRecord
  engraving: EngravingRecord
  biometrics: EngravingBiometricRecord[]
  versions: EngravingVersionRecord[]
  deposit_amount: number
  balance_due: number
  delivery_method: 'HOME_DELIVERY' | 'STORE_PICKUP' | null
  actual_media_urls: string[]
  rejection_reason?: string
  shipping_code?: string
  pickup_qr_code?: string
  memory_card: {
    id: string
    name: string
    template_id: string
    preview_image_url: string
  }
}

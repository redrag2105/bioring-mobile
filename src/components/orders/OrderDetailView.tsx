import { PriceText } from '@/components/common/PriceText'
import { BackButton } from '@/components/navigation/BackButton'
import { ORDER_STATUS_META } from '@/constants/orders'
import { THEME } from '@/constants/theme'
import type { OrderSummary } from '@/types/orders.types'
import { Box, ChevronRight, CreditCard, FileText, Fingerprint, QrCode } from 'lucide-react-native'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { OrderActionButtons } from './OrderActionButtons'
import { OrderFinancialStrip } from './OrderFinancialStrip'
import { OrderTimeline } from './OrderTimeline'

type OrderDetailViewProps = {
  orderSummary: OrderSummary
  onBack: () => void
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const MATERIAL_LABELS: Record<string, string> = {
  mat_18k_yellow_gold: '18K Yellow Gold'
}

const GEMSTONE_LABELS: Record<string, string> = {
  gem_moonstone: 'Moonstone'
}

const BIO_LABELS: Record<string, string> = {
  FINGERPRINT: 'FingerPrint',
  SOUND_WAVE: 'SoundWave',
  HANDWRITING: 'Handwriting'
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className='flex-row justify-between gap-4 border-b border-ring-primary/10 py-3'>
      <Text className='font-sans text-xs text-txt-muted'>{label}</Text>
      <Text className='flex-1 text-right font-sans-bold text-xs text-txt-main'>{value}</Text>
    </View>
  )
}

function DetailLinkRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      className='flex-row items-center justify-between gap-4 border-b border-ring-primary/10 py-3 active:opacity-70'
    >
      <Text className='font-sans text-xs text-txt-muted'>{label}</Text>
      <View className='min-w-0 flex-1 flex-row items-center justify-end gap-2'>
        <Text className='min-w-0 flex-1 text-right font-sans-bold text-xs text-ring-primary' numberOfLines={1}>
          {value}
        </Text>
        <ChevronRight color={THEME.ringPrimary} size={15} strokeWidth={1.6} />
      </View>
    </Pressable>
  )
}

export function OrderDetailView({ orderSummary, onBack, onScroll }: OrderDetailViewProps) {
  const { order, versions, biometrics } = orderSummary
  const meta = ORDER_STATUS_META[order.status]
  const version = versions[versions.length - 1]
  const config = version.customization_config
  const bioPackage = Array.isArray(config.bio_package) ? config.bio_package : []
  const memoryCard = orderSummary.memory_card
  const swipeBackGesture = Gesture.Pan()
    .activeOffsetX(18)
    .failOffsetY([-24, 24])
    .onEnd((event) => {
      const hasRightDistance = event.translationX > 72
      const hasRightFlick = event.translationX > 32 && event.velocityX > 520

      if (hasRightDistance || hasRightFlick) {
        runOnJS(onBack)()
      }
    })

  return (
    <GestureDetector gesture={swipeBackGesture}>
      <View className='flex-1'>
        <View className='z-30 flex-row items-center justify-between px-5 pt-2'>
          <BackButton onPress={onBack} className='border-white/70 bg-white/75 shadow-ring-primary/10' />
          <View className='items-center'>
            <Text className='font-sans-bold text-[8px] uppercase tracking-[0.34em] text-ring-accent'>Orders</Text>
            <Text className='mt-1 font-serif text-[18px] leading-5 text-ring-primary'>Details</Text>
          </View>
          <View className='h-10 w-10' />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          <View className='gap-5 px-5 pb-40 pt-3'>
            <View className='overflow-hidden rounded-[24px] border border-ring-primary/15 bg-ring-surface shadow-tab-bar'>
              <View className='items-center bg-btn-disabled px-4 pb-5 pt-7'>
                <Image source={{ uri: version.preview_image_url }} className='h-36 w-36' resizeMode='contain' />
              </View>
              <View className='gap-4 p-4'>
                <View>
                  <Text className='font-sans-bold text-[11px] uppercase tracking-[0.18em] text-ring-accent'>
                    {order.order_code}
                  </Text>
                  <Text className='mt-2 font-serif-semibold text-[28px] leading-9 text-txt-main'>{meta.label}</Text>
                  <Text className='mt-2 font-sans text-[13px] leading-5 text-txt-body'>{version.ring_style}</Text>
                </View>
                {orderSummary.rejection_reason ? (
                  <View className='rounded-[18px] border border-ring-primary/10 bg-ring-background p-3'>
                    <Text className='mt-2 font-sans text-xs leading-5 text-status-error'>
                      {orderSummary.rejection_reason}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <OrderFinancialStrip orderSummary={orderSummary} />
            <OrderTimeline orderSummary={orderSummary} />

            <View className='gap-3 rounded-[20px] border border-ring-primary/15 bg-ring-surface p-4'>
              <View className='flex-row items-center gap-2'>
                <Box color={THEME.ringAccent} size={16} strokeWidth={1.7} />
                <Text className='font-sans-bold text-[10px] uppercase tracking-[0.22em] text-ring-accent'>
                  Design fields
                </Text>
              </View>
              <DetailRow
                label='Material'
                value={MATERIAL_LABELS[version.selected_material_id] ?? version.selected_material_id}
              />
              <DetailRow label='Size' value={version.ring_size} />
              <DetailRow
                label='Gemstone'
                value={
                  version.selected_gemstone_id
                    ? (GEMSTONE_LABELS[version.selected_gemstone_id] ?? version.selected_gemstone_id)
                    : 'No stone'
                }
              />
              <DetailRow
                label='Bio Package'
                value={bioPackage.map((item) => BIO_LABELS[item] ?? item).join(' + ') || 'Not selected'}
              />
              <DetailRow
                label='Engraving'
                value={
                  typeof config.physical_engraving_type === 'string'
                    ? (BIO_LABELS[config.physical_engraving_type] ?? config.physical_engraving_type)
                    : 'Not selected'
                }
              />
              <DetailRow label='Placement' value={config.placement === 'outer_band' ? 'Outer Band' : 'Inner Band'} />
              <DetailLinkRow
                label='Memory Card'
                value={memoryCard?.name ?? 'Not designed yet'}
                onPress={() =>
                  Alert.alert(
                    'Memory Card Preview',
                    memoryCard
                      ? `${memoryCard.name}\nTemplate: ${memoryCard.template_id}`
                      : 'This order does not have a Memory Card preview yet.'
                  )
                }
              />
            </View>

            <View className='gap-3 rounded-[20px] border border-ring-primary/15 bg-ring-surface p-4'>
              <View className='flex-row items-center gap-2'>
                <Fingerprint color={THEME.ringAccent} size={16} strokeWidth={1.7} />
                <Text className='font-sans-bold text-[10px] uppercase tracking-[0.22em] text-ring-accent'>
                  Biometrics
                </Text>
              </View>
              {biometrics.map((item) => (
                <View key={item.id} className='rounded-[16px] bg-ring-background p-3'>
                  <Text className='font-sans-bold text-sm text-txt-main'>{item.biometric_type}</Text>
                  <Text className='mt-1 font-sans text-xs text-txt-muted'>
                    {item.required_channel} - {item.status}
                  </Text>
                </View>
              ))}
            </View>

            <View className='gap-3 rounded-[20px] border border-ring-primary/15 bg-ring-surface p-4'>
              <View className='flex-row items-center gap-2'>
                <CreditCard color={THEME.ringAccent} size={16} strokeWidth={1.7} />
                <Text className='font-sans-bold text-[10px] uppercase tracking-[0.22em] text-ring-accent'>
                  Payment summary
                </Text>
              </View>
              <DetailRow label='Subtotal' value={`${order.subtotal.toLocaleString('vi-VN')} VND`} />
              <DetailRow label='Service fee' value={`${order.service_fee.toLocaleString('vi-VN')} VND`} />
              <DetailRow label='Extra fee' value={`${order.extra_fee.toLocaleString('vi-VN')} VND`} />
              <View className='pt-2'>
                <PriceText
                  value={order.total_price}
                  prefix='Total '
                  prefixClassName='font-serif-semibold'
                  className='text-right font-serif-semibold text-xl text-ring-primary'
                />
              </View>
            </View>

            {orderSummary.shipping_code || orderSummary.pickup_qr_code ? (
              <View className='flex-row items-center gap-3 rounded-[18px] border border-ring-primary/10 bg-ring-primary/5 p-4'>
                {orderSummary.shipping_code ? (
                  <FileText color={THEME.ringPrimary} size={18} strokeWidth={1.7} />
                ) : (
                  <QrCode color={THEME.ringPrimary} size={18} strokeWidth={1.7} />
                )}
                <Text className='flex-1 font-sans-bold text-sm text-ring-primary'>
                  {orderSummary.shipping_code ?? orderSummary.pickup_qr_code}
                </Text>
              </View>
            ) : null}

            <OrderActionButtons actions={meta.actions} />
          </View>
        </ScrollView>
      </View>
    </GestureDetector>
  )
}

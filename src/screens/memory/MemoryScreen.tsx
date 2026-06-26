import { MemoryPosterCatalogItem } from '@/components/memory/MemoryPosterCatalogItem'
import { MemoryQrScannerModal } from '@/components/memory/MemoryQrScannerModal'
import { ScreenHeader } from '@/components/screen/ScreenHeader'
import { THEME } from '@/constants/theme'
import { useMemoryCardsQuery } from '@/hooks/queries/useMemoryCardsQuery'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { LinearGradient } from 'expo-linear-gradient'
import { QrCode } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function MemoryScreen() {
  const handleScroll = useDynamicBottomTab()
  const { data: memoryCards = [] } = useMemoryCardsQuery()
  const [isScannerVisible, setScannerVisible] = useState(false)

  function handleScanned(code: string) {
    setScannerVisible(false)
    Alert.alert('QR scanned', `Memory code detected: ${code}`)
  }

  return (
    <View className='flex-1 bg-[#F4F1EC]'>
      {/* =========================================================
          BACKGROUND: ABSTRACT HALO
      ========================================================= */}

      {/* 1. Halo Effect (Hào quang) - Những khối tròn mờ ảo tạo chiều sâu */}
      <View className='absolute -left-[20%] -top-[10%] h-[120vw] w-[120vw] rounded-full bg-[#EBE5D9] opacity-70' />
      <View className='absolute -bottom-[10%] -right-[20%] h-[100vw] w-[100vw] rounded-full bg-[#FCFAF6] opacity-90' />

      {/* 2. Gradient sương mù che phủ nhẹ chân màn hình */}
      <LinearGradient
        colors={['rgba(244,241,236,0)', 'rgba(244,241,236,0.95)']}
        className='absolute bottom-0 left-0 right-0 z-10 h-40'
        pointerEvents='none'
      />

      <SafeAreaView className='flex-1' edges={['top']}>
        {/* HEADER & NÚT SCAN QUYỀN LỰC */}
        <View className='relative z-20 pb-2'>
          <ScreenHeader eyebrow='Memory Card' title='Poster' accent='Collection' />

          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Scan QR code'
            onPress={() => setScannerVisible(true)}
            className='absolute right-5 top-4 h-11 w-11 items-center justify-center rounded-full border border-ring-primary/10 bg-white/70 shadow-sm shadow-ring-primary/5'
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }]
            })}
          >
            <QrCode color={THEME.ringPrimary} size={19} strokeWidth={1.5} />
            <View className='absolute right-[10px] top-[10px] h-1.5 w-1.5 rounded-full bg-ring-accent' />
          </Pressable>
        </View>

        {/* CONTAINER PHẦN BODY */}
        <View className='relative flex-1'>
          {/* DANH SÁCH POSTER */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className='z-10 flex-1'
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <View className='px-5 pb-48 pt-4'>
              <View className='gap-5'>
                {memoryCards.length > 0 ? (
                  /* Grid so le (Offset) tạo cảm giác nghệ thuật tự do */
                  <View className='flex-row flex-wrap justify-between pt-2'>
                    {memoryCards.map((memoryCard, index) => (
                      <MemoryPosterCatalogItem key={memoryCard.id} memoryCard={memoryCard} index={index} />
                    ))}
                  </View>
                ) : (
                  /* EMPTY STATE: "Hanging Plaque" (Bảng tên mái vòm treo lơ lửng) */
                  <View className='relative mt-16 w-[80%] items-center self-center rounded-t-full border border-ring-primary/10 bg-[#FCFAF6]/90 px-6 pb-14 pt-16 shadow-xl shadow-ring-primary/5'>
                    {/* Sợi dây treo ảo giác */}
                    <View className='absolute -top-16 left-1/2 h-16 w-[1px] bg-ring-primary/20' />

                    {/* Đinh tán / Điểm neo */}
                    <View className='mb-8 h-2.5 w-2.5 rounded-full border border-ring-accent bg-transparent' />

                    <Text
                      allowFontScaling={false}
                      className='text-center font-serif text-[28px] font-light leading-[34px] tracking-wide text-ring-primary'
                    >
                      An Empty{'\n'}Exhibition
                    </Text>

                    <View className='my-6 h-[1px] w-8 bg-ring-primary/20' />

                    <Text
                      allowFontScaling={false}
                      className='text-center font-sans text-[11px] leading-5 tracking-wide text-ring-primary/50'
                    >
                      This space is reserved for your activated artworks. Tap the scanner to curate your first piece.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <MemoryQrScannerModal
        visible={isScannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={handleScanned}
      />
    </View>
  )
}

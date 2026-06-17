import { MemoryCardListItem } from '@/components/memory/MemoryCardListItem'
import { MemoryQrScannerModal } from '@/components/memory/MemoryQrScannerModal'
import { THEME } from '@/constants/theme'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTabs'
import { useMemoryCardsQuery } from '@/hooks/queries/useMemoryCardsQuery'
import { LinearGradient } from 'expo-linear-gradient'
import { QrCode, Sparkles } from 'lucide-react-native'
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
    <View className='flex-1 bg-ring-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <View className='flex-row items-start justify-between px-5 pb-3 pt-4'>
          <View className='flex-1 pr-4'>
            <Text allowFontScaling={false} className='font-sans-bold text-xs uppercase tracking-wider text-txt-muted'>
              Memory vault
            </Text>
            <Text allowFontScaling={false} className='mt-2 font-serif-semibold text-[28px] leading-9 text-txt-main'>
              Memory <Text className='font-serif-italic text-ring-accent'>Cards</Text>
            </Text>
          </View>

          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Scan QR code'
            onPress={() => setScannerVisible(true)}
            className='h-11 w-11 items-center justify-center rounded-full border border-ring-accent/20 bg-white shadow-sm shadow-ring-primary/5'
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <QrCode color={THEME.ringPrimary} size={20} strokeWidth={1.7} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className='gap-8 px-5 pb-40'>
            <View className='elevation-2 overflow-hidden rounded-[28px] border border-white/70 shadow-lg shadow-ring-primary/10'>
              <LinearGradient
                colors={['#FFFFFF', '#F7F5EF', '#EEF3EF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='absolute inset-0'
              />
              <View className='absolute -right-8 -top-8 h-32 w-32 rounded-full bg-ring-accent/10' />
              <View className='gap-4 p-6'>
                <View className='h-12 w-12 items-center justify-center rounded-full bg-ring-accent/10'>
                  <Sparkles color={THEME.ringAccent} size={19} strokeWidth={1.6} />
                </View>

                <View>
                  <Text
                    allowFontScaling={false}
                    className='font-sans-bold text-[10px] uppercase tracking-[0.24em] text-ring-accent'
                  >
                    Activated memories
                  </Text>
                  <Text allowFontScaling={false} className='mt-2 font-serif text-[30px] leading-9 text-ring-primary'>
                    Keep every story close
                  </Text>
                  <Text allowFontScaling={false} className='mt-3 font-sans text-[14px] leading-6 text-txt-muted'>
                    Scan a Bioring QR code to activate a memory card, then revisit each linked ring and its story here.
                  </Text>
                </View>
              </View>
            </View>

            <View className='gap-4'>
              <View className='flex-row items-end justify-between'>
                <View>
                  <Text allowFontScaling={false} className='font-sans-bold text-[10px] uppercase tracking-[0.24em] text-ring-accent'>
                    QR linked
                  </Text>
                  <Text allowFontScaling={false} className='mt-1 font-serif text-[24px] leading-8 text-ring-primary'>
                    Activated Cards
                  </Text>
                </View>
                <Text allowFontScaling={false} className='font-sans-bold text-[11px] uppercase tracking-wider text-txt-muted'>
                  {memoryCards.length} items
                </Text>
              </View>

              {memoryCards.length > 0 ? (
                <View className='gap-3'>
                  {memoryCards.map((memoryCard) => (
                    <MemoryCardListItem key={memoryCard.id} memoryCard={memoryCard} />
                  ))}
                </View>
              ) : (
                <View className='items-center rounded-[24px] border border-ring-primary/10 bg-white/70 p-6'>
                  <Text allowFontScaling={false} className='text-center font-serif text-[24px] leading-8 text-ring-primary'>
                    No memory cards yet
                  </Text>
                  <Text allowFontScaling={false} className='mt-2 text-center font-sans text-[13px] leading-5 text-txt-muted'>
                    Tap the QR icon above to activate your first Bioring memory card.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <MemoryQrScannerModal
        visible={isScannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={handleScanned}
      />
    </View>
  )
}

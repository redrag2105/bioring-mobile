import { useRouter } from 'expo-router'
import { ArrowLeft, Ruler, Sparkles } from 'lucide-react-native'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { STUDIO_SIZE_GUIDE_STEPS, STUDIO_SIZE_TABLE } from '@/constants/staticContent'
import { THEME } from '@/constants/theme'

export function StudioSizeGuideScreen() {
  const router = useRouter()

  function handleBackToStudio() {
    router.replace('/(dashboard)/studio' as never)
  }

  return (
    <View className='flex-1 bg-[#FDFCFB]'>
      <SafeAreaView className='flex-1' edges={['top', 'bottom']}>
        {/* HEADER: Clean & Transparent */}
        <View className='z-10 flex-row items-center justify-between px-6 pb-2 pt-2'>
          <Pressable
            accessibilityRole='button'
            onPress={handleBackToStudio}
            className='h-11 w-11 items-center justify-center rounded-full border border-ring-primary/5 bg-white shadow-sm shadow-black/5'
          >
            <ArrowLeft color={THEME.ringPrimary} size={20} strokeWidth={1.5} />
          </Pressable>
          <Text className='font-sans-medium text-[10px] uppercase tracking-[0.25em] text-ring-primary/60'>
            Measure Guide
          </Text>
          <View className='h-11 w-11' />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
          {/* --- HERO SECTION: Editorial Style --- */}
          <View className='items-center px-8 pb-12 pt-6'>
            <View className='mb-6 h-16 w-16 items-center justify-center rounded-full bg-ring-accent/10'>
              <Ruler color={THEME.ringAccent} size={28} strokeWidth={1.2} />
            </View>
            <Text className='font-sans-medium mb-4 text-center text-[10px] uppercase tracking-[0.3em] text-ring-accent'>
              At-Home Method
            </Text>
            <Text className='mb-5 text-center font-serif text-[36px] leading-[44px] text-ring-primary'>
              Find Your Fit
            </Text>
            <Text className='font-sans-light px-4 text-center text-[14px] leading-6 text-txt-muted'>
              Follow our precision guide to measure your finger circumference beautifully and accurately.
            </Text>
          </View>

          <View className='gap-10 px-6 pb-16'>
            {/* --- STEPS: The Golden Thread Timeline --- */}
            <View className='relative px-2'>
              {/* Sợi chỉ vàng chạy dọc */}
              <View className='absolute bottom-4 left-[23px] top-2 w-[0.5px] bg-ring-accent/40' />

              <View className='gap-8'>
                {STUDIO_SIZE_GUIDE_STEPS.map((step, index) => (
                  <View key={step.id} className='flex-row gap-6'>
                    {/* Node trên timeline */}
                    <View className='z-10 h-8 w-8 items-center justify-center rounded-full border border-ring-accent bg-[#FDFCFB] shadow-sm shadow-ring-accent/20'>
                      <Text className='font-serif text-[14px] text-ring-accent'>{index + 1}</Text>
                    </View>

                    {/* Nội dung Step */}
                    <View className='flex-1 pb-4 pt-1'>
                      <Text className='mb-2 font-serif text-[20px] leading-7 text-ring-primary'>{step.title}</Text>
                      <Text className='font-sans-light text-[14px] leading-6 text-txt-muted'>{step.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* --- TABLE: Minimalist Spec Sheet --- */}
            <View className='gap-6'>
              <View className='items-center'>
                <Text className='font-serif text-[22px] text-ring-primary'>Reference Chart</Text>
                <View className='mt-4 h-[1px] w-12 bg-ring-accent/50' />
              </View>

              <View className='rounded-[24px] border border-ring-primary/5 bg-white p-6 shadow-xl shadow-black/5'>
                {/* Header Table */}
                <View className='mb-3 flex-row justify-between border-b border-ring-primary/10 pb-3'>
                  <Text className='font-sans-medium text-[10px] uppercase tracking-[0.2em] text-txt-muted'>
                    Circumference
                  </Text>
                  <Text className='font-sans-medium text-[10px] uppercase tracking-[0.2em] text-txt-muted'>
                    Ring Size
                  </Text>
                </View>

                {/* Rows */}
                {STUDIO_SIZE_TABLE.map((row) => (
                  <View
                    key={row.size}
                    className='flex-row items-center justify-between border-b border-ring-primary/5 py-3 last:border-b-0'
                  >
                    <Text className='font-sans text-[15px] text-txt-body'>{row.circumference}</Text>
                    <Text className='font-serif text-[18px] text-ring-primary'>{row.size}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* --- PRO TIP: Elegant Highlight --- */}
            <View className='flex-row items-start gap-4 rounded-[20px] border border-ring-accent/30 bg-ring-accent/5 p-5'>
              <View className='pt-1'>
                <Sparkles color={THEME.ringAccent} size={18} strokeWidth={1.5} />
              </View>
              <View className='flex-1'>
                <Text className='font-sans-medium mb-1.5 text-[11px] uppercase tracking-[0.2em] text-ring-accent'>
                  Pro Tip
                </Text>
                <Text className='font-sans text-[13px] leading-5 text-ring-primary/80'>
                  Measure 2-3 times for accuracy. If your size varies between measurements, always choose the larger
                  result to ensure comfort.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

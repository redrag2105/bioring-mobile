import { THEME } from '@/constants/theme'
import { useRingDesignStore } from '@/hooks/useRingDesignStore'
import { CalendarDays, Mic2 } from 'lucide-react-native'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'

const MEMORY_TEMPLATES = [
  {
    id: 'ivory-vow',
    name: 'Ivory Vow',
    card: 'bg-[#F8F2E8]',
    ink: 'text-ring-primary',
    accent: 'bg-ring-accent',
    line: 'border-ring-primary/15'
  },
  {
    id: 'noir-archive',
    name: 'Noir Archive',
    card: 'bg-ring-primary',
    ink: 'text-white',
    accent: 'bg-ring-accent',
    line: 'border-white/20'
  },
  {
    id: 'rose-letter',
    name: 'Rose Letter',
    card: 'bg-[#F5E7E0]',
    ink: 'text-ring-primary',
    accent: 'bg-[#C48C78]',
    line: 'border-ring-primary/15'
  },
  {
    id: 'silver-minimal',
    name: 'Silver Minimal',
    card: 'bg-[#ECEBE6]',
    ink: 'text-ring-primary',
    accent: 'bg-ring-primary',
    line: 'border-ring-primary/15'
  },
  {
    id: 'museum-card',
    name: 'Museum Card',
    card: 'bg-[#EEE7D8]',
    ink: 'text-ring-primary',
    accent: 'bg-status-success',
    line: 'border-ring-primary/15'
  }
]

function LiveMemoryPreview() {
  const memory = useRingDesignStore((state) => state.memory_card)
  const selectedTemplate = MEMORY_TEMPLATES.find((template) => template.id === memory.templateId) ?? MEMORY_TEMPLATES[0]
  const message = memory.secretMessage.trim() || 'For the moment only we know'
  const anniversaryDate = memory.anniversaryDate?.trim() || 'YYYY-MM-DD'

  return (
    <View
      className={`min-h-[230px] justify-between rounded-[28px] border border-white/70 p-6 shadow-xl shadow-ring-primary/10 ${selectedTemplate.card}`}
    >
      <View className='flex-row items-start justify-between gap-4'>
        <View className='flex-1'>
          <Text className={`font-sans-bold text-[8px] uppercase tracking-[0.34em] ${selectedTemplate.ink}`}>
            Bioring Memory
          </Text>
          <Text className={`mt-3 font-serif text-[34px] leading-[38px] ${selectedTemplate.ink}`}>
            {selectedTemplate.name}
          </Text>
        </View>
        <View className={`h-12 w-12 rounded-full ${selectedTemplate.accent}`} />
      </View>

      <View className={`my-6 border-t ${selectedTemplate.line}`} />

      <View className='gap-4'>
        <Text className={`font-serif text-[24px] leading-8 ${selectedTemplate.ink}`} numberOfLines={3}>
          {message}
        </Text>
        <View className='flex-row items-end justify-between gap-4'>
          <View>
            <Text className={`font-sans-bold text-[8px] uppercase tracking-[0.28em] ${selectedTemplate.ink}`}>
              Anniversary
            </Text>
            <Text className={`mt-1 font-sans text-[13px] ${selectedTemplate.ink}`}>{anniversaryDate}</Text>
          </View>
          <View className='h-16 w-16 items-center justify-center rounded-[16px] border border-white/50 bg-white/25'>
            <View className='h-8 w-8 border border-current opacity-60' />
          </View>
        </View>
      </View>
    </View>
  )
}

export function MemoryCardPanel() {
  const memory = useRingDesignStore((state) => state.memory_card)
  const hasSoundWave = useRingDesignStore((state) => state.package_types.includes('sound_wave'))
  const updateMemoryCard = useRingDesignStore((state) => state.updateMemoryCard)

  return (
    <View className='gap-7'>
      <View className='gap-3'>
        <Text className='font-sans-bold text-[9px] uppercase tracking-[0.3em] text-ring-accent'>Live Preview</Text>
        <LiveMemoryPreview />
      </View>

      <View className='gap-6'>
        <View>
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.3em] text-ring-accent'>Controls</Text>
          <Text className='mt-2 font-serif text-[28px] leading-8 text-ring-primary'>Shape the keepsake.</Text>
        </View>

        <View className='gap-3'>
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.24em] text-ring-primary/50'>Templates</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='-mx-1'
            contentContainerClassName='gap-3 px-1'
          >
            {MEMORY_TEMPLATES.map((template) => {
              const isActive = memory.templateId === template.id

              return (
                <Pressable
                  key={template.id}
                  onPress={() => updateMemoryCard({ templateId: template.id })}
                  className={`h-[138px] w-[210px] justify-between rounded-[24px] border p-4 shadow-sm shadow-ring-primary/10 ${
                    isActive ? 'border-ring-accent' : 'border-white/70'
                  } ${template.card}`}
                >
                  <View className='flex-row items-start justify-between'>
                    <View className='flex-1'>
                      <Text className={`font-sans-bold text-[7px] uppercase tracking-[0.28em] ${template.ink}`}>
                        Bioring
                      </Text>
                      <Text className={`mt-2 font-serif text-[22px] leading-6 ${template.ink}`}>{template.name}</Text>
                    </View>
                    <View className={`h-8 w-8 rounded-full ${template.accent}`} />
                  </View>

                  <View className='flex-row items-end justify-between'>
                    <View className='gap-1'>
                      <View className={`h-[2px] w-14 rounded-full ${template.accent}`} />
                      <View className={`h-[2px] w-9 rounded-full ${template.accent}`} />
                    </View>
                    <View className='h-10 w-10 rounded-[12px] border border-white/50 bg-white/25' />
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>

        <View className='gap-3'>
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.24em] text-ring-primary/50'>
            Secret Message
          </Text>
          <TextInput
            value={memory.secretMessage}
            onChangeText={(secretMessage) => updateMemoryCard({ secretMessage })}
            placeholder='For the moment only we know'
            placeholderTextColor='#8C939A'
            multiline
            className='min-h-[104px] rounded-[24px] border border-white/60 bg-white/45 px-5 py-4 font-serif text-[20px] leading-7 text-ring-primary'
          />
        </View>

        <View className='gap-3'>
          <Text className='font-sans-bold text-[9px] uppercase tracking-[0.24em] text-ring-primary/50'>
            Anniversary Date
          </Text>
          <View className='flex-row items-center gap-3 rounded-[22px] border border-white/60 bg-white/45 px-4 py-4'>
            <CalendarDays color={THEME.ringAccent} size={18} strokeWidth={1.5} />
            <TextInput
              value={memory.anniversaryDate}
              onChangeText={(anniversaryDate) => updateMemoryCard({ anniversaryDate })}
              placeholder='YYYY-MM-DD'
              placeholderTextColor='#8C939A'
              className='flex-1 font-sans text-[14px] text-ring-primary'
            />
          </View>
        </View>

        <Pressable
          disabled={!hasSoundWave}
          onPress={() => updateMemoryCard({ reuseSoundWaveVoice: !memory.reuseSoundWaveVoice })}
          className={`flex-row items-center gap-3 rounded-[24px] border px-4 py-4 ${
            hasSoundWave && memory.reuseSoundWaveVoice
              ? 'border-ring-accent bg-ring-accent/10'
              : 'border-white/60 bg-white/35'
          }`}
        >
          <View className='h-10 w-10 items-center justify-center rounded-full bg-white/60'>
            <Mic2 color={hasSoundWave ? THEME.ringAccent : THEME.textMuted} size={18} strokeWidth={1.5} />
          </View>
          <View className='flex-1'>
            <Text className='font-sans-bold text-[10px] uppercase tracking-[0.2em] text-ring-primary'>
              Use soundwave memory
            </Text>
            <Text className='mt-1 font-sans text-[12px] text-txt-muted'>
              {hasSoundWave
                ? 'Attach the Atelier soundwave asset to QR memory.'
                : 'Choose SoundWave in the package step to enable this.'}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
}

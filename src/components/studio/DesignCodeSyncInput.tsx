import { Link2 } from 'lucide-react-native'
import { Pressable, Text, TextInput, View } from 'react-native'

import { STUDIO_SYNC_CONTENT } from '@/constants/staticContent'
import { THEME } from '@/constants/theme'

type DesignCodeSyncInputProps = {
  value: string
  onChangeText: (value: string) => void
  onSync?: () => void
  placeholder?: string
  accessibilityLabel?: string
}

export function DesignCodeSyncInput({
  value,
  onChangeText,
  onSync,
  placeholder = STUDIO_SYNC_CONTENT.placeholder,
  accessibilityLabel = 'Continue with design code'
}: DesignCodeSyncInputProps) {
  const isReadyToSync = value.trim().length > 0

  return (
    <View
      className={`h-14 flex-row items-center overflow-hidden rounded-full border pl-4 pr-1.5 ${
        isReadyToSync ? 'border-ring-primary/30 bg-white/90' : 'border-ring-primary/15 bg-white/50'
      }`}
      // Đưa shadow về style thuần để tránh lỗi crash Navigation
      style={{
        shadowColor: THEME.ringPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1
      }}
    >
      <Link2 color={isReadyToSync ? THEME.ringAccent : 'rgba(182,155,122,0.45)'} size={18} strokeWidth={2} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoCapitalize='characters'
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor='rgba(182, 155, 122, 0.4)'
        returnKeyType='done'
        onSubmitEditing={onSync}
        className='h-full flex-1 px-3 font-sans-bold text-[13px] uppercase tracking-[0.25em] text-ring-primary'
      />

      <Pressable
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel}
        disabled={!isReadyToSync}
        onPress={onSync}
        className={`h-11 items-center justify-center rounded-full px-6 ${
          isReadyToSync ? 'bg-ring-primary' : 'bg-transparent'
        }`}
        // Kết hợp xử lý opacity khi bấm và đổ bóng an toàn
        style={({ pressed }) => [
          { opacity: pressed && isReadyToSync ? 0.8 : 1 },
          isReadyToSync && {
            shadowColor: THEME.ringPrimary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 2
          }
        ]}
      >
        <Text
          allowFontScaling={false}
          className={`font-sans-bold text-[10px] uppercase tracking-wider ${
            isReadyToSync ? 'text-white' : 'text-ring-primary/30'
          }`}
        >
          Sync
        </Text>
      </Pressable>
    </View>
  )
}

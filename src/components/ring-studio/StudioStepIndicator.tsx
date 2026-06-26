import type { RingStudioTab } from '@/types/ring-studio.types'
import { Pressable, Text, View } from 'react-native'

const STEPS: { id: RingStudioTab; label: string }[] = [
  { id: 'basic', label: 'Specs' },
  { id: 'package', label: 'Bio' }
]

type StudioStepIndicatorProps = {
  activeTab: RingStudioTab
  onChange: (tab: RingStudioTab) => void
}

export function StudioStepIndicator({ activeTab, onChange }: StudioStepIndicatorProps) {
  // Nền ngoài (Container): Bỏ viền (border) đi, chỉ dùng một lớp nền xám cực mỏng (`bg-ring-primary/5`)
  // và giảm padding (`p-1`) để nó ôm sát lấy các viên pill bên trong, tạo cảm giác liền mạch.
  return (
    <View className='flex-row items-center rounded-full bg-ring-primary/5 p-1'>
      {STEPS.map((step, index) => {
        const isActive = activeTab === step.id

        // Nút bấm: Viên pill active sẽ là màu trắng nguyên bản, có viền siêu mảnh bên trong để phân tách.
        const buttonClass = isActive
          ? 'flex-1 flex-row items-center justify-center gap-3 rounded-full border-[0.5px] border-ring-primary/10 bg-white py-[9px]'
          : 'flex-1 flex-row items-center justify-center gap-3 rounded-full border-[0.5px] border-transparent bg-transparent py-[9px]'

        // Số thứ tự: Dùng font Serif, số active dùng màu Accent.
        const numberClass = isActive
          ? 'font-serif text-[13px] text-ring-accent'
          : 'font-serif text-[13px] text-ring-primary/30'

        // Đường kẻ dọc tinh xảo: Giữ nguyên để tạo điểm nhấn
        const dividerClass = isActive
          ? 'h-[14px] w-[0.5px] bg-ring-primary/20'
          : 'h-[14px] w-[0.5px] bg-ring-primary/10'

        // Label: Font Sans, tracking rộng, in hoa.
        const labelClass = isActive
          ? 'font-sans-medium text-[10px] uppercase tracking-[0.25em] text-ring-primary mt-[1px]'
          : 'font-sans text-[10px] uppercase tracking-[0.25em] text-ring-primary/40 mt-[1px]'

        return (
          <Pressable
            key={step.id}
            onPress={() => onChange(step.id)}
            className={buttonClass}
            style={({ pressed }) => ({
              opacity: pressed && !isActive ? 0.6 : 1
            })}
          >
            <Text allowFontScaling={false} className={numberClass}>
              0{index + 1}
            </Text>

            {/* Đường kẻ dọc tinh xảo */}
            <View className={dividerClass} />

            <Text allowFontScaling={false} className={labelClass}>
              {step.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

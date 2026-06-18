import { Check } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { MATERIALS } from './basicSpecsConfig'

type MaterialPickerProps = {
  selectedMaterialId?: string | null
  onSelect: (materialId: string) => void
}

export function MaterialPicker({ selectedMaterialId, onSelect }: MaterialPickerProps) {
  return (
    <View className='gap-5'>
      <Text allowFontScaling={false} className='font-sans-bold text-[10px] uppercase tracking-[0.24em] text-txt-body'>
        Material
      </Text>
      <View className='flex-row justify-between'>
        {MATERIALS.map((material) => {
          const isActive = selectedMaterialId === material.id

          return (
            <Pressable
              key={material.id}
              onPress={() => onSelect(material.id)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              className='items-center gap-3'
            >
              <View
                className={`items-center justify-center rounded-full border-[0.5px] p-[3px] ${
                  isActive ? 'border-ring-accent' : 'border-transparent'
                }`}
              >
                <View
                  className={`h-[42px] w-[42px] items-center justify-center rounded-full shadow-sm shadow-black/5 ${material.tone}`}
                >
                  {isActive ? (
                    <View className='h-full w-full items-center justify-center rounded-full bg-black/10'>
                      <Check color='#FFFFFF' size={16} strokeWidth={2.5} />
                    </View>
                  ) : null}
                </View>
              </View>
              <Text
                allowFontScaling={false}
                className={`font-sans-bold text-[9px] uppercase tracking-wider ${
                  isActive ? 'text-ring-primary' : 'text-txt-muted'
                }`}
              >
                {material.name}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

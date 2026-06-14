import { Text, View } from 'react-native'

type ScreenHeaderProps = {
  eyebrow: string
  title: string
  accent?: string
}

export function ScreenHeader({ eyebrow, title, accent }: ScreenHeaderProps) {
  return (
    <View className='px-5 pb-3 pt-4'>
      <Text className='font-sans-bold text-xs uppercase tracking-wider text-txt-muted'>{eyebrow}</Text>
      <Text className='mt-2 font-serif-semibold text-[28px] leading-9 text-txt-main'>
        {title}
        {accent ? <Text className='font-serif-italic text-ring-accent'> {accent}</Text> : null}
      </Text>
    </View>
  )
}

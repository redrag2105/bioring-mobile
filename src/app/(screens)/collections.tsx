import { CollectionsScreen } from '@/screens/collections/CollectionsScreen'
import { Stack } from 'expo-router'

export default function CollectionsCanvasRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          animation: 'fade',
          animationDuration: 280,
          presentation: 'card'
        }}
      />
      <CollectionsScreen entryAnimation='zoom' />
    </>
  )
}

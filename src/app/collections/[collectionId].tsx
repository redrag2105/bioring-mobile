import { CollectionDetailScreen } from '@/screens/collections/CollectionDetailScreen'
import { Stack } from 'expo-router'

export default function CollectionDetailRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          animation: 'slide_from_right',
          presentation: 'card'
        }}
      />
      <CollectionDetailScreen />
    </>
  )
}

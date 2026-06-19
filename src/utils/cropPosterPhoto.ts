import type { MemoryCardDraft } from '@/types/ring-studio.types'
import { NativeModules } from 'react-native'

type ImageEditingManager = {
  cropImage: (
    uri: string,
    cropData: NonNullable<MemoryCardDraft['userPhotoCrop']>,
    successCallback: (uri: string) => void,
    errorCallback: (error: string) => void
  ) => void
}

function getImageEditingManager() {
  return NativeModules.ImageEditingManager as ImageEditingManager | undefined
}

export async function cropPosterPhoto(memoryCard: MemoryCardDraft) {
  if (!memoryCard.userPhotoUri || !memoryCard.userPhotoCrop) return undefined

  const imageEditor = getImageEditingManager()
  if (!imageEditor?.cropImage) return undefined

  return new Promise<string | undefined>((resolve) => {
    imageEditor.cropImage(
      memoryCard.userPhotoUri!,
      memoryCard.userPhotoCrop!,
      (uri) => resolve(uri),
      () => resolve(undefined)
    )
  })
}

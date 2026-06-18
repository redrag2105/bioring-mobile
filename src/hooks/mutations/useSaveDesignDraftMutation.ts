import { DesignDraftsAPI } from '@/core/apis/design-drafts.api'
import type { RingDesignDraftPayload, RingDesignDraftResponse } from '@/types/ring-studio.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const designDraftKeys = {
  all: ['design-drafts'] as const,
  lists: () => [...designDraftKeys.all, 'list'] as const
}

export function useSaveDesignDraftMutation() {
  const queryClient = useQueryClient()

  return useMutation<RingDesignDraftResponse, Error, RingDesignDraftPayload>({
    mutationFn: DesignDraftsAPI.saveDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designDraftKeys.lists() })
    }
  })
}

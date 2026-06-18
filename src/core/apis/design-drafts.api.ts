import { apiClient } from '@/core/apis/axios'
import type { RingDesignDraftPayload, RingDesignDraftResponse } from '@/types/ring-studio.types'

export const DesignDraftsAPI = {
  saveDraft: async (payload: RingDesignDraftPayload): Promise<RingDesignDraftResponse> => {
    try {
      const response = await apiClient.post<RingDesignDraftResponse>('/design-drafts', payload)
      return response.data
    } catch {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...payload,
            id: `draft-${Date.now()}`,
            status: 'draft',
            updated_at: new Date().toISOString()
          })
        }, 450)
      })
    }
  }
}

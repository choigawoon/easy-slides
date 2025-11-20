/**
 * Presentations API Service
 *
 * This module provides React Query hooks for managing presentations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type {
  PresentationResponse,
  PresentationCreate,
  PresentationUpdate,
  PresentationsListResponse,
  ShareSettingsUpdate,
} from '@/schemas'
import { slidesKeys } from './slides'

/**
 * Query keys for presentations
 */
export const presentationsKeys = {
  all: ['presentations'] as const,
  lists: () => [...presentationsKeys.all, 'list'] as const,
  list: (params?: { skip?: number; limit?: number; user_id?: number }) =>
    [...presentationsKeys.lists(), params] as const,
  details: () => [...presentationsKeys.all, 'detail'] as const,
  detail: (id: number) => [...presentationsKeys.details(), id] as const,
  share: () => [...presentationsKeys.all, 'share'] as const,
  shareBySlug: (slug: string) => [...presentationsKeys.share(), slug] as const,
}

/**
 * Fetch presentations list
 */
export const usePresentations = (params?: {
  skip?: number
  limit?: number
  user_id?: number
}) => {
  return useQuery({
    queryKey: presentationsKeys.list(params),
    queryFn: () =>
      apiClient.get<PresentationsListResponse>('/api/presentations', { params }),
  })
}

/**
 * Fetch single presentation
 */
export const usePresentation = (id: number) => {
  return useQuery({
    queryKey: presentationsKeys.detail(id),
    queryFn: () => apiClient.get<PresentationResponse>(`/api/presentations/${id}`),
    enabled: !!id,
  })
}

/**
 * Fetch presentation by slug (for public share view)
 */
export const usePresentationBySlug = (slug: string) => {
  return useQuery({
    queryKey: presentationsKeys.shareBySlug(slug),
    queryFn: () => apiClient.get<{
      presentation: PresentationResponse & {
        user: {
          id: number
          username: string
          full_name: string
          avatar: string | null
        } | null
      }
      slides: Array<{
        id: number
        presentation_id: number
        order: number
        content: string
        notes: string | null
        layout: string
        transition: string | null
        created_at: string
        updated_at: string
      }>
    }>(`/api/p/${slug}`),
    enabled: !!slug,
  })
}

/**
 * Create new presentation
 */
export const useCreatePresentation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PresentationCreate) =>
      apiClient.post<PresentationResponse>('/api/presentations', data),
    onSuccess: () => {
      // Invalidate and refetch presentations list
      queryClient.invalidateQueries({ queryKey: presentationsKeys.lists() })
    },
  })
}

/**
 * Update presentation
 */
export const useUpdatePresentation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PresentationUpdate }) =>
      apiClient.put<PresentationResponse>(`/api/presentations/${id}`, data),
    onSuccess: (data) => {
      // Invalidate presentation detail and list
      queryClient.invalidateQueries({ queryKey: presentationsKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: presentationsKeys.lists() })
    },
  })
}

/**
 * Delete presentation
 */
export const useDeletePresentation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete<{ message: string }>(`/api/presentations/${id}`),
    onSuccess: (_data, id) => {
      // Invalidate presentations list and slides
      queryClient.invalidateQueries({ queryKey: presentationsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: slidesKeys.list(id) })
    },
  })
}

/**
 * Duplicate presentation
 */
export const useDuplicatePresentation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.post<PresentationResponse>(`/api/presentations/${id}/duplicate`),
    onSuccess: () => {
      // Invalidate and refetch presentations list
      queryClient.invalidateQueries({ queryKey: presentationsKeys.lists() })
    },
  })
}

/**
 * Update share settings
 */
export const useUpdateShareSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ShareSettingsUpdate }) =>
      apiClient.put<PresentationResponse>(`/api/presentations/${id}/share`, data),
    onSuccess: (data) => {
      // Invalidate presentation detail
      queryClient.invalidateQueries({ queryKey: presentationsKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: presentationsKeys.lists() })
    },
  })
}

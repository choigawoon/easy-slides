/**
 * Slides API Service
 *
 * This module provides React Query hooks for managing slides.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type {
  SlideResponse,
  SlideCreate,
  SlideUpdate,
  SlidesListResponse,
  SlidesReorder,
} from '@/schemas'
import { presentationsKeys } from './presentations'

/**
 * Query keys for slides
 */
export const slidesKeys = {
  all: ['slides'] as const,
  lists: () => [...slidesKeys.all, 'list'] as const,
  list: (presentationId: number) => [...slidesKeys.lists(), presentationId] as const,
  details: () => [...slidesKeys.all, 'detail'] as const,
  detail: (id: number) => [...slidesKeys.details(), id] as const,
}

/**
 * Fetch slides for a presentation
 */
export const useSlides = (presentationId: number) => {
  return useQuery({
    queryKey: slidesKeys.list(presentationId),
    queryFn: () =>
      apiClient.get<SlidesListResponse>(`/api/presentations/${presentationId}/slides`),
    enabled: !!presentationId,
  })
}

/**
 * Create new slide
 */
export const useCreateSlide = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      presentationId,
      data,
    }: {
      presentationId: number
      data: SlideCreate
    }) =>
      apiClient.post<SlideResponse>(
        `/api/presentations/${presentationId}/slides`,
        data
      ),
    onSuccess: (data) => {
      // Invalidate slides list and presentation detail
      queryClient.invalidateQueries({
        queryKey: slidesKeys.list(data.presentation_id),
      })
      queryClient.invalidateQueries({
        queryKey: presentationsKeys.detail(data.presentation_id),
      })
    },
  })
}

/**
 * Update slide
 */
export const useUpdateSlide = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SlideUpdate }) =>
      apiClient.put<SlideResponse>(`/api/slides/${id}`, data),
    onSuccess: (data) => {
      // Invalidate slide detail and list
      queryClient.invalidateQueries({
        queryKey: slidesKeys.detail(data.id),
      })
      queryClient.invalidateQueries({
        queryKey: slidesKeys.list(data.presentation_id),
      })
      queryClient.invalidateQueries({
        queryKey: presentationsKeys.detail(data.presentation_id),
      })
    },
  })
}

/**
 * Delete slide
 */
export const useDeleteSlide = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: number
      presentationId: number
    }) => apiClient.delete<{ message: string }>(`/api/slides/${id}`),
    onSuccess: (_data, variables) => {
      // Invalidate slides list and presentation detail
      queryClient.invalidateQueries({
        queryKey: slidesKeys.list(variables.presentationId),
      })
      queryClient.invalidateQueries({
        queryKey: presentationsKeys.detail(variables.presentationId),
      })
    },
  })
}

/**
 * Reorder slides
 */
export const useReorderSlides = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      presentationId,
      data,
    }: {
      presentationId: number
      data: SlidesReorder
    }) =>
      apiClient.put<SlidesListResponse>(
        `/api/presentations/${presentationId}/slides/reorder`,
        data
      ),
    onSuccess: (_data, variables) => {
      // Invalidate slides list
      queryClient.invalidateQueries({
        queryKey: slidesKeys.list(variables.presentationId),
      })
      queryClient.invalidateQueries({
        queryKey: presentationsKeys.detail(variables.presentationId),
      })
    },
  })
}

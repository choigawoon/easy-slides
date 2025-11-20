/**
 * Slide API Schemas
 *
 * Request/Response schemas for Slide API endpoints.
 * Uses snake_case to match FastAPI backend conventions.
 */

import { z } from 'zod'

// =============================================================================
// Request Schemas
// =============================================================================

/**
 * Slide creation request (POST /api/presentations/:id/slides)
 */
export const SlideCreateSchema = z.object({
  content: z.string().default(''),
  notes: z.string().optional(),
  layout: z.string().default('default'),
  order: z.number().int().nonnegative().optional(),
})

/**
 * Slide update request (PUT /api/slides/:id)
 */
export const SlideUpdateSchema = z.object({
  content: z.string().optional(),
  notes: z.string().optional().nullable(),
  layout: z.string().optional(),
  transition: z.string().optional().nullable(),
})

/**
 * Slides reorder request (PUT /api/presentations/:id/slides/reorder)
 */
export const SlidesReorderSchema = z.object({
  slides: z.array(
    z.object({
      id: z.number().int().positive(),
      order: z.number().int().nonnegative(),
    })
  ),
})

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Single slide response
 */
export const SlideResponseSchema = z.object({
  id: z.number().int().positive(),
  presentation_id: z.number().int().positive(),
  order: z.number().int().nonnegative(),
  content: z.string(),
  notes: z.string().optional().nullable(),
  layout: z.string(),
  transition: z.string().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

/**
 * Slides list response
 */
export const SlidesListResponseSchema = z.object({
  slides: z.array(SlideResponseSchema),
  total: z.number().int().nonnegative(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type SlideCreate = z.infer<typeof SlideCreateSchema>
export type SlideUpdate = z.infer<typeof SlideUpdateSchema>
export type SlidesReorder = z.infer<typeof SlidesReorderSchema>
export type SlideResponse = z.infer<typeof SlideResponseSchema>
export type SlidesListResponse = z.infer<typeof SlidesListResponseSchema>

// Legacy alias for backward compatibility
export const SlideSchema = SlideResponseSchema
export type Slide = SlideResponse

/**
 * Presentation API Schemas
 *
 * Request/Response schemas for Presentation API endpoints.
 * Uses snake_case to match FastAPI backend conventions.
 */

import { z } from 'zod'

// =============================================================================
// Enums
// =============================================================================

export const VisibilitySchema = z.enum(['PRIVATE', 'UNLISTED', 'PUBLIC'])
export type Visibility = z.infer<typeof VisibilitySchema>

// =============================================================================
// Request Schemas
// =============================================================================

/**
 * Presentation creation request (POST /api/presentations)
 */
export const PresentationCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
  visibility: VisibilitySchema.default('PRIVATE'),
  theme: z.string().default('default'),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
})

/**
 * Presentation update request (PUT /api/presentations/:id)
 */
export const PresentationUpdateSchema = PresentationCreateSchema.partial()

/**
 * Share settings update request
 */
export const ShareSettingsUpdateSchema = z.object({
  visibility: VisibilitySchema.optional(),
  password: z.string().optional().nullable(),
})

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Single presentation response
 */
export const PresentationResponseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().optional().nullable(),
  slug: z.string(),
  thumbnail: z.string().optional().nullable(),
  visibility: VisibilitySchema,
  password: z.string().optional().nullable(),
  theme: z.string(),
  tags: z.array(z.string()),
  category: z.string().optional().nullable(),
  view_count: z.number().int().nonnegative(),
  user_id: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

/**
 * Presentation with user info (for public view)
 */
export const PresentationWithUserSchema = PresentationResponseSchema.extend({
  user: z.object({
    id: z.number().int().positive(),
    username: z.string(),
    full_name: z.string(),
    avatar: z.string().optional().nullable(),
  }),
})

/**
 * Presentations list response with pagination
 */
export const PresentationsListResponseSchema = z.object({
  presentations: z.array(PresentationResponseSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type PresentationCreate = z.infer<typeof PresentationCreateSchema>
export type PresentationUpdate = z.infer<typeof PresentationUpdateSchema>
export type ShareSettingsUpdate = z.infer<typeof ShareSettingsUpdateSchema>
export type PresentationResponse = z.infer<typeof PresentationResponseSchema>
export type PresentationWithUser = z.infer<typeof PresentationWithUserSchema>
export type PresentationsListResponse = z.infer<typeof PresentationsListResponseSchema>

// Legacy alias for backward compatibility
export const PresentationSchema = PresentationResponseSchema
export type Presentation = PresentationResponse

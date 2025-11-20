import { http, HttpResponse } from 'msw'
import { type ZodError } from 'zod'
import {
  ItemSchema,
  ItemCreateSchema,
  ItemUpdateSchema,
  ItemsListResponseSchema,
  UserSchema,
  UserCreateSchema,
  UsersListResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  HealthCheckSchema,
  SearchResponseSchema,
  PresentationResponseSchema,
  PresentationCreateSchema,
  PresentationUpdateSchema,
  PresentationsListResponseSchema,
  SlideResponseSchema,
  SlideCreateSchema,
  SlideUpdateSchema,
  SlidesListResponseSchema,
  SlidesReorderSchema,
  ShareSettingsUpdateSchema,
  type Item,
  type User,
  type HealthCheck,
  type HTTPValidationError,
  type PresentationResponse,
  type SlideResponse,
} from '@/schemas'
import { db } from '@/db'

// Re-export types for convenience
export type { Item, User, PresentationResponse, SlideResponse } from '@/schemas'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
  const random = Math.random().toString(36).substring(2, 8)
  return `${base}-${random}`
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format Zod validation error to FastAPI-style validation error
 */
function formatValidationError(error: ZodError): HTTPValidationError {
  return {
    detail: error.issues.map((err) => ({
      loc: ['body', ...err.path.map(String)],
      msg: err.message,
      type: err.code,
    })),
  }
}

/**
 * Create validation error response (422 Unprocessable Entity)
 */
function validationErrorResponse(error: ZodError) {
  return HttpResponse.json(formatValidationError(error), { status: 422 })
}

/**
 * Create HTTP error response
 */
function httpErrorResponse(detail: string, status: number) {
  return HttpResponse.json({ detail }, { status })
}

// MSW Request Handlers (FastAPI-style with IndexedDB)
export const handlers = [
  // Health Check
  http.get('/api/health', () => {
    const response: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }
    // Validate response with Zod
    const validated = HealthCheckSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Items - List all items
  http.get('/api/items', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const category = url.searchParams.get('category')

    let items = await db.items.toArray()

    if (category) {
      items = items.filter((item) => item.category === category)
    }

    const total = items.length
    const paginatedItems = items.slice(skip, skip + limit)

    // Map to response format with required id
    const responseItems: Item[] = paginatedItems.map((item) => ({
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    const response = {
      items: responseItems,
      total,
      skip,
      limit,
    }

    // Validate response with Zod
    const validated = ItemsListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Items - Get single item
  http.get('/api/items/:id', async ({ params }) => {
    const { id } = params
    const item = await db.items.get(Number(id))

    if (!item) {
      return httpErrorResponse('Item not found', 404)
    }

    const responseItem: Item = {
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(responseItem)
    return HttpResponse.json(validated)
  }),

  // Items - Create new item
  http.post('/api/items', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod (FastAPI-style)
    const result = ItemCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const now = new Date().toISOString()

    // Add to IndexedDB
    const id = (await db.items.add({
      ...validatedData,
      created_at: now,
      updated_at: now,
    })) as number

    const newItem: Item = {
      id,
      ...validatedData,
      created_at: now,
      updated_at: now,
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(newItem)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Items - Update item
  http.put('/api/items/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()

    // Validate request body with Zod
    const result = ItemUpdateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const itemId = Number(id)
    const existingItem = await db.items.get(itemId)

    if (!existingItem) {
      return httpErrorResponse('Item not found', 404)
    }

    const updatedItem = {
      ...existingItem,
      ...validatedData,
      updated_at: new Date().toISOString(),
    }

    // Update in IndexedDB
    await db.items.put(updatedItem)

    const responseItem: Item = {
      id: updatedItem.id!,
      name: updatedItem.name,
      description: updatedItem.description,
      price: updatedItem.price,
      category: updatedItem.category,
      created_at: updatedItem.created_at,
      updated_at: updatedItem.updated_at,
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(responseItem)
    return HttpResponse.json(validated)
  }),

  // Items - Delete item
  http.delete('/api/items/:id', async ({ params }) => {
    const { id } = params
    const itemId = Number(id)
    const existingItem = await db.items.get(itemId)

    if (!existingItem) {
      return httpErrorResponse('Item not found', 404)
    }

    await db.items.delete(itemId)

    return HttpResponse.json({ message: 'Item deleted successfully' })
  }),

  // Users - List all users
  http.get('/api/users', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    const users = await db.users.toArray()
    const total = users.length
    const paginatedUsers = users.slice(skip, skip + limit)

    // Map to response format
    const responseUsers: User[] = paginatedUsers.map((user) => ({
      id: user.id!,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at,
    }))

    const response = {
      users: responseUsers,
      total,
      skip,
      limit,
    }

    // Validate response with Zod
    const validated = UsersListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Users - Get single user
  http.get('/api/users/:id', async ({ params }) => {
    const { id } = params
    const user = await db.users.get(Number(id))

    if (!user) {
      return httpErrorResponse('User not found', 404)
    }

    const responseUser: User = {
      id: user.id!,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at,
    }

    // Validate response with Zod
    const validated = UserSchema.parse(responseUser)
    return HttpResponse.json(validated)
  }),

  // Users - Create new user
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod
    const result = UserCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const now = new Date().toISOString()

    // Add to IndexedDB
    const id = (await db.users.add({
      email: validatedData.email,
      username: validatedData.username,
      full_name: validatedData.full_name,
      is_active: validatedData.is_active,
      created_at: now,
      updated_at: now,
    })) as number

    const newUser: User = {
      id,
      email: validatedData.email,
      username: validatedData.username,
      full_name: validatedData.full_name,
      is_active: validatedData.is_active,
      created_at: now,
    }

    // Validate response with Zod
    const validated = UserSchema.parse(newUser)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Auth - Login (FastAPI-style)
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod
    const result = LoginRequestSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data

    // Mock authentication logic
    if (
      validatedData.username === 'admin' &&
      validatedData.password === 'admin'
    ) {
      const response = {
        access_token: 'mock-jwt-token-12345',
        token_type: 'bearer' as const,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          full_name: '관리자',
        },
      }

      // Validate response with Zod
      const validated = LoginResponseSchema.parse(response)
      return HttpResponse.json(validated)
    }

    return httpErrorResponse('Incorrect username or password', 401)
  }),

  // Search endpoint (FastAPI-style)
  http.get('/api/search', async ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const items = await db.items.toArray()
    const results = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    )

    // Map to response format
    const responseResults: Item[] = results.map((item) => ({
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    const response = {
      query,
      results: responseResults,
      total: responseResults.length,
    }

    // Validate response with Zod
    const validated = SearchResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // ============================================================================
  // Presentations API
  // ============================================================================

  // Presentations - List all presentations for current user
  http.get('/api/presentations', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const userId = parseInt(url.searchParams.get('user_id') || '1') // Default to user 1 for mock

    let presentations = await db.presentations.toArray()

    // Filter by user
    presentations = presentations.filter((p) => p.user_id === userId)

    const total = presentations.length
    const paginatedPresentations = presentations
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(skip, skip + limit)

    // Map to response format
    const responsePresentations: PresentationResponse[] = paginatedPresentations.map((p) => ({
      id: p.id!,
      title: p.title,
      description: p.description || null,
      slug: p.slug,
      thumbnail: p.thumbnail || null,
      visibility: p.visibility,
      password: p.password || null,
      theme: p.theme,
      tags: p.tags,
      category: p.category || null,
      view_count: p.view_count,
      user_id: p.user_id,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }))

    const response = {
      presentations: responsePresentations,
      total,
      skip,
      limit,
    }

    const validated = PresentationsListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Presentations - Get single presentation
  http.get('/api/presentations/:id', async ({ params }) => {
    const { id } = params
    const presentation = await db.presentations.get(Number(id))

    if (!presentation) {
      return httpErrorResponse('Presentation not found', 404)
    }

    const responsePresentation: PresentationResponse = {
      id: presentation.id!,
      title: presentation.title,
      description: presentation.description || null,
      slug: presentation.slug,
      thumbnail: presentation.thumbnail || null,
      visibility: presentation.visibility,
      password: presentation.password || null,
      theme: presentation.theme,
      tags: presentation.tags,
      category: presentation.category || null,
      view_count: presentation.view_count,
      user_id: presentation.user_id,
      created_at: presentation.created_at,
      updated_at: presentation.updated_at,
    }

    const validated = PresentationResponseSchema.parse(responsePresentation)
    return HttpResponse.json(validated)
  }),

  // Presentations - Create new presentation
  http.post('/api/presentations', async ({ request }) => {
    const body = await request.json()

    const result = PresentationCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const now = new Date().toISOString()
    const slug = generateSlug(validatedData.title)

    // Add to IndexedDB
    const id = (await db.presentations.add({
      title: validatedData.title,
      description: validatedData.description,
      slug,
      visibility: validatedData.visibility,
      theme: validatedData.theme,
      tags: validatedData.tags,
      category: validatedData.category,
      view_count: 0,
      user_id: 1, // Default to user 1 for mock
      created_at: now,
      updated_at: now,
    })) as number

    // Create initial slide
    await db.slides.add({
      presentation_id: id,
      order: 0,
      content: `# ${validatedData.title}\n\n발표 내용을 작성하세요.`,
      layout: 'default',
      created_at: now,
      updated_at: now,
    })

    const newPresentation: PresentationResponse = {
      id,
      title: validatedData.title,
      description: validatedData.description || null,
      slug,
      thumbnail: null,
      visibility: validatedData.visibility,
      password: null,
      theme: validatedData.theme,
      tags: validatedData.tags,
      category: validatedData.category || null,
      view_count: 0,
      user_id: 1,
      created_at: now,
      updated_at: now,
    }

    const validated = PresentationResponseSchema.parse(newPresentation)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Presentations - Update presentation
  http.put('/api/presentations/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()

    const result = PresentationUpdateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const presentationId = Number(id)
    const existingPresentation = await db.presentations.get(presentationId)

    if (!existingPresentation) {
      return httpErrorResponse('Presentation not found', 404)
    }

    const updatedPresentation = {
      ...existingPresentation,
      ...validatedData,
      updated_at: new Date().toISOString(),
    }

    await db.presentations.put(updatedPresentation)

    const responsePresentation: PresentationResponse = {
      id: updatedPresentation.id!,
      title: updatedPresentation.title,
      description: updatedPresentation.description || null,
      slug: updatedPresentation.slug,
      thumbnail: updatedPresentation.thumbnail || null,
      visibility: updatedPresentation.visibility,
      password: updatedPresentation.password || null,
      theme: updatedPresentation.theme,
      tags: updatedPresentation.tags,
      category: updatedPresentation.category || null,
      view_count: updatedPresentation.view_count,
      user_id: updatedPresentation.user_id,
      created_at: updatedPresentation.created_at,
      updated_at: updatedPresentation.updated_at,
    }

    const validated = PresentationResponseSchema.parse(responsePresentation)
    return HttpResponse.json(validated)
  }),

  // Presentations - Delete presentation
  http.delete('/api/presentations/:id', async ({ params }) => {
    const { id } = params
    const presentationId = Number(id)
    const existingPresentation = await db.presentations.get(presentationId)

    if (!existingPresentation) {
      return httpErrorResponse('Presentation not found', 404)
    }

    // Delete all slides first
    await db.slides.where('presentation_id').equals(presentationId).delete()
    // Delete presentation
    await db.presentations.delete(presentationId)

    return HttpResponse.json({ message: 'Presentation deleted successfully' })
  }),

  // Presentations - Duplicate presentation
  http.post('/api/presentations/:id/duplicate', async ({ params }) => {
    const { id } = params
    const presentationId = Number(id)
    const existingPresentation = await db.presentations.get(presentationId)

    if (!existingPresentation) {
      return httpErrorResponse('Presentation not found', 404)
    }

    const now = new Date().toISOString()
    const newSlug = generateSlug(`${existingPresentation.title} (복사본)`)

    // Create new presentation
    const newId = (await db.presentations.add({
      title: `${existingPresentation.title} (복사본)`,
      description: existingPresentation.description,
      slug: newSlug,
      visibility: 'PRIVATE',
      theme: existingPresentation.theme,
      tags: existingPresentation.tags,
      category: existingPresentation.category,
      view_count: 0,
      user_id: existingPresentation.user_id,
      created_at: now,
      updated_at: now,
    })) as number

    // Duplicate slides
    const slides = await db.slides.where('presentation_id').equals(presentationId).toArray()
    for (const slide of slides) {
      await db.slides.add({
        presentation_id: newId,
        order: slide.order,
        content: slide.content,
        notes: slide.notes,
        layout: slide.layout,
        transition: slide.transition,
        created_at: now,
        updated_at: now,
      })
    }

    const newPresentation: PresentationResponse = {
      id: newId,
      title: `${existingPresentation.title} (복사본)`,
      description: existingPresentation.description || null,
      slug: newSlug,
      thumbnail: null,
      visibility: 'PRIVATE',
      password: null,
      theme: existingPresentation.theme,
      tags: existingPresentation.tags,
      category: existingPresentation.category || null,
      view_count: 0,
      user_id: existingPresentation.user_id,
      created_at: now,
      updated_at: now,
    }

    const validated = PresentationResponseSchema.parse(newPresentation)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Presentations - Update share settings
  http.put('/api/presentations/:id/share', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()

    const result = ShareSettingsUpdateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const presentationId = Number(id)
    const existingPresentation = await db.presentations.get(presentationId)

    if (!existingPresentation) {
      return httpErrorResponse('Presentation not found', 404)
    }

    const updatedPresentation = {
      ...existingPresentation,
      visibility: validatedData.visibility || existingPresentation.visibility,
      password: validatedData.password ?? existingPresentation.password,
      updated_at: new Date().toISOString(),
    }

    await db.presentations.put(updatedPresentation)

    const responsePresentation: PresentationResponse = {
      id: updatedPresentation.id!,
      title: updatedPresentation.title,
      description: updatedPresentation.description || null,
      slug: updatedPresentation.slug,
      thumbnail: updatedPresentation.thumbnail || null,
      visibility: updatedPresentation.visibility,
      password: updatedPresentation.password || null,
      theme: updatedPresentation.theme,
      tags: updatedPresentation.tags,
      category: updatedPresentation.category || null,
      view_count: updatedPresentation.view_count,
      user_id: updatedPresentation.user_id,
      created_at: updatedPresentation.created_at,
      updated_at: updatedPresentation.updated_at,
    }

    const validated = PresentationResponseSchema.parse(responsePresentation)
    return HttpResponse.json(validated)
  }),

  // Share view - Get presentation by slug
  http.get('/api/p/:slug', async ({ params }) => {
    const { slug } = params
    const presentations = await db.presentations.where('slug').equals(slug as string).toArray()

    if (presentations.length === 0) {
      return httpErrorResponse('Presentation not found', 404)
    }

    const presentation = presentations[0]

    // Check visibility
    if (presentation.visibility === 'PRIVATE') {
      return httpErrorResponse('Presentation is private', 403)
    }

    // Get slides
    const slides = await db.slides.where('presentation_id').equals(presentation.id!).toArray()
    const sortedSlides = slides.sort((a, b) => a.order - b.order)

    // Get user info
    const user = await db.users.get(presentation.user_id)

    const responseSlides: SlideResponse[] = sortedSlides.map((s) => ({
      id: s.id!,
      presentation_id: s.presentation_id,
      order: s.order,
      content: s.content,
      notes: s.notes || null,
      layout: s.layout,
      transition: s.transition || null,
      created_at: s.created_at,
      updated_at: s.updated_at,
    }))

    const response = {
      presentation: {
        id: presentation.id!,
        title: presentation.title,
        description: presentation.description || null,
        slug: presentation.slug,
        thumbnail: presentation.thumbnail || null,
        visibility: presentation.visibility,
        password: presentation.password || null,
        theme: presentation.theme,
        tags: presentation.tags,
        category: presentation.category || null,
        view_count: presentation.view_count,
        user_id: presentation.user_id,
        created_at: presentation.created_at,
        updated_at: presentation.updated_at,
        user: user ? {
          id: user.id!,
          username: user.username,
          full_name: user.full_name,
          avatar: user.avatar || null,
        } : null,
      },
      slides: responseSlides,
    }

    return HttpResponse.json(response)
  }),

  // ============================================================================
  // Slides API
  // ============================================================================

  // Slides - List all slides for a presentation
  http.get('/api/presentations/:id/slides', async ({ params }) => {
    const { id } = params
    const presentationId = Number(id)

    const presentation = await db.presentations.get(presentationId)
    if (!presentation) {
      return httpErrorResponse('Presentation not found', 404)
    }

    const slides = await db.slides.where('presentation_id').equals(presentationId).toArray()
    const sortedSlides = slides.sort((a, b) => a.order - b.order)

    const responseSlides: SlideResponse[] = sortedSlides.map((s) => ({
      id: s.id!,
      presentation_id: s.presentation_id,
      order: s.order,
      content: s.content,
      notes: s.notes || null,
      layout: s.layout,
      transition: s.transition || null,
      created_at: s.created_at,
      updated_at: s.updated_at,
    }))

    const response = {
      slides: responseSlides,
      total: responseSlides.length,
    }

    const validated = SlidesListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Slides - Create new slide
  http.post('/api/presentations/:id/slides', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    const presentationId = Number(id)

    const presentation = await db.presentations.get(presentationId)
    if (!presentation) {
      return httpErrorResponse('Presentation not found', 404)
    }

    const result = SlideCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const now = new Date().toISOString()

    // Get current slides to determine order
    const existingSlides = await db.slides.where('presentation_id').equals(presentationId).toArray()
    const order = validatedData.order !== undefined
      ? validatedData.order
      : existingSlides.length

    // Add to IndexedDB
    const slideId = (await db.slides.add({
      presentation_id: presentationId,
      order,
      content: validatedData.content,
      notes: validatedData.notes,
      layout: validatedData.layout,
      created_at: now,
      updated_at: now,
    })) as number

    // Update presentation updated_at
    await db.presentations.update(presentationId, { updated_at: now })

    const newSlide: SlideResponse = {
      id: slideId,
      presentation_id: presentationId,
      order,
      content: validatedData.content,
      notes: validatedData.notes || null,
      layout: validatedData.layout,
      transition: null,
      created_at: now,
      updated_at: now,
    }

    const validated = SlideResponseSchema.parse(newSlide)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Slides - Update slide
  http.put('/api/slides/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()

    const result = SlideUpdateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const slideId = Number(id)
    const existingSlide = await db.slides.get(slideId)

    if (!existingSlide) {
      return httpErrorResponse('Slide not found', 404)
    }

    const now = new Date().toISOString()
    const updatedSlide = {
      ...existingSlide,
      content: validatedData.content ?? existingSlide.content,
      notes: validatedData.notes ?? existingSlide.notes,
      layout: validatedData.layout ?? existingSlide.layout,
      transition: validatedData.transition ?? existingSlide.transition,
      updated_at: now,
    }

    await db.slides.put(updatedSlide)

    // Update presentation updated_at
    await db.presentations.update(existingSlide.presentation_id, { updated_at: now })

    const responseSlide: SlideResponse = {
      id: updatedSlide.id!,
      presentation_id: updatedSlide.presentation_id,
      order: updatedSlide.order,
      content: updatedSlide.content,
      notes: updatedSlide.notes || null,
      layout: updatedSlide.layout,
      transition: updatedSlide.transition || null,
      created_at: updatedSlide.created_at,
      updated_at: updatedSlide.updated_at,
    }

    const validated = SlideResponseSchema.parse(responseSlide)
    return HttpResponse.json(validated)
  }),

  // Slides - Delete slide
  http.delete('/api/slides/:id', async ({ params }) => {
    const { id } = params
    const slideId = Number(id)
    const existingSlide = await db.slides.get(slideId)

    if (!existingSlide) {
      return httpErrorResponse('Slide not found', 404)
    }

    await db.slides.delete(slideId)

    // Reorder remaining slides
    const remainingSlides = await db.slides
      .where('presentation_id')
      .equals(existingSlide.presentation_id)
      .toArray()

    const sortedSlides = remainingSlides.sort((a, b) => a.order - b.order)
    for (let i = 0; i < sortedSlides.length; i++) {
      await db.slides.update(sortedSlides[i].id!, { order: i })
    }

    // Update presentation updated_at
    await db.presentations.update(existingSlide.presentation_id, {
      updated_at: new Date().toISOString(),
    })

    return HttpResponse.json({ message: 'Slide deleted successfully' })
  }),

  // Slides - Reorder slides
  http.put('/api/presentations/:id/slides/reorder', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    const presentationId = Number(id)

    const presentation = await db.presentations.get(presentationId)
    if (!presentation) {
      return httpErrorResponse('Presentation not found', 404)
    }

    const result = SlidesReorderSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const { slides: slideOrders } = result.data
    const now = new Date().toISOString()

    // Update each slide's order
    for (const { id: slideId, order } of slideOrders) {
      await db.slides.update(slideId, { order, updated_at: now })
    }

    // Update presentation updated_at
    await db.presentations.update(presentationId, { updated_at: now })

    // Get updated slides
    const slides = await db.slides.where('presentation_id').equals(presentationId).toArray()
    const sortedSlides = slides.sort((a, b) => a.order - b.order)

    const responseSlides: SlideResponse[] = sortedSlides.map((s) => ({
      id: s.id!,
      presentation_id: s.presentation_id,
      order: s.order,
      content: s.content,
      notes: s.notes || null,
      layout: s.layout,
      transition: s.transition || null,
      created_at: s.created_at,
      updated_at: s.updated_at,
    }))

    const response = {
      slides: responseSlides,
      total: responseSlides.length,
    }

    const validated = SlidesListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),
]

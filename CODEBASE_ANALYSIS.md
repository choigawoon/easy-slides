# Easy Slides Codebase - Comprehensive Analysis

## Executive Summary

The Easy Slides project is a React-based web presentation platform built with modern technologies. The codebase has a solid foundation with infrastructure for:
- **File-based routing** (TanStack Router)
- **State management** (Zustand with slices)
- **API mocking** (MSW with IndexedDB persistence)
- **Internationalization** (i18n with en/ko/ja)
- **UI components** (shadcn/ui)
- **Type safety** (TypeScript, Zod validation)

However, it **currently lacks the presentation/slide editor functionality** that is the core feature of Easy Slides.

---

## Part 1: EXISTING INFRASTRUCTURE (What's Ready to Use)

### 1.1 Project Structure
Location: `/home/user/easy-slides/`

**Current directory structure:**
```
src/
├── api/                   # ✓ API layer (functional)
├── components/            # ✓ Basic components (Header, PWAPrompt, 15 UI components)
├── db/                    # ✓ IndexedDB setup (Dexie.js)
├── hooks/                 # ✓ Custom hooks (PWA support)
├── lib/                   # ✓ Utils (cn, query-client, i18n config)
├── locales/              # ✓ Translations (en.json, ko.json, ja.json)
├── mocks/                # ✓ MSW handlers (10+ endpoints)
├── routes/               # ◐ Basic routing (only 4 routes, missing slide routes)
├── schemas/              # ✓ Zod validation (Item, User, Auth)
├── stores/               # ✓ Zustand state (4 slices)
├── styles.css            # ✓ Global styles & Tailwind v4
├── types/                # ◐ Minimal (only i18next.d.ts)
├── main.tsx              # ✓ App entry point
└── vite-env.d.ts         # ✓ Vite types
```

### 1.2 Existing Routes (4 total)
File: `src/routes/`

| Route | Status | Purpose |
|-------|--------|---------|
| `/` | ✓ Implemented | Home page (demo with logo + i18n) |
| `/zustand-test` | ✓ Implemented | State management test |
| `/msw-test` | ✓ Implemented | API mocking test |
| Auto-generated | ✓ System file | routeTree.gen.ts (DO NOT EDIT) |

**Missing routes for slide editor (from PLAN.md):**
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - My presentations dashboard
- `/editor/:id` - Slide editor
- `/editor/new` - Create new presentation
- `/p/:id` - Public share view
- `/present/:id` - Presentation mode
- `/explore` - Explore/search (Phase 3)
- `/profile/:username` - User profile (Phase 3)

### 1.3 Existing Store Slices (Zustand)
Location: `src/stores/slices/`

**Implemented slices:**

| Slice | Purpose | State | Actions |
|-------|---------|-------|---------|
| **apiSlice** | API data | users, posts, isLoading | fetchUsers, fetchPosts, addUser, etc. |
| **uiSlice** | UI state | isSidebarOpen, theme, language, modal, notifications | toggleSidebar, setTheme, setLanguage, openModal, etc. |
| **taskSlice** | Task mgmt | tasks[], filter, sortBy, selectedTaskId | addTask, updateTask, deleteTask, setFilter, etc. |
| **workflowSlice** | Progress tracking | currentWork, workHistory, workLogs, isWorkInProgress | startWork, updateWorkProgress, completeWork, etc. |

**Missing slices for slide editor (from PLAN.md):**
- **authSlice** - User authentication (userId, isLoggedIn, token)
- **editorSlice** - Editor state (currentPresentation, slides, currentSlideIndex, editorMode, unsavedChanges)
- **presentSlice** - Presentation mode state (currentSlide, timer, isFullscreen, showNotes)
- **dashboardSlice** - Dashboard filters/sorting

### 1.4 Existing API Services
Location: `src/api/services/`

**Implemented services:**

| Service | Hooks | Endpoints |
|---------|-------|-----------|
| **items.ts** | useItems(), useItem(id), useCreateItem(), useUpdateItem(), useDeleteItem() | GET/POST/PUT/DELETE `/api/items` |
| **users.ts** | useUsers(), useCreateUser(), useUpdateUser(), useDeleteUser() | GET/POST/PUT/DELETE `/api/users` |
| **auth.ts** | useLogin(), useLogout() | POST `/api/auth/login`, POST `/api/auth/logout` |
| **search.ts** | useSearch(query) | GET `/api/search` |
| **health.ts** | useHealth() | GET `/api/health` |

**Missing API services for slide editor:**
- **presentations.ts** - usePresentations(), usePresentation(id), useCreatePresentation(), useUpdatePresentation(), useDeletePresentation()
- **slides.ts** - useSlides(presentationId), useCreateSlide(), useUpdateSlide(), useDeleteSlide(), useReorderSlides()
- **share.ts** - useShareSettings(id), useUpdateShareSettings()

### 1.5 Existing Database Schema
Location: `src/db/index.ts`

**Current IndexedDB tables:**
- **items** - id, name, description, price, category, created_at, updated_at (with seed data)
- **users** - id, email, username, full_name, is_active, created_at (with seed data)

**Missing IndexedDB tables:**
- **presentations** - id, title, description, slug, thumbnail, visibility, password, theme, tags, category, viewCount, userId, createdAt, updatedAt
- **slides** - id, presentationId, order, content, notes, layout, transition, createdAt, updatedAt

### 1.6 Existing Zod Schemas
Location: `src/schemas/`

**Current schemas:**
- `api/item.ts` - ItemSchema, ItemCreateSchema, ItemUpdateSchema, ItemsListResponseSchema
- `api/user.ts` - UserSchema, UserCreateSchema, UsersListResponseSchema
- `api/auth.ts` - LoginRequestSchema, LoginResponseSchema
- `api/common.ts` - HTTPValidationError, Health check schema
- `models/item.ts`, `models/user.ts` - DB model schemas

**Missing schemas:**
- `api/presentation.ts` - PresentationSchema, PresentationCreateSchema, PresentationUpdateSchema
- `api/slide.ts` - SlideSchema, SlideCreateSchema, SlideUpdateSchema, SlideReorderSchema
- `api/share.ts` - ShareSettingsSchema

### 1.7 Existing Components
Location: `src/components/`

**Implemented components:**

**Layout:**
- `Header.tsx` - Navigation header (responsive, mobile-aware)
- `LanguageSelector.tsx` - Language switcher (buttons/dropdown)
- `PWAPrompt.tsx` - PWA install/update prompts

**UI Components (shadcn/ui):**
- button, card, dialog, input, label, progress, select, alert, badge, separator, sheet

**Missing components (from PLAN.md):**
- `editor/` folder:
  - Editor.tsx - Main editor container
  - MarkdownEditor.tsx - Markdown editor
  - SlidePreview.tsx - Real-time preview
  - SlideList.tsx - Slide list panel
  - SlideCard.tsx - Slide thumbnail
  - Toolbar.tsx - Editor toolbar
  - NoteEditor.tsx - Notes editor
- `presenter/` folder:
  - PresenterView.tsx
  - SlideRenderer.tsx
  - PresenterNotes.tsx
  - Timer.tsx
  - Controls.tsx
- `dashboard/` folder:
  - Dashboard.tsx
  - PresentationCard.tsx
  - CreateButton.tsx
  - FilterBar.tsx
- `share/` folder:
  - ShareDialog.tsx
  - ShareLinkCopy.tsx
  - EmbedCode.tsx
- `common/` folder:
  - UserMenu.tsx
  - LoadingSpinner.tsx

### 1.8 MSW Mocking Infrastructure
Location: `src/mocks/handlers.ts`

**Implemented endpoints:**
```
Health Check:
  ✓ GET /api/health

Items:
  ✓ GET /api/items (with pagination, filtering)
  ✓ POST /api/items (create)
  ✓ PUT /api/items/:id (update)
  ✓ DELETE /api/items/:id (delete)

Users:
  ✓ GET /api/users
  ✓ POST /api/users (create)
  ✓ PUT /api/users/:id (update)
  ✓ DELETE /api/users/:id (delete)

Auth:
  ✓ POST /api/auth/login
  ✓ POST /api/auth/logout

Search:
  ✓ GET /api/search
```

**Missing MSW handlers:**
```
Presentations:
  ✗ GET /api/presentations (list)
  ✗ POST /api/presentations (create)
  ✗ GET /api/presentations/:id (detail)
  ✗ PUT /api/presentations/:id (update)
  ✗ DELETE /api/presentations/:id (delete)
  ✗ POST /api/presentations/:id/duplicate

Slides:
  ✗ GET /api/presentations/:id/slides (list)
  ✗ POST /api/presentations/:id/slides (create)
  ✗ PUT /api/slides/:id (update)
  ✗ DELETE /api/slides/:id (delete)
  ✗ PUT /api/presentations/:id/slides/reorder

Share:
  ✗ GET /api/p/:slug
  ✗ POST /api/p/:slug/view
  ✗ PUT /api/presentations/:id/share
```

### 1.9 i18n Support
Location: `src/locales/`

**Supported languages:**
- English (en.json)
- Korean (ko.json)
- Japanese (ja.json)

**Existing translation keys:**
- common (loading, error, success, etc.)
- nav (home, dashboard, settings, etc.)
- pages (home, mswTest, zustandTest)
- form (name, email, password, etc.)
- language (select, en, ko, ja)

**Missing translation keys for slide editor:**
- editor (newSlide, save, preview, present, notes, etc.)
- dashboard (myPresentations, filterBy, sortBy, etc.)
- share (shareSettings, visibility, password, etc.)
- presenter (timer, notes, controls, etc.)

### 1.10 Tech Stack Summary

**Installed and ready:**
- React 19.2.0
- TanStack Router 1.132.0
- TanStack Query 5.90.10
- Zustand 5.0.8
- TypeScript 5.7.2
- Tailwind CSS 4.0.6
- Vite 7.1.7
- MSW 2.12.2
- Dexie 4.2.1
- i18next 25.6.3
- shadcn/ui (15+ components)
- Zod 4.1.12
- Prisma 6.19.0
- Tauri 2.9.0

**Available but not yet used:**
- Prisma Client (database schema defined but not integrated)
- Tauri API (for desktop app features)

---

## Part 2: MISSING PIECES (What Needs to Be Built)

### 2.1 Data Models - New Prisma Schema

**Required additions to `prisma/schema.prisma`:**

```prisma
// User extension with presentations
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  username      String    @unique
  fullName      String    @map("full_name")
  password      String
  avatar        String?
  bio           String?
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  presentations Presentation[]
  @@map("users")
}

// Presentation model
model Presentation {
  id            Int       @id @default(autoincrement())
  title         String
  description   String?
  slug          String    @unique
  thumbnail     String?
  visibility    Visibility @default(PRIVATE)
  password      String?
  theme         String    @default("default")
  tags          String[]  @default([])
  category      String?
  viewCount     Int       @default(0) @map("view_count")
  userId        Int       @map("user_id")
  user          User      @relation(fields: [userId], references: [id])
  slides        Slide[]
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  @@index([userId])
  @@index([visibility])
  @@index([slug])
  @@map("presentations")
}

// Slide model
model Slide {
  id              Int       @id @default(autoincrement())
  presentationId  Int       @map("presentation_id")
  presentation    Presentation @relation(fields: [presentationId], references: [id], onDelete: Cascade)
  order           Int
  content         String
  notes           String?
  layout          String    @default("default")
  transition      String?
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  @@index([presentationId])
  @@map("slides")
}

enum Visibility {
  PRIVATE
  UNLISTED
  PUBLIC
}
```

### 2.2 IndexedDB Schema - New Tables

**Required additions to `src/db/index.ts`:**

```typescript
export interface PresentationEntity {
  id?: number
  title: string
  description?: string
  slug: string
  thumbnail?: string
  visibility: 'PRIVATE' | 'UNLISTED' | 'PUBLIC'
  password?: string
  theme: string
  tags: string[]
  category?: string
  viewCount: number
  userId: number
  createdAt: string
  updatedAt: string
}

export interface SlideEntity {
  id?: number
  presentationId: number
  order: number
  content: string
  notes?: string
  layout: string
  transition?: string
  createdAt: string
  updatedAt: string
}

// Update AppDatabase class:
class AppDatabase extends Dexie {
  items!: EntityTable<ItemEntity, 'id'>
  users!: EntityTable<UserEntity, 'id'>
  presentations!: EntityTable<PresentationEntity, 'id'>  // NEW
  slides!: EntityTable<SlideEntity, 'id'>  // NEW
  
  constructor() {
    super('EasySlidesDB')
    this.version(2).stores({
      items: '++id, name, category, created_at',
      users: '++id, email, username, created_at',
      presentations: '++id, slug, userId, visibility, created_at',  // NEW
      slides: '++id, presentationId, order, created_at',  // NEW
    })
  }
}
```

### 2.3 Zod Schemas - New Files

**Files to create:**

**`src/schemas/api/presentation.ts`**
```typescript
- PresentationSchema
- PresentationCreateSchema
- PresentationUpdateSchema
- PresentationsListResponseSchema
```

**`src/schemas/api/slide.ts`**
```typescript
- SlideSchema
- SlideCreateSchema
- SlideUpdateSchema
- SlideReorderSchema
- SlidesListResponseSchema
```

**`src/schemas/api/share.ts`**
```typescript
- ShareSettingsSchema
- ShareUpdateSchema
```

### 2.4 Store Slices - New Slices

**Files to create:**

**`src/stores/slices/authSlice.ts`**
```typescript
- User state (userId, email, username, token)
- Login/logout actions
- Set user, clear user
```

**`src/stores/slices/editorSlice.ts`**
```typescript
- currentPresentation (Presentation | null)
- slides array
- currentSlideIndex
- editorMode ('markdown' | 'wysiwyg')
- unsavedChanges boolean
- Actions: setPresentation, updateSlide, addSlide, deleteSlide, reorderSlides, setEditorMode, setUnsavedChanges
```

**`src/stores/slices/presentSlice.ts`**
```typescript
- currentSlideIndex
- timer (in seconds)
- isFullscreen boolean
- showNotes boolean
- Actions: setCurrentSlide, startTimer, updateTimer, toggleFullscreen, toggleNotes
```

**`src/stores/slices/dashboardSlice.ts`**
```typescript
- sortBy ('createdAt' | 'updatedAt' | 'title')
- filterBy ('all' | 'private' | 'public')
- searchQuery string
- Actions: setSortBy, setFilterBy, setSearchQuery
```

### 2.5 API Services - New Services

**Files to create:**

**`src/api/services/presentations.ts`**
- usePresentations() - GET /api/presentations
- usePresentation(id) - GET /api/presentations/:id
- useCreatePresentation() - POST /api/presentations
- useUpdatePresentation(id) - PUT /api/presentations/:id
- useDeletePresentation(id) - DELETE /api/presentations/:id
- useDuplicatePresentation(id) - POST /api/presentations/:id/duplicate

**`src/api/services/slides.ts`**
- useSlides(presentationId) - GET /api/presentations/:id/slides
- useCreateSlide(presentationId) - POST /api/presentations/:id/slides
- useUpdateSlide(slideId) - PUT /api/slides/:id
- useDeleteSlide(slideId) - DELETE /api/slides/:id
- useReorderSlides(presentationId) - PUT /api/presentations/:id/slides/reorder

**`src/api/services/share.ts`**
- useShareSettings(presentationId) - GET /api/presentations/:id/share
- useUpdateShareSettings(presentationId) - PUT /api/presentations/:id/share
- usePublicPresentation(slug) - GET /api/p/:slug
- useIncrementViewCount(slug) - POST /api/p/:slug/view

### 2.6 Routes - New Pages

**Files to create:**

```
src/routes/
├── auth/
│   ├── login.tsx        # /auth/login
│   └── register.tsx     # /auth/register
├── dashboard.tsx        # /dashboard
├── editor/
│   ├── $id.tsx         # /editor/:id
│   └── new.tsx         # /editor/new
├── p/
│   └── $slug.tsx       # /p/:slug (public share view)
├── present/
│   └── $id.tsx         # /present/:id
├── explore/
│   └── index.tsx       # /explore (Phase 3)
├── profile/
│   └── $username.tsx   # /profile/:username (Phase 3)
└── __root.tsx          # (update to include header changes)
```

### 2.7 Components - New Components

**Editor component folder (`src/components/editor/`):**
- `Editor.tsx` - Main editor container (layout + state mgmt)
- `MarkdownEditor.tsx` - Markdown input with syntax highlighting
- `SlidePreview.tsx` - Real-time preview rendering
- `SlideList.tsx` - Side panel with slide thumbnails
- `SlideCard.tsx` - Individual slide thumbnail
- `Toolbar.tsx` - Editor toolbar with save/preview/present buttons
- `NoteEditor.tsx` - Presenter notes editor

**Presenter component folder (`src/components/presenter/`):**
- `PresenterView.tsx` - Full presentation mode container
- `SlideRenderer.tsx` - Markdown/slide content renderer
- `PresenterNotes.tsx` - Notes panel for presenter
- `Timer.tsx` - Presentation timer component
- `Controls.tsx` - Navigation controls (prev/next/fullscreen)

**Dashboard component folder (`src/components/dashboard/`):**
- `Dashboard.tsx` - Main dashboard container
- `PresentationCard.tsx` - Presentation grid card
- `CreateButton.tsx` - New presentation button (floating/in-grid)
- `FilterBar.tsx` - Filters and sorting controls

**Share component folder (`src/components/share/`):**
- `ShareDialog.tsx` - Share settings modal
- `ShareLinkCopy.tsx` - Copy to clipboard UI
- `EmbedCode.tsx` - Embed code generator

**Common component updates (`src/components/`):**
- `Header.tsx` - Update with editor/dashboard nav
- `UserMenu.tsx` - (new) User profile dropdown menu
- `LoadingSpinner.tsx` - (new) Loading indicator component
- `AuthGuard.tsx` - (new) Route protection component

### 2.8 MSW Handlers - New Endpoints

**Update `src/mocks/handlers.ts` with:**

```typescript
// Presentations CRUD
http.get('/api/presentations', ...)
http.post('/api/presentations', ...)
http.get('/api/presentations/:id', ...)
http.put('/api/presentations/:id', ...)
http.delete('/api/presentations/:id', ...)
http.post('/api/presentations/:id/duplicate', ...)

// Slides CRUD
http.get('/api/presentations/:id/slides', ...)
http.post('/api/presentations/:id/slides', ...)
http.put('/api/slides/:id', ...)
http.delete('/api/slides/:id', ...)
http.put('/api/presentations/:id/slides/reorder', ...)

// Share
http.get('/api/p/:slug', ...)
http.post('/api/p/:slug/view', ...)
http.put('/api/presentations/:id/share', ...)
```

All handlers should use IndexedDB for persistence (like existing items/users handlers).

### 2.9 i18n Translations

**Add to all locale files (en.json, ko.json, ja.json):**

```json
{
  "editor": {
    "newSlide": "...",
    "save": "...",
    "preview": "...",
    "present": "...",
    "notes": "...",
    "placeholder": "...",
    "addSlide": "...",
    "deleteSlide": "...",
    "duplicateSlide": "...",
    "reorder": "...",
    "markdown": "...",
    "wysiwyg": "..."
  },
  "dashboard": {
    "myPresentations": "...",
    "newPresentation": "...",
    "empty": "...",
    "sortBy": "...",
    "filterBy": "...",
    "visibility": "..."
  },
  "share": {
    "shareSettings": "...",
    "visibility": "...",
    "private": "...",
    "public": "...",
    "unlisted": "...",
    "copyLink": "...",
    "embedCode": "...",
    "password": "..."
  },
  "presenter": {
    "timer": "...",
    "notes": "...",
    "nextSlide": "...",
    "previousSlide": "...",
    "fullscreen": "...",
    "exit": "..."
  },
  "auth": {
    "login": "...",
    "register": "...",
    "email": "...",
    "password": "...",
    "username": "...",
    "fullName": "...",
    "logout": "...",
    "loginSuccess": "...",
    "registerSuccess": "..."
  }
}
```

### 2.10 Utilities & Helpers

**Files to create:**

**`src/lib/markdown-parser.ts`**
- parseMarkdownSlides(markdown: string) - Split markdown into slides
- renderMarkdownToHtml(markdown: string) - Render markdown to HTML

**`src/lib/slug-generator.ts`**
- generateSlug(title: string) - Create URL-safe slug with random suffix

**`src/lib/presentation-utils.ts`**
- generateThumbnail(slideContent: string) - Create slide thumbnail
- calculateReadingTime(slideContent: string) - Estimate reading time

**`src/hooks/useEditor.ts`**
- Custom hook for editor state management
- Auto-save debouncing
- Keyboard shortcuts handling

**`src/hooks/usePresenter.ts`**
- Custom hook for presenter mode
- Timer management
- Keyboard navigation

---

## Part 3: REUSABLE EXISTING CODE

### 3.1 Code Patterns to Follow

**State Management Pattern:**
```typescript
// Use Zustand slice pattern from existing slices
// Example from uiSlice.ts shows the pattern
import type { StateCreator } from 'zustand'

export interface MySlice {
  state: StateType
  action1: () => void
  action2: (arg: Type) => void
}

export const createMySlice: StateCreator<MySlice> = (set) => ({
  state: initialValue,
  action1: () => set(/* new state */),
  action2: (arg) => set(/* new state */),
})
```

**API Service Pattern:**
```typescript
// Use TanStack Query hooks pattern from existing services
// Example from items.ts shows the pattern
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { ItemSchema } from '@/schemas'

export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => apiClient.get<ItemsListResponse>('/api/items'),
  })
}

export const useCreateItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ItemCreate) => 
      apiClient.post('/api/items', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })
}
```

**MSW Handler Pattern:**
```typescript
// Use IndexedDB-backed handlers from existing handlers.ts
import { http, HttpResponse } from 'msw'
import { db } from '@/db'
import { PresentationSchema } from '@/schemas'

export const handler = http.get('/api/presentations', async () => {
  const presentations = await db.presentations.toArray()
  const response = {
    presentations,
    total: presentations.length,
  }
  return HttpResponse.json(response)
})
```

**Component Pattern:**
```typescript
// Follow shadcn/ui component composition pattern
// Use cn() utility from utils.ts for Tailwind class merging
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const MyComponent = ({ className, ...props }) => {
  return (
    <div className={cn('base-classes', className)}>
      <Button>{/* content */}</Button>
    </div>
  )
}
```

### 3.2 Reusable Infrastructure

**API Client:**
- `src/api/client.ts` - Fully ready to use for all new API calls
- Handles GET, POST, PUT, PATCH, DELETE requests
- Built-in error handling with ApiError class

**Query Client:**
- `src/lib/query-client.ts` - Pre-configured TanStack Query client
- Already integrated in main.tsx

**Store Setup:**
- `src/stores/index.ts` - Ready to extend with new slices
- Persists UI preferences to localStorage
- Redux DevTools integration in development

**i18n:**
- `src/lib/i18n.ts` - Fully configured i18next
- Supports English, Korean, Japanese
- Browser language auto-detection

**Database:**
- `src/db/index.ts` - Ready to extend with new tables
- Pattern established for IndexedDB setup with Dexie
- Seed data initialization pattern ready

**UI Components:**
- 15 shadcn/ui components already available
- cn() utility for safe Tailwind class merging
- Consistent styling with Tailwind CSS v4

### 3.3 Existing Type Definitions

**Available types (from stores/index.ts):**
```typescript
export type { User, Post } from './slices/apiSlice'
export type { Theme, Language, Notification } from './slices/uiSlice'
export type { Task } from './slices/taskSlice'
export type { WorkItem, WorkLog, WorkStatus } from './slices/workflowSlice'
```

**Available schemas (from schemas/index.ts):**
- Item, ItemCreate, ItemUpdate, ItemsList
- User, UserCreate, UsersList
- LoginRequest, LoginResponse
- HealthCheck
- HTTPValidationError

---

## Part 4: DEVELOPMENT PRIORITIES (Recommended Build Order)

### Phase 1: Foundation (Week 1-2)
1. Update Prisma schema with Presentation and Slide models
2. Update IndexedDB with presentations and slides tables
3. Create Zod schemas (presentation.ts, slide.ts, share.ts)
4. Create authSlice (for user authentication state)
5. Create editorSlice (for editor state management)
6. Update i18n translations for editor terms

### Phase 2: API Layer (Week 2-3)
7. Implement MSW handlers for all 12 presentation/slide endpoints
8. Create presentations API service (with TanStack Query hooks)
9. Create slides API service (with TanStack Query hooks)
10. Create share API service (with TanStack Query hooks)

### Phase 3: Authentication (Week 3)
11. Create /auth/login route and LoginPage component
12. Create /auth/register route and RegisterPage component
13. Implement login/logout mutations with auth API
14. Add AuthGuard component for route protection

### Phase 4: Editor UI (Week 4-5)
15. Create /editor/new and /editor/:id routes
16. Create Editor.tsx main component with split view layout
17. Create MarkdownEditor.tsx with syntax highlighting
18. Create SlidePreview.tsx with markdown rendering
19. Create SlideList.tsx with drag-and-drop reordering
20. Create Toolbar.tsx with save/preview/present buttons
21. Implement auto-save with debounced mutations

### Phase 5: Dashboard (Week 5)
22. Create /dashboard route
23. Create Dashboard.tsx with presentation grid
24. Create PresentationCard.tsx with thumbnail
25. Create FilterBar.tsx with sort/filter controls
26. Implement CRUD operations for presentations

### Phase 6: Presenter Mode (Week 6)
27. Create /present/:id route
28. Create PresenterView.tsx full-screen layout
29. Create SlideRenderer.tsx for markdown rendering
30. Create Timer.tsx with countdown
31. Create Controls.tsx with keyboard navigation
32. Implement keyboard shortcuts (←→ for navigation, F for fullscreen, etc.)

### Phase 7: Share Feature (Week 6)
33. Create /p/:slug public share view route
34. Implement public presentation viewing
35. Create ShareDialog.tsx with share settings
36. Implement password protection and visibility settings

### Phase 8: Testing & Polish (Week 7-8)
37. Add unit tests for critical functions
38. Responsive design optimization
39. Cross-browser testing
40. Performance optimization (memoization, code splitting)

---

## Part 5: QUICK START CHECKLIST

**Immediate Next Steps:**

- [ ] Update `prisma/schema.prisma` with Presentation and Slide models
- [ ] Update `src/db/index.ts` with presentations and slides tables
- [ ] Create `src/schemas/api/presentation.ts` with Zod schemas
- [ ] Create `src/schemas/api/slide.ts` with Zod schemas
- [ ] Create `src/stores/slices/authSlice.ts`
- [ ] Create `src/stores/slices/editorSlice.ts`
- [ ] Update `src/stores/index.ts` to include new slices
- [ ] Add i18n keys to all locale files
- [ ] Create MSW handlers for presentations and slides endpoints
- [ ] Create API services for presentations, slides, and share

**Do NOT:**
- ✗ Edit `src/routes/routeTree.gen.ts` (auto-generated)
- ✗ Use npm or yarn (use pnpm only)
- ✗ Add any `any` types (strict TypeScript)
- ✗ Skip Zod validation for API calls
- ✗ Hardcode UI text (use i18n)
- ✗ Store server state in Zustand (use TanStack Query)

---

## Summary Table: Existing vs Missing

| Component | Existing | Missing |
|-----------|----------|---------|
| **Core** | React, TS, Vite | Presentation CRUD, Slides CRUD |
| **Routing** | 4 routes | 8+ editor routes |
| **State** | 4 slices | 4 slices (auth, editor, presenter, dashboard) |
| **API** | 5 services | 3 services (presentations, slides, share) |
| **Database** | 2 tables | 2 tables (presentations, slides) |
| **Schemas** | 5+ schemas | 3+ schemas (presentation, slide, share) |
| **MSW** | 10+ endpoints | 12 endpoints (presentations, slides, share) |
| **Components** | 18 components | 15+ components (editor, presenter, dashboard, share) |
| **i18n** | Base translations | Editor/dashboard/share/presenter terms |
| **Infrastructure** | Complete | Feature-ready |

---

**Document End**

Generated: 2025-11-20
Project: Easy Slides (웹 프레젠테이션 플랫폼)

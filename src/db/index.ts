/**
 * IndexedDB Database Configuration
 *
 * Uses Dexie.js for IndexedDB wrapper.
 * This provides a mock database for frontend development.
 */

import Dexie, { type EntityTable } from 'dexie'

// =============================================================================
// Database Entity Types (stored in IndexedDB)
// =============================================================================

export interface ItemEntity {
  id?: number
  name: string
  description: string
  price: number
  category: string
  created_at: string
  updated_at: string
}

export interface UserEntity {
  id?: number
  email: string
  username: string
  full_name: string
  password?: string
  avatar?: string
  bio?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Visibility = 'PRIVATE' | 'UNLISTED' | 'PUBLIC'

export interface PresentationEntity {
  id?: number
  title: string
  description?: string
  slug: string
  thumbnail?: string
  visibility: Visibility
  password?: string
  theme: string
  tags: string[]
  category?: string
  view_count: number
  user_id: number
  created_at: string
  updated_at: string
}

export interface SlideEntity {
  id?: number
  presentation_id: number
  order: number
  content: string
  notes?: string
  layout: string
  transition?: string
  created_at: string
  updated_at: string
}

// =============================================================================
// Database Class
// =============================================================================

export class AppDatabase extends Dexie {
  items!: EntityTable<ItemEntity, 'id'>
  users!: EntityTable<UserEntity, 'id'>
  presentations!: EntityTable<PresentationEntity, 'id'>
  slides!: EntityTable<SlideEntity, 'id'>

  constructor() {
    super('EasySlidesDB')

    this.version(1).stores({
      items: '++id, name, category, created_at',
      users: '++id, email, username, created_at',
    })

    this.version(2).stores({
      items: '++id, name, category, created_at',
      users: '++id, email, username, created_at, updated_at',
      presentations: '++id, slug, user_id, visibility, created_at, updated_at',
      slides: '++id, presentation_id, order, created_at, updated_at',
    })
  }
}

// =============================================================================
// Database Instance
// =============================================================================

export const db = new AppDatabase()

// =============================================================================
// Seed Data
// =============================================================================

const initialItems: Omit<ItemEntity, 'id'>[] = [
  {
    name: '노트북',
    description: '고성능 노트북',
    price: 1500000,
    category: '전자제품',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    name: '마우스',
    description: '무선 마우스',
    price: 30000,
    category: '전자제품',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    name: '키보드',
    description: '기계식 키보드',
    price: 150000,
    category: '전자제품',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
]

const initialUsers: Omit<UserEntity, 'id'>[] = [
  {
    email: 'admin@example.com',
    username: 'admin',
    full_name: '관리자',
    password: 'admin', // In production, this would be hashed
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    email: 'user1@example.com',
    username: 'user1',
    full_name: '홍길동',
    password: 'password',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    email: 'user2@example.com',
    username: 'user2',
    full_name: '김철수',
    password: 'password',
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
]

const initialPresentations: Omit<PresentationEntity, 'id'>[] = [
  {
    title: 'React 성능 최적화 기법',
    description: 'React 애플리케이션의 성능을 향상시키는 다양한 기법들을 소개합니다.',
    slug: 'react-performance-optimization-abc123',
    visibility: 'PUBLIC',
    theme: 'default',
    tags: ['react', 'performance', 'frontend'],
    category: '기술',
    view_count: 150,
    user_id: 1,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    title: 'TypeScript 입문 가이드',
    description: 'TypeScript를 처음 시작하는 분들을 위한 입문 가이드입니다.',
    slug: 'typescript-intro-guide-def456',
    visibility: 'PUBLIC',
    theme: 'dark',
    tags: ['typescript', 'javascript', 'beginner'],
    category: '기술',
    view_count: 89,
    user_id: 1,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    title: '나의 비공개 발표',
    description: '아직 작업 중인 발표자료입니다.',
    slug: 'my-private-presentation-ghi789',
    visibility: 'PRIVATE',
    theme: 'minimal',
    tags: [],
    view_count: 0,
    user_id: 1,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
]

const initialSlides: Omit<SlideEntity, 'id'>[] = [
  // Slides for presentation 1 (React 성능 최적화)
  {
    presentation_id: 1,
    order: 0,
    content: '# React 성능 최적화 기법\n\n발표자: 관리자\n2024년 1월',
    notes: '인사 및 자기소개로 시작',
    layout: 'default',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    presentation_id: 1,
    order: 1,
    content: '## 목차\n\n- React.memo 사용법\n- useMemo와 useCallback\n- 가상화 (Virtualization)\n- 코드 스플리팅',
    notes: '전체 발표 흐름 설명',
    layout: 'default',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    presentation_id: 1,
    order: 2,
    content: '## React.memo\n\n```jsx\nconst MyComponent = React.memo(({ data }) => {\n  return <div>{data.name}</div>\n})\n```\n\n불필요한 리렌더링을 방지합니다.',
    notes: 'React.memo의 사용 케이스 설명',
    layout: 'default',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Slides for presentation 2 (TypeScript 입문)
  {
    presentation_id: 2,
    order: 0,
    content: '# TypeScript 입문 가이드\n\n타입 안전한 JavaScript의 세계로!',
    notes: '환영 인사',
    layout: 'default',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    presentation_id: 2,
    order: 1,
    content: '## TypeScript란?\n\n- JavaScript의 슈퍼셋\n- 정적 타입 시스템\n- 컴파일 타임 에러 체크\n- 더 나은 개발자 경험',
    notes: 'TypeScript의 기본 개념 설명',
    layout: 'default',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  // Slides for presentation 3 (비공개 발표)
  {
    presentation_id: 3,
    order: 0,
    content: '# 제목을 입력하세요\n\n발표 내용을 작성하세요.',
    layout: 'default',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
]

// =============================================================================
// Database Initialization
// =============================================================================

/**
 * Initialize the database with seed data if empty
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if items table is empty
    const itemCount = await db.items.count()
    if (itemCount === 0) {
      await db.items.bulkAdd(initialItems)
      console.log('[IndexedDB] Seeded items table with initial data')
    }

    // Check if users table is empty
    const userCount = await db.users.count()
    if (userCount === 0) {
      await db.users.bulkAdd(initialUsers)
      console.log('[IndexedDB] Seeded users table with initial data')
    }

    // Check if presentations table is empty
    const presentationCount = await db.presentations.count()
    if (presentationCount === 0) {
      await db.presentations.bulkAdd(initialPresentations)
      console.log('[IndexedDB] Seeded presentations table with initial data')
    }

    // Check if slides table is empty
    const slideCount = await db.slides.count()
    if (slideCount === 0) {
      await db.slides.bulkAdd(initialSlides)
      console.log('[IndexedDB] Seeded slides table with initial data')
    }

    console.log('[IndexedDB] Database initialized successfully')
  } catch (error) {
    console.error('[IndexedDB] Failed to initialize database:', error)
    throw error
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase(): Promise<void> {
  await db.items.clear()
  await db.users.clear()
  await db.presentations.clear()
  await db.slides.clear()
  console.log('[IndexedDB] Database cleared')
}

/**
 * Reset database to initial state
 */
export async function resetDatabase(): Promise<void> {
  await clearDatabase()
  await initializeDatabase()
  console.log('[IndexedDB] Database reset to initial state')
}

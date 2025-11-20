# Easy Slides - 웹 프레젠테이션 플랫폼 개발 계획서

**Version**: 1.0
**Date**: 2025-11-20
**Status**: Draft

---

## 목차

1. [프로젝트 비전](#1-프로젝트-비전)
2. [타겟 사용자](#2-타겟-사용자)
3. [핵심 기능](#3-핵심-기능)
4. [기술 아키텍처](#4-기술-아키텍처)
5. [데이터 모델](#5-데이터-모델)
6. [UI/UX 설계](#6-uiux-설계)
7. [API 엔드포인트](#7-api-엔드포인트)
8. [개발 로드맵](#8-개발-로드맵)
9. [기술적 고려사항](#9-기술적-고려사항)

---

## 1. 프로젝트 비전

### 1.1 목표
세미나와 강연 발표자들이 손쉽게 발표 자료를 만들고, URL로 공유하며, 실제 발표에 활용할 수 있는 웹 기반 프레젠테이션 플랫폼 구축

### 1.2 경쟁 제품 분석

| 제품 | 특징 | Easy Slides 차별점 |
|------|------|-------------------|
| **Slidev** | Markdown 기반, 개발자 친화적 | 비개발자도 쉽게 사용 가능한 GUI 에디터 |
| **Reveal.js** | HTML/JS 기반, 커스터마이징 자유도 높음 | 코드 없이 바로 사용 가능 |
| **Google Slides** | 클라우드, 협업 | 발표에 최적화된 UI, 발표자료 탐색/공유 플랫폼 |
| **Canva** | 디자인 중심, 템플릿 풍부 | 텍스트/구조 중심, 발표 특화 기능 |

### 1.3 핵심 가치
- **간편함**: 복잡한 설정 없이 즉시 발표자료 제작
- **공유성**: URL 하나로 즉시 공유, 다운로드 불필요
- **발표 최적화**: 발표자 노트, 타이머, 리모컨 등 발표 특화 기능
- **탐색 가능성**: 유용한 발표자료를 검색하고 발견할 수 있는 플랫폼

---

## 2. 타겟 사용자

### 2.1 Primary Users (1차 타겟)
- **세미나/강연 발표자**
  - 기술 세미나, 컨퍼런스 발표자
  - 기업 내부 발표, 팀 미팅 발표자
  - 대학/학원 강의자

### 2.2 Secondary Users (2차 타겟)
- **콘텐츠 소비자** (플랫폼 성장 후)
  - 발표자료를 검색하는 학습자
  - 레퍼런스를 찾는 발표 준비자
  - 특정 주제 관심자

### 2.3 사용자 시나리오

**시나리오 1: 세미나 발표자 "김개발"**
1. 새 프레젠테이션 생성
2. 마크다운 또는 GUI 에디터로 슬라이드 작성
3. 미리보기로 확인
4. 공개/비공개 설정 후 URL 공유
5. 발표 모드로 실제 발표 진행

**시나리오 2: 콘텐츠 탐색자 "이학습"**
1. 플랫폼 방문, "React 성능 최적화" 검색
2. 관련 발표자료 목록 확인
3. 관심있는 발표자료 열람
4. 북마크 또는 팔로우

---

## 3. 핵심 기능

### 3.1 MVP (Phase 1) - 필수 기능

#### 3.1.1 프레젠테이션 관리
- [ ] 프레젠테이션 CRUD (생성/읽기/수정/삭제)
- [ ] 슬라이드 추가/삭제/순서변경
- [ ] 프레젠테이션 복제
- [ ] 프레젠테이션 목록 (내 발표자료)

#### 3.1.2 슬라이드 에디터
- [ ] **마크다운 에디터** (기본 모드)
  - 실시간 미리보기 (Split View)
  - 문법 하이라이팅
  - 이미지/코드블록 지원
- [ ] **기본 슬라이드 요소**
  - 제목/본문 텍스트
  - 불릿 리스트
  - 코드 블록 (Syntax highlighting)
  - 이미지 삽입

#### 3.1.3 발표 모드 (Presenter View)
- [ ] 전체화면 슬라이드 뷰
- [ ] 키보드 네비게이션 (←/→, Space, Enter)
- [ ] 슬라이드 번호 표시
- [ ] 발표자 노트 (듀얼 모니터 지원)
- [ ] 발표 타이머

#### 3.1.4 공유 기능
- [ ] 고유 URL 생성 (`/p/:presentationId`)
- [ ] 공개/비공개 설정
- [ ] 비밀번호 보호 (선택)
- [ ] 임베드 코드 생성

#### 3.1.5 사용자 인증
- [ ] 로그인/회원가입
- [ ] 프로필 관리
- [ ] 내 프레젠테이션 대시보드

---

### 3.2 Phase 2 - 확장 기능

#### 3.2.1 고급 에디터
- [ ] **WYSIWYG 에디터** (선택적)
- [ ] 테마/템플릿 선택
- [ ] 슬라이드 레이아웃 템플릿
- [ ] 다이어그램/차트 삽입 (Mermaid 연동)
- [ ] 드래그앤드롭 이미지 업로드
- [ ] 애니메이션 효과

#### 3.2.2 발표 강화
- [ ] 발표자 뷰 (현재 슬라이드 + 다음 슬라이드 + 노트)
- [ ] 레이저 포인터
- [ ] 줌 기능
- [ ] 화면 녹화

#### 3.2.3 협업 기능
- [ ] 공동 편집 (실시간)
- [ ] 댓글/피드백
- [ ] 버전 히스토리

---

### 3.3 Phase 3 - 플랫폼 기능

#### 3.3.1 탐색 & 발견
- [ ] 공개 프레젠테이션 검색
- [ ] 카테고리/태그 필터
- [ ] 인기/최신 정렬
- [ ] 사용자 프로필 페이지

#### 3.3.2 소셜 기능
- [ ] 좋아요/북마크
- [ ] 팔로우/팔로워
- [ ] 조회수 통계
- [ ] 공유 통계

#### 3.3.3 내보내기
- [ ] PDF 다운로드
- [ ] PowerPoint 변환
- [ ] 이미지 내보내기 (각 슬라이드)

---

## 4. 기술 아키텍처

### 4.1 프론트엔드 (현재 구축된 기반 활용)

```
┌─────────────────────────────────────────────────────────────────┐
│                        EASY SLIDES                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────── ROUTING ─────────────────────┐
│  /                    Landing/Home        │
│  /auth/login          로그인              │
│  /auth/register       회원가입            │
│  /dashboard           내 발표자료 대시보드  │
│  /editor/:id          슬라이드 에디터       │
│  /editor/new          새 프레젠테이션       │
│  /p/:id               공유 뷰 (읽기 전용)   │
│  /present/:id         발표 모드            │
│  /explore             탐색/검색 (Phase 3)  │
│  /profile/:username   사용자 프로필        │
└──────────────────────────────────────────┘

┌──────────── STATE MANAGEMENT ────────────┐
│  Zustand Slices:                          │
│  ├─ authSlice      - 인증/사용자 정보      │
│  ├─ editorSlice    - 에디터 상태          │
│  │   ├─ currentPresentation               │
│  │   ├─ slides[]                          │
│  │   ├─ currentSlideIndex                 │
│  │   ├─ editorMode (markdown/wysiwyg)     │
│  │   └─ unsavedChanges                    │
│  ├─ presentSlice   - 발표 모드 상태       │
│  │   ├─ currentSlide                      │
│  │   ├─ timer                             │
│  │   ├─ isFullscreen                      │
│  │   └─ showNotes                         │
│  ├─ uiSlice        - UI 상태 (기존 활용)   │
│  └─ dashboardSlice - 대시보드 필터/정렬   │
└──────────────────────────────────────────┘

┌──────────── API SERVICES ────────────────┐
│  TanStack Query Hooks:                    │
│  ├─ presentations.ts                      │
│  │   ├─ usePresentations()                │
│  │   ├─ usePresentation(id)               │
│  │   ├─ useCreatePresentation()           │
│  │   ├─ useUpdatePresentation()           │
│  │   └─ useDeletePresentation()           │
│  ├─ slides.ts                             │
│  │   ├─ useSlides(presentationId)         │
│  │   ├─ useCreateSlide()                  │
│  │   ├─ useUpdateSlide()                  │
│  │   ├─ useDeleteSlide()                  │
│  │   └─ useReorderSlides()                │
│  ├─ share.ts                              │
│  │   ├─ useShareSettings(id)              │
│  │   └─ useUpdateShareSettings()          │
│  └─ auth.ts (기존 확장)                    │
└──────────────────────────────────────────┘
```

### 4.2 컴포넌트 구조

```
src/
├── components/
│   ├── editor/
│   │   ├── Editor.tsx              # 에디터 메인 컨테이너
│   │   ├── MarkdownEditor.tsx      # 마크다운 에디터
│   │   ├── SlidePreview.tsx        # 실시간 미리보기
│   │   ├── SlideList.tsx           # 슬라이드 목록 (좌측 패널)
│   │   ├── SlideCard.tsx           # 썸네일 카드
│   │   ├── Toolbar.tsx             # 에디터 툴바
│   │   └── NoteEditor.tsx          # 발표자 노트 에디터
│   ├── presenter/
│   │   ├── PresenterView.tsx       # 발표 모드 메인
│   │   ├── SlideRenderer.tsx       # 슬라이드 렌더링
│   │   ├── PresenterNotes.tsx      # 발표자 노트 뷰
│   │   ├── Timer.tsx               # 발표 타이머
│   │   └── Controls.tsx            # 발표 컨트롤
│   ├── dashboard/
│   │   ├── Dashboard.tsx           # 대시보드 메인
│   │   ├── PresentationCard.tsx    # 프레젠테이션 카드
│   │   ├── CreateButton.tsx        # 새 프레젠테이션 버튼
│   │   └── FilterBar.tsx           # 필터/정렬 바
│   ├── share/
│   │   ├── ShareDialog.tsx         # 공유 설정 다이얼로그
│   │   ├── ShareLinkCopy.tsx       # 링크 복사 UI
│   │   └── EmbedCode.tsx           # 임베드 코드 생성
│   └── common/
│       ├── Header.tsx              # (기존 확장)
│       ├── UserMenu.tsx            # 사용자 메뉴
│       └── LoadingSpinner.tsx      # 로딩 인디케이터
```

---

## 5. 데이터 모델

### 5.1 Prisma Schema

```prisma
// 기존 User 모델 확장
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  username      String    @unique
  fullName      String    @map("full_name")
  password      String    // hashed
  avatar        String?
  bio           String?
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  presentations Presentation[]

  @@map("users")
}

model Presentation {
  id            Int       @id @default(autoincrement())
  title         String
  description   String?
  slug          String    @unique  // URL용 고유 식별자
  thumbnail     String?   // 썸네일 이미지 URL

  // 공개 설정
  visibility    Visibility @default(PRIVATE)
  password      String?    // 비밀번호 보호 (선택)

  // 메타데이터
  theme         String    @default("default")
  tags          String[]  @default([])
  category      String?

  // 통계
  viewCount     Int       @default(0) @map("view_count")

  // 관계
  userId        Int       @map("user_id")
  user          User      @relation(fields: [userId], references: [id])
  slides        Slide[]

  // 타임스탬프
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@index([userId])
  @@index([visibility])
  @@index([slug])
  @@map("presentations")
}

model Slide {
  id              Int       @id @default(autoincrement())
  presentationId  Int       @map("presentation_id")
  presentation    Presentation @relation(fields: [presentationId], references: [id], onDelete: Cascade)

  order           Int       // 슬라이드 순서
  content         String    // 마크다운 콘텐츠
  notes           String?   // 발표자 노트

  // 슬라이드별 설정
  layout          String    @default("default")
  transition      String?   // 전환 효과

  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  @@index([presentationId])
  @@map("slides")
}

enum Visibility {
  PRIVATE     // 본인만
  UNLISTED    // 링크 있는 사람만
  PUBLIC      // 전체 공개 (검색 가능)
}
```

### 5.2 Zod Schemas

```typescript
// src/schemas/api/presentation.ts

export const PresentationCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['PRIVATE', 'UNLISTED', 'PUBLIC']).default('PRIVATE'),
  theme: z.string().default('default'),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
})

export const PresentationUpdateSchema = PresentationCreateSchema.partial()

export const SlideCreateSchema = z.object({
  content: z.string(),
  notes: z.string().optional(),
  layout: z.string().default('default'),
  order: z.number().int().nonnegative(),
})

export const SlideUpdateSchema = SlideCreateSchema.partial()

export const SlideReorderSchema = z.object({
  slides: z.array(z.object({
    id: z.number(),
    order: z.number(),
  })),
})
```

### 5.3 IndexedDB Entities (Mock DB)

```typescript
// src/db/index.ts

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
```

---

## 6. UI/UX 설계

### 6.1 페이지 레이아웃

#### 6.1.1 대시보드 (`/dashboard`)
```
┌─────────────────────────────────────────────────────┐
│  Header [Logo] [검색] [새 프레젠테이션+] [프로필]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  내 프레젠테이션                    [정렬v] [필터v] │
│                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 썸네일   │ │ 썸네일   │ │ 썸네일   │ │   +     │   │
│  │         │ │         │ │         │ │ 새 발표  │   │
│  │ 제목    │ │ 제목    │ │ 제목    │ │         │   │
│  │ 2일전   │ │ 1주전   │ │ 3주전   │ │         │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 6.1.2 에디터 (`/editor/:id`)
```
┌─────────────────────────────────────────────────────────────┐
│  Header [← 대시보드] [제목 입력...] [저장] [미리보기] [발표] │
├──────┬──────────────────────────┬───────────────────────────┤
│ 슬라 │     마크다운 에디터       │      실시간 미리보기       │
│ 이드 │                         │                           │
│ 목록 │  # 제목                  │  ┌─────────────────────┐  │
│      │                         │  │                     │  │
│ [1]  │  - 항목 1                │  │   제목              │  │
│ ──── │  - 항목 2                │  │   • 항목 1          │  │
│ [2]  │                         │  │   • 항목 2          │  │
│ ──── │  ```js                   │  │                     │  │
│ [3]  │  const x = 1             │  │   const x = 1       │  │
│      │  ```                     │  │                     │  │
│ [+]  │                         │  └─────────────────────┘  │
│      │                         │                           │
├──────┴──────────────────────────┴───────────────────────────┤
│  발표자 노트: [여기에 발표시 참고할 내용을 적으세요...]       │
└─────────────────────────────────────────────────────────────┘
```

#### 6.1.3 발표 모드 (`/present/:id`)
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                                                     │
│                    슬라이드 내용                     │
│                                                     │
│                                                     │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [1/10]           [◀] [▶]              [15:30] [⛶] │
└─────────────────────────────────────────────────────┘
```

#### 6.1.4 공유 뷰 (`/p/:id`)
```
┌─────────────────────────────────────────────────────┐
│  [Logo] 프레젠테이션 제목          [공유] [전체화면] │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│                    슬라이드 내용                     │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [◀] [1/10] [▶]              @작성자 | 조회수 123   │
└─────────────────────────────────────────────────────┘
```

### 6.2 테마 시스템

```typescript
// 기본 테마
const themes = {
  default: {
    background: '#ffffff',
    text: '#1a1a1a',
    accent: '#3b82f6',
    code: '#f3f4f6',
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#60a5fa',
    code: '#2d2d2d',
  },
  minimal: {
    background: '#fafafa',
    text: '#333333',
    accent: '#000000',
    code: '#f0f0f0',
  },
  // 더 많은 테마 추가 가능
}
```

### 6.3 키보드 단축키

| 단축키 | 기능 | 컨텍스트 |
|--------|------|----------|
| `Cmd/Ctrl + S` | 저장 | 에디터 |
| `Cmd/Ctrl + N` | 새 슬라이드 | 에디터 |
| `Cmd/Ctrl + D` | 슬라이드 복제 | 에디터 |
| `←` / `→` | 이전/다음 슬라이드 | 발표 모드 |
| `Space` / `Enter` | 다음 슬라이드 | 발표 모드 |
| `Escape` | 발표 종료 | 발표 모드 |
| `F` | 전체화면 토글 | 발표 모드 |
| `N` | 발표자 노트 토글 | 발표 모드 |

---

## 7. API 엔드포인트

### 7.1 인증 (Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 현재 사용자 정보 |
| PUT | `/api/auth/profile` | 프로필 업데이트 |

### 7.2 프레젠테이션 (Presentations)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/presentations` | 내 프레젠테이션 목록 |
| POST | `/api/presentations` | 프레젠테이션 생성 |
| GET | `/api/presentations/:id` | 프레젠테이션 상세 |
| PUT | `/api/presentations/:id` | 프레젠테이션 수정 |
| DELETE | `/api/presentations/:id` | 프레젠테이션 삭제 |
| POST | `/api/presentations/:id/duplicate` | 프레젠테이션 복제 |

### 7.3 슬라이드 (Slides)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/presentations/:id/slides` | 슬라이드 목록 |
| POST | `/api/presentations/:id/slides` | 슬라이드 추가 |
| PUT | `/api/slides/:id` | 슬라이드 수정 |
| DELETE | `/api/slides/:id` | 슬라이드 삭제 |
| PUT | `/api/presentations/:id/slides/reorder` | 순서 변경 |

### 7.4 공유 (Share)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/p/:slug` | 공유 뷰 데이터 |
| POST | `/api/p/:slug/view` | 조회수 증가 |
| PUT | `/api/presentations/:id/share` | 공유 설정 변경 |

### 7.5 탐색 (Explore) - Phase 3

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/explore` | 공개 프레젠테이션 목록 |
| GET | `/api/explore/search` | 검색 |
| GET | `/api/explore/trending` | 인기 프레젠테이션 |
| GET | `/api/profile/:username` | 사용자 프로필 |

---

## 8. 개발 로드맵

### 8.1 Phase 1: MVP (주 4-6주)

#### Week 1-2: 기반 구축
- [ ] 데이터 모델 구현 (Prisma + Zod + IndexedDB)
- [ ] API 서비스 훅 구현 (TanStack Query)
- [ ] MSW 핸들러 구현
- [ ] Zustand 슬라이스 구현 (auth, editor, presenter)
- [ ] 기본 라우팅 설정

#### Week 2-3: 에디터 개발
- [ ] 마크다운 에디터 컴포넌트
- [ ] 실시간 미리보기
- [ ] 슬라이드 목록 관리
- [ ] 저장/자동저장 기능
- [ ] 발표자 노트 에디터

#### Week 3-4: 발표 모드
- [ ] 전체화면 슬라이드 렌더러
- [ ] 키보드 네비게이션
- [ ] 타이머 컴포넌트
- [ ] 발표자 노트 뷰

#### Week 4-5: 공유 & 인증
- [ ] 로그인/회원가입 페이지
- [ ] 공유 URL 생성
- [ ] 공유 뷰 페이지
- [ ] 공유 설정 다이얼로그

#### Week 5-6: 대시보드 & 마무리
- [ ] 대시보드 페이지
- [ ] 프레젠테이션 카드
- [ ] 검색/필터
- [ ] 반응형 디자인 최적화
- [ ] 테스트 및 버그 수정

### 8.2 Phase 2: 확장 기능 (주 3-4주)
- [ ] 테마 시스템
- [ ] 슬라이드 템플릿
- [ ] 이미지 업로드
- [ ] 코드 하이라이팅 개선
- [ ] 발표자 뷰 (듀얼 모니터)
- [ ] PDF 내보내기

### 8.3 Phase 3: 플랫폼 기능 (주 4주+)
- [ ] 탐색 페이지
- [ ] 검색 기능
- [ ] 사용자 프로필
- [ ] 소셜 기능 (좋아요, 팔로우)
- [ ] 통계 대시보드

---

## 9. 기술적 고려사항

### 9.1 마크다운 렌더링
**선택지:**
- `react-markdown` + `remark-gfm` - 가장 일반적
- `marked` + `highlight.js` - 더 빠름
- `unified` ecosystem - 확장성 좋음

**추천:** `react-markdown` + `remark-gfm` + `react-syntax-highlighter`

### 9.2 슬라이드 레이아웃 시스템
```typescript
// 슬라이드 마크다운 구분자
const slideDelimiter = '---'

// 파싱 예시
const parseSlides = (markdown: string): string[] => {
  return markdown.split(/^---$/m).map(s => s.trim())
}
```

### 9.3 자동 저장
```typescript
// Debounced auto-save
const useDebouncedSave = (content: string, delay = 2000) => {
  const debouncedContent = useDebounce(content, delay)
  const updateMutation = useUpdateSlide()

  useEffect(() => {
    if (debouncedContent) {
      updateMutation.mutate(debouncedContent)
    }
  }, [debouncedContent])
}
```

### 9.4 전체화면 API
```typescript
const enterFullscreen = async (element: HTMLElement) => {
  if (element.requestFullscreen) {
    await element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    await element.webkitRequestFullscreen()
  }
}
```

### 9.5 URL Slug 생성
```typescript
const generateSlug = (title: string): string => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')

  const random = nanoid(6)
  return `${base}-${random}`
}
```

### 9.6 PWA 오프라인 지원
- 프레젠테이션 데이터 로컬 캐싱 (IndexedDB)
- 오프라인 발표 모드 지원
- 온라인 복귀 시 자동 동기화

### 9.7 i18n 고려사항
모든 UI 텍스트는 번역 키 사용:
```typescript
// 에디터 관련 번역
{
  "editor": {
    "newSlide": "새 슬라이드",
    "save": "저장",
    "preview": "미리보기",
    "present": "발표",
    "notes": "발표자 노트",
    "placeholder": "마크다운으로 슬라이드를 작성하세요..."
  }
}
```

---

## 10. 성공 지표 (KPIs)

### 10.1 MVP 성공 기준
- [ ] 프레젠테이션 생성부터 발표까지 전체 플로우 동작
- [ ] URL 공유 및 열람 가능
- [ ] 모바일/태블릿 반응형 지원
- [ ] 주요 기능 i18n 적용

### 10.2 장기 성공 지표
- 월간 활성 사용자 (MAU)
- 생성된 프레젠테이션 수
- 공유 URL 클릭 수
- 검색을 통한 발견 비율

---

## 11. 리스크 및 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 마크다운 렌더링 성능 | 중 | 메모이제이션, 가상화 |
| 대용량 이미지 | 중 | 압축, CDN, lazy loading |
| 브라우저 호환성 | 중 | Polyfill, graceful degradation |
| 실시간 협업 복잡도 | 높 | Phase 2로 연기, CRDT 검토 |

---

## 12. 다음 단계

1. **계획서 검토 및 승인**
2. **Phase 1 상세 태스크 분해**
3. **데이터 모델 구현 시작**
4. **핵심 컴포넌트 개발**

---

**문서 끝**

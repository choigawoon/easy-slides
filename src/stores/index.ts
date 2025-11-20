/**
 * Main Store - Combines all slices into a single Zustand store
 *
 * Usage in components:
 * ```tsx
 * import { useStore } from '@/stores'
 *
 * // Use entire store
 * const store = useStore()
 *
 * // Use specific state (recommended for performance)
 * const users = useStore(state => state.users)
 * const addTask = useStore(state => state.addTask)
 * const theme = useStore(state => state.theme)
 * ```
 *
 * Benefits of this pattern:
 * - No props drilling
 * - Type-safe state access
 * - Modular slice organization
 * - Easy to test individual slices
 * - Performance optimization with selectors
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { createApiSlice, type ApiSlice } from './slices/apiSlice'
import { createUiSlice, type UiSlice } from './slices/uiSlice'
import { createTaskSlice, type TaskSlice } from './slices/taskSlice'
import { createWorkflowSlice, type WorkflowSlice } from './slices/workflowSlice'
import { createEditorSlice, type EditorSlice } from './slices/editorSlice'
import { createAuthSlice, type AuthSlice } from './slices/authSlice'
import { createPresenterSlice, type PresenterSlice } from './slices/presenterSlice'

// Combined store type
export type Store = ApiSlice & UiSlice & TaskSlice & WorkflowSlice & EditorSlice & AuthSlice & PresenterSlice

/**
 * Main application store
 * Combines all slices and adds middleware for:
 * - DevTools: Redux DevTools integration (dev only)
 * - Persist: LocalStorage persistence for UI preferences
 */
export const useStore = create<Store>()(
  devtools(
    persist(
      (...args) => ({
        ...createApiSlice(...args),
        ...createUiSlice(...args),
        ...createTaskSlice(...args),
        ...createWorkflowSlice(...args),
        ...createEditorSlice(...args),
        ...createAuthSlice(...args),
        ...createPresenterSlice(...args),
      }),
      {
        name: 'app-storage', // LocalStorage key
        // Only persist UI preferences and auth token, not API data or tasks
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          isSidebarOpen: state.isSidebarOpen,
          editorMode: state.editorMode,
          token: state.token,
        }),
      }
    ),
    {
      name: 'App Store', // Name shown in Redux DevTools
      enabled: import.meta.env.DEV, // Only enable in development
    }
  )
)

/**
 * Selector hooks for better performance
 * These hooks only re-render when specific state changes
 */

// API selectors
export const useUsers = () => useStore(state => state.users)
export const usePosts = () => useStore(state => state.posts)
export const useApiLoading = () => useStore(state => state.isLoading)

// UI selectors
export const useTheme = () => useStore(state => state.theme)
export const useLanguage = () => useStore(state => state.language)
export const useSidebar = () => useStore(state => state.isSidebarOpen)
export const useModal = () => useStore(state => state.modal)
export const useNotifications = () => useStore(state => state.notifications)

// Task selectors
export const useTasks = () => useStore(
  useShallow((state) => {
    const { tasks, filter, sortBy } = state

    // Filter tasks
    let filtered = tasks
    if (filter !== 'all') {
      filtered = tasks.filter(task => task.status === filter)
    }

    // Sort tasks
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.getTime() - b.dueDate.getTime()
        case 'createdAt':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

    return sorted
  })
)
export const useSelectedTask = () => useStore(state => {
  const { selectedTaskId, getTaskById } = state
  return selectedTaskId ? getTaskById(selectedTaskId) : null
})
export const useTaskFilter = () => useStore(state => state.filter)
export const useSortBy = () => useStore(state => state.sortBy)

// Workflow selectors
export const useCurrentWork = () => useStore(state => state.currentWork)
export const useWorkHistory = () => useStore(state => state.workHistory)
export const useWorkLogs = () => useStore(state => state.workLogs)
export const useIsWorkInProgress = () => useStore(state => state.isWorkInProgress)

// Editor selectors
export const useCurrentPresentation = () => useStore(state => state.currentPresentation)
export const useSlides = () => useStore(state => state.slides)
export const useCurrentSlideIndex = () => useStore(state => state.currentSlideIndex)
export const useCurrentSlide = () => useStore(state => state.slides[state.currentSlideIndex])
export const useEditorMode = () => useStore(state => state.editorMode)
export const useUnsavedChanges = () => useStore(state => state.unsavedChanges)
export const useEditorLoading = () => useStore(state => state.isLoading)
export const useEditorSaving = () => useStore(state => state.isSaving)
export const useLastSavedAt = () => useStore(state => state.lastSavedAt)

/**
 * Action hooks for better organization
 * Group related actions together
 */

export const useApiActions = () => useStore(
  useShallow(state => ({
    fetchUsers: state.fetchUsers,
    fetchPosts: state.fetchPosts,
    addUser: state.addUser,
    removeUser: state.removeUser,
    updateUser: state.updateUser,
  }))
)

export const useUiActions = () => useStore(
  useShallow(state => ({
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
    setTheme: state.setTheme,
    setLanguage: state.setLanguage,
    openModal: state.openModal,
    closeModal: state.closeModal,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
  }))
)

export const useTaskActions = () => useStore(
  useShallow(state => ({
    addTask: state.addTask,
    updateTask: state.updateTask,
    deleteTask: state.deleteTask,
    selectTask: state.selectTask,
    setTaskStatus: state.setTaskStatus,
    setFilter: state.setFilter,
    setSortBy: state.setSortBy,
  }))
)

export const useWorkflowActions = () => useStore(
  useShallow(state => ({
    startWork: state.startWork,
    updateWorkProgress: state.updateWorkProgress,
    completeWork: state.completeWork,
    failWork: state.failWork,
    cancelWork: state.cancelWork,
    clearHistory: state.clearHistory,
    addLog: state.addLog,
    clearLogs: state.clearLogs,
    simulateWork: state.simulateWork,
  }))
)

export const useEditorActions = () => useStore(
  useShallow(state => ({
    // Presentation actions
    setCurrentPresentation: state.setCurrentPresentation,
    updatePresentationTitle: state.updatePresentationTitle,
    clearEditor: state.clearEditor,
    // Slide actions
    setSlides: state.setSlides,
    setCurrentSlideIndex: state.setCurrentSlideIndex,
    addSlide: state.addSlide,
    updateSlide: state.updateSlide,
    deleteSlide: state.deleteSlide,
    reorderSlides: state.reorderSlides,
    duplicateSlide: state.duplicateSlide,
    // Editor state actions
    setEditorMode: state.setEditorMode,
    setUnsavedChanges: state.setUnsavedChanges,
    setIsLoading: state.setIsLoading,
    setIsSaving: state.setIsSaving,
    markAsSaved: state.markAsSaved,
    // Navigation actions
    goToNextSlide: state.goToNextSlide,
    goToPreviousSlide: state.goToPreviousSlide,
    goToSlide: state.goToSlide,
    // Reset
    resetEditor: state.resetEditor,
  }))
)

/**
 * Reset all stores (useful for logout)
 */
export const useResetStore = () => {
  const apiReset = useStore(state => state.reset)
  const uiReset = useStore(state => state.reset)
  const taskReset = useStore(state => state.reset)

  return () => {
    // Note: This will call the same reset multiple times
    // In production, you might want to create separate reset methods
    // or handle this differently
    apiReset()
    uiReset()
    taskReset()
  }
}

// Auth selectors
export const useUser = () => useStore(state => state.user)
export const useIsAuthenticated = () => useStore(state => state.isAuthenticated)
export const useAuthLoading = () => useStore(state => state.isLoading)
export const useAuthToken = () => useStore(state => state.token)

// Presenter selectors
export const usePresenterSlideIndex = () => useStore(state => state.currentSlideIndex)
export const usePresenterTotalSlides = () => useStore(state => state.totalSlides)
export const usePresenterFullscreen = () => useStore(state => state.isFullscreen)
export const usePresenterShowNotes = () => useStore(state => state.showNotes)
export const usePresenterShowControls = () => useStore(state => state.showControls)
export const usePresenterElapsedTime = () => useStore(state => state.elapsedTime)
export const usePresenterTimerRunning = () => useStore(state => state.isTimerRunning)

// Auth actions
export const useAuthActions = () => useStore(
  useShallow(state => ({
    setUser: state.setUser,
    setToken: state.setToken,
    login: state.login,
    logout: state.logout,
    setLoading: state.setLoading,
  }))
)

// Presenter actions
export const usePresenterActions = () => useStore(
  useShallow(state => ({
    setCurrentSlide: state.setCurrentSlide,
    nextSlide: state.nextSlide,
    prevSlide: state.prevSlide,
    setTotalSlides: state.setTotalSlides,
    toggleFullscreen: state.toggleFullscreen,
    setFullscreen: state.setFullscreen,
    toggleNotes: state.toggleNotes,
    setShowNotes: state.setShowNotes,
    toggleControls: state.toggleControls,
    setShowControls: state.setShowControls,
    startTimer: state.startTimer,
    stopTimer: state.stopTimer,
    resetTimer: state.resetTimer,
    incrementTimer: state.incrementTimer,
    setPresentationId: state.setPresentationId,
    resetPresenter: state.reset,
  }))
)

// Export types for use in components
export type { User as ApiUser, Post } from './slices/apiSlice'
export type { Theme, Language, Notification } from './slices/uiSlice'
export type { Task } from './slices/taskSlice'
export type { WorkItem, WorkLog, WorkStatus } from './slices/workflowSlice'
export type { EditorMode } from './slices/editorSlice'
export type { User as AuthUser } from './slices/authSlice'

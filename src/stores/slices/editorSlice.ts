/**
 * Editor Slice - Manages slide editor state
 *
 * Purpose: Handle editor state for creating and editing presentations
 * Use cases: Current presentation, slides management, editor mode, auto-save
 */

import type { StateCreator } from 'zustand'
import type { PresentationResponse, SlideResponse } from '@/schemas/api'

export type EditorMode = 'markdown' | 'wysiwyg'

export interface EditorSlice {
  // State
  currentPresentation: PresentationResponse | null
  slides: SlideResponse[]
  currentSlideIndex: number
  editorMode: EditorMode
  unsavedChanges: boolean
  isLoading: boolean
  isSaving: boolean
  lastSavedAt: Date | null

  // Actions - Presentation
  setCurrentPresentation: (presentation: PresentationResponse | null) => void
  updatePresentationTitle: (title: string) => void
  clearEditor: () => void

  // Actions - Slides
  setSlides: (slides: SlideResponse[]) => void
  setCurrentSlideIndex: (index: number) => void
  addSlide: (slide: SlideResponse) => void
  updateSlide: (slideId: number, updates: Partial<SlideResponse>) => void
  deleteSlide: (slideId: number) => void
  reorderSlides: (fromIndex: number, toIndex: number) => void
  duplicateSlide: (slideId: number) => void

  // Actions - Editor State
  setEditorMode: (mode: EditorMode) => void
  setUnsavedChanges: (hasChanges: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  setIsSaving: (isSaving: boolean) => void
  markAsSaved: () => void

  // Actions - Navigation
  goToNextSlide: () => void
  goToPreviousSlide: () => void
  goToSlide: (index: number) => void

  // Reset
  resetEditor: () => void
}

const initialState = {
  currentPresentation: null,
  slides: [],
  currentSlideIndex: 0,
  editorMode: 'markdown' as EditorMode,
  unsavedChanges: false,
  isLoading: false,
  isSaving: false,
  lastSavedAt: null,
}

export const createEditorSlice: StateCreator<EditorSlice> = (set) => ({
  ...initialState,

  // Presentation actions
  setCurrentPresentation: (presentation) => {
    set({ currentPresentation: presentation })
  },

  updatePresentationTitle: (title) => {
    set((state) => {
      if (!state.currentPresentation) return state
      return {
        currentPresentation: { ...state.currentPresentation, title },
        unsavedChanges: true,
      }
    })
  },

  clearEditor: () => {
    set(initialState)
  },

  // Slide actions
  setSlides: (slides) => {
    set({ slides: slides.sort((a, b) => a.order - b.order) })
  },

  setCurrentSlideIndex: (index) => {
    set({ currentSlideIndex: index })
  },

  addSlide: (slide) => {
    set((state) => ({
      slides: [...state.slides, slide].sort((a, b) => a.order - b.order),
      currentSlideIndex: state.slides.length,
      unsavedChanges: true,
    }))
  },

  updateSlide: (slideId, updates) => {
    set((state) => ({
      slides: state.slides.map((slide) =>
        slide.id === slideId ? { ...slide, ...updates } : slide
      ),
      unsavedChanges: true,
    }))
  },

  deleteSlide: (slideId) => {
    set((state) => {
      const newSlides = state.slides.filter((slide) => slide.id !== slideId)
      const newIndex = Math.min(state.currentSlideIndex, newSlides.length - 1)
      return {
        slides: newSlides.map((slide, index) => ({ ...slide, order: index })),
        currentSlideIndex: Math.max(0, newIndex),
        unsavedChanges: true,
      }
    })
  },

  reorderSlides: (fromIndex, toIndex) => {
    set((state) => {
      const newSlides = [...state.slides]
      const [movedSlide] = newSlides.splice(fromIndex, 1)
      newSlides.splice(toIndex, 0, movedSlide)
      return {
        slides: newSlides.map((slide, index) => ({ ...slide, order: index })),
        currentSlideIndex: toIndex,
        unsavedChanges: true,
      }
    })
  },

  duplicateSlide: (slideId) => {
    set((state) => {
      const slideIndex = state.slides.findIndex((s) => s.id === slideId)
      if (slideIndex === -1) return state

      const slideToDuplicate = state.slides[slideIndex]
      const newSlide: SlideResponse = {
        ...slideToDuplicate,
        id: Date.now(), // Temporary ID for optimistic update
        order: slideIndex + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const newSlides = [...state.slides]
      newSlides.splice(slideIndex + 1, 0, newSlide)

      return {
        slides: newSlides.map((slide, index) => ({ ...slide, order: index })),
        currentSlideIndex: slideIndex + 1,
        unsavedChanges: true,
      }
    })
  },

  // Editor state actions
  setEditorMode: (mode) => {
    set({ editorMode: mode })
  },

  setUnsavedChanges: (hasChanges) => {
    set({ unsavedChanges: hasChanges })
  },

  setIsLoading: (isLoading) => {
    set({ isLoading })
  },

  setIsSaving: (isSaving) => {
    set({ isSaving })
  },

  markAsSaved: () => {
    set({
      unsavedChanges: false,
      isSaving: false,
      lastSavedAt: new Date(),
    })
  },

  // Navigation actions
  goToNextSlide: () => {
    set((state) => ({
      currentSlideIndex: Math.min(
        state.currentSlideIndex + 1,
        state.slides.length - 1
      ),
    }))
  },

  goToPreviousSlide: () => {
    set((state) => ({
      currentSlideIndex: Math.max(state.currentSlideIndex - 1, 0),
    }))
  },

  goToSlide: (index) => {
    set((state) => ({
      currentSlideIndex: Math.max(0, Math.min(index, state.slides.length - 1)),
    }))
  },

  // Reset
  resetEditor: () => set(initialState),
})

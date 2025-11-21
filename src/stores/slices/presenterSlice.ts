/**
 * Presenter Slice - Manages presentation mode state
 *
 * Purpose: Handle presenter view state, timer, navigation
 * Use cases: Slide navigation, timer control, presenter notes visibility
 */

import type { StateCreator } from 'zustand'

export interface PresenterSlice {
  // State
  currentSlideIndex: number
  totalSlides: number
  isFullscreen: boolean
  showNotes: boolean
  showControls: boolean
  elapsedTime: number
  isTimerRunning: boolean
  presentationId: number | null

  // Actions
  setCurrentSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
  setTotalSlides: (total: number) => void
  toggleFullscreen: () => void
  setFullscreen: (isFullscreen: boolean) => void
  toggleNotes: () => void
  setShowNotes: (show: boolean) => void
  toggleControls: () => void
  setShowControls: (show: boolean) => void
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  incrementTimer: () => void
  setPresentationId: (id: number | null) => void
  reset: () => void
}

const initialState = {
  currentSlideIndex: 0,
  totalSlides: 0,
  isFullscreen: false,
  showNotes: false,
  showControls: true,
  elapsedTime: 0,
  isTimerRunning: false,
  presentationId: null,
}

export const createPresenterSlice: StateCreator<PresenterSlice> = (set, get) => ({
  ...initialState,

  setCurrentSlide: (index) => {
    const { totalSlides } = get()
    if (index >= 0 && index < totalSlides) {
      set({ currentSlideIndex: index })
    }
  },

  nextSlide: () => {
    const { currentSlideIndex, totalSlides } = get()
    if (currentSlideIndex < totalSlides - 1) {
      set({ currentSlideIndex: currentSlideIndex + 1 })
    }
  },

  prevSlide: () => {
    const { currentSlideIndex } = get()
    if (currentSlideIndex > 0) {
      set({ currentSlideIndex: currentSlideIndex - 1 })
    }
  },

  setTotalSlides: (total) => {
    set({ totalSlides: total })
  },

  toggleFullscreen: () => {
    set((state) => ({ isFullscreen: !state.isFullscreen }))
  },

  setFullscreen: (isFullscreen) => {
    set({ isFullscreen })
  },

  toggleNotes: () => {
    set((state) => ({ showNotes: !state.showNotes }))
  },

  setShowNotes: (show) => {
    set({ showNotes: show })
  },

  toggleControls: () => {
    set((state) => ({ showControls: !state.showControls }))
  },

  setShowControls: (show) => {
    set({ showControls: show })
  },

  startTimer: () => {
    set({ isTimerRunning: true })
  },

  stopTimer: () => {
    set({ isTimerRunning: false })
  },

  resetTimer: () => {
    set({ elapsedTime: 0 })
  },

  incrementTimer: () => {
    set((state) => ({ elapsedTime: state.elapsedTime + 1 }))
  },

  setPresentationId: (id) => {
    set({ presentationId: id })
  },

  reset: () => {
    set(initialState)
  },
})

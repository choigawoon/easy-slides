/**
 * Editor - Main slide editor component
 */

import { useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Toolbar } from './Toolbar'
import { SlideList } from './SlideList'
import { MarkdownEditor } from './MarkdownEditor'
import { SlidePreview } from './SlidePreview'
import { NoteEditor } from './NoteEditor'
import {
  useCurrentPresentation,
  useSlides,
  useCurrentSlideIndex,
  useCurrentSlide,
  useUnsavedChanges,
  useEditorSaving,
  useEditorActions,
} from '@/stores'
import {
  usePresentation,
  useSlides as useSlidesQuery,
  useUpdatePresentation,
  useUpdateSlide,
  useCreateSlide,
  useDeleteSlide,
} from '@/api/services'

interface EditorProps {
  presentationId: number
}

export function Editor({ presentationId }: EditorProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Store state
  const currentPresentation = useCurrentPresentation()
  const slides = useSlides()
  const currentSlideIndex = useCurrentSlideIndex()
  const currentSlide = useCurrentSlide()
  const unsavedChanges = useUnsavedChanges()
  const isSaving = useEditorSaving()

  // Store actions
  const {
    setCurrentPresentation,
    setSlides,
    setCurrentSlideIndex,
    addSlide,
    updateSlide,
    deleteSlide,
    updatePresentationTitle,
    setIsSaving,
    markAsSaved,
    clearEditor,
  } = useEditorActions()

  // API queries
  const { data: presentationData } = usePresentation(presentationId)
  const { data: slidesData } = useSlidesQuery(presentationId)

  // API mutations
  const updatePresentationMutation = useUpdatePresentation()
  const updateSlideMutation = useUpdateSlide()
  const createSlideMutation = useCreateSlide()
  const deleteSlideMutation = useDeleteSlide()

  // Load presentation data into store
  useEffect(() => {
    if (presentationData) {
      setCurrentPresentation(presentationData)
    }
  }, [presentationData, setCurrentPresentation])

  // Load slides data into store
  useEffect(() => {
    if (slidesData?.slides) {
      setSlides(slidesData.slides)
    }
  }, [slidesData, setSlides])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearEditor()
    }
  }, [clearEditor])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        handleAddSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [unsavedChanges, currentSlide])

  // Save handler
  const handleSave = useCallback(async () => {
    if (!currentPresentation || !unsavedChanges) return

    setIsSaving(true)

    try {
      // Save presentation title
      await updatePresentationMutation.mutateAsync({
        id: currentPresentation.id,
        data: { title: currentPresentation.title },
      })

      // Save all slides
      for (const slide of slides) {
        await updateSlideMutation.mutateAsync({
          id: slide.id,
          data: {
            content: slide.content,
            notes: slide.notes,
            layout: slide.layout,
          },
        })
      }

      markAsSaved()
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [
    currentPresentation,
    slides,
    unsavedChanges,
    updatePresentationMutation,
    updateSlideMutation,
    setIsSaving,
    markAsSaved,
  ])

  // Add slide handler
  const handleAddSlide = useCallback(async () => {
    if (!currentPresentation) return

    try {
      const result = await createSlideMutation.mutateAsync({
        presentationId: currentPresentation.id,
        data: {
          content: '# 새 슬라이드\n\n내용을 입력하세요.',
          layout: 'default',
          order: slides.length,
        },
      })

      addSlide(result)
    } catch (error) {
      console.error('Failed to create slide:', error)
    }
  }, [currentPresentation, slides.length, createSlideMutation, addSlide])

  // Delete slide handler
  const handleDeleteSlide = useCallback(
    async (slideId: number) => {
      if (!currentPresentation || slides.length <= 1) return

      try {
        await deleteSlideMutation.mutateAsync({
          id: slideId,
          presentationId: currentPresentation.id,
        })

        deleteSlide(slideId)
      } catch (error) {
        console.error('Failed to delete slide:', error)
      }
    },
    [currentPresentation, slides.length, deleteSlideMutation, deleteSlide]
  )

  // Duplicate slide handler
  const handleDuplicateSlide = useCallback(
    async (slideId: number) => {
      if (!currentPresentation) return

      const slideToDuplicate = slides.find((s) => s.id === slideId)
      if (!slideToDuplicate) return

      try {
        const result = await createSlideMutation.mutateAsync({
          presentationId: currentPresentation.id,
          data: {
            content: slideToDuplicate.content,
            notes: slideToDuplicate.notes || undefined,
            layout: slideToDuplicate.layout,
            order: slideToDuplicate.order + 1,
          },
        })

        addSlide(result)
      } catch (error) {
        console.error('Failed to duplicate slide:', error)
      }
    },
    [currentPresentation, slides, createSlideMutation, addSlide]
  )

  // Content change handler
  const handleContentChange = useCallback(
    (content: string) => {
      if (!currentSlide) return
      updateSlide(currentSlide.id, { content })
    },
    [currentSlide, updateSlide]
  )

  // Notes change handler
  const handleNotesChange = useCallback(
    (notes: string) => {
      if (!currentSlide) return
      updateSlide(currentSlide.id, { notes })
    },
    [currentSlide, updateSlide]
  )

  // Navigation handlers
  const handleBack = useCallback(() => {
    if (unsavedChanges) {
      // Could add a confirmation dialog here
      if (!confirm(t('editor.unsavedConfirm'))) {
        return
      }
    }
    navigate({ to: '/' })
  }, [navigate, unsavedChanges, t])

  const handlePreview = useCallback(() => {
    // Open in new tab for preview
    if (currentPresentation) {
      window.open(`/p/${currentPresentation.slug}`, '_blank')
    }
  }, [currentPresentation])

  const handlePresent = useCallback(() => {
    // Open in presentation mode
    if (currentPresentation) {
      window.open(`/present/${currentPresentation.id}`, '_blank')
    }
  }, [currentPresentation])

  const handleShare = useCallback(() => {
    // TODO: Open share dialog
    console.log('Share clicked')
  }, [])

  if (!currentPresentation || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          {t('common.loading')}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <Toolbar
        title={currentPresentation.title}
        onTitleChange={updatePresentationTitle}
        onSave={handleSave}
        onPreview={handlePreview}
        onPresent={handlePresent}
        onShare={handleShare}
        onBack={handleBack}
        isSaving={isSaving}
        hasUnsavedChanges={unsavedChanges}
      />

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Slide list */}
        <SlideList
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSlideSelect={setCurrentSlideIndex}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
          onDuplicateSlide={handleDuplicateSlide}
        />

        {/* Editor and preview split */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            {/* Markdown editor */}
            <div className="flex-1 border-r">
              <MarkdownEditor
                value={currentSlide?.content || ''}
                onChange={handleContentChange}
                className="h-full"
              />
            </div>

            {/* Preview */}
            <div className="flex-1 bg-muted/20">
              <SlidePreview
                content={currentSlide?.content || ''}
                theme={currentPresentation.theme}
                className="h-full"
              />
            </div>
          </div>

          {/* Notes editor */}
          <NoteEditor
            value={currentSlide?.notes || ''}
            onChange={handleNotesChange}
          />
        </div>
      </div>
    </div>
  )
}

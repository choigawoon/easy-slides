/**
 * SlideList - Left panel showing slide thumbnails
 */

import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SlideResponse } from '@/schemas/api'

interface SlideListProps {
  slides: SlideResponse[]
  currentSlideIndex: number
  onSlideSelect: (index: number) => void
  onAddSlide: () => void
  onDeleteSlide: (slideId: number) => void
  onDuplicateSlide: (slideId: number) => void
}

export function SlideList({
  slides,
  currentSlideIndex,
  onSlideSelect,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
}: SlideListProps) {
  const { t } = useTranslation()

  return (
    <div className="w-48 border-r bg-muted/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-2 border-b">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onAddSlide}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t('editor.newSlide')}
        </Button>
      </div>

      {/* Slides list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'group relative rounded-md border bg-background cursor-pointer transition-colors',
              currentSlideIndex === index
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
            onClick={() => onSlideSelect(index)}
          >
            {/* Slide number */}
            <div className="absolute top-1 left-1 text-xs font-medium text-muted-foreground bg-background/80 px-1 rounded">
              {index + 1}
            </div>

            {/* Actions */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicateSlide(slide.id)
                }}
                className="p-0.5 rounded hover:bg-muted"
                title={t('editor.duplicate')}
              >
                <Copy className="h-3 w-3 text-muted-foreground" />
              </button>
              {slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSlide(slide.id)
                  }}
                  className="p-0.5 rounded hover:bg-destructive/10"
                  title={t('editor.delete')}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              )}
            </div>

            {/* Thumbnail preview */}
            <div className="aspect-video p-2 pt-6">
              <div className="w-full h-full bg-muted/50 rounded text-[6px] leading-tight overflow-hidden p-1">
                {slide.content.substring(0, 100)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Share2,
  Eye,
  User,
  Presentation,
  Copy,
  Check,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePresentationBySlug } from '@/api/services/presentations'

function ShareViewPage() {
  const { t } = useTranslation()
  const { slug } = Route.useParams()

  // State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // API hooks
  const { data, isLoading, error } = usePresentationBySlug(slug)

  const presentation = data?.presentation
  const slides = data?.slides || []
  const currentSlide = slides[currentSlideIndex]
  const totalSlides = slides.length

  // Navigation
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1)
    }
  }, [currentSlideIndex, totalSlides])

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1)
    }
  }, [currentSlideIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault()
          goToNextSlide()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          goToPrevSlide()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNextSlide, goToPrevSlide])

  // Copy link
  const copyLink = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fullscreen
  const enterFullscreen = async () => {
    const slideContainer = document.getElementById('slide-container')
    if (slideContainer) {
      await slideContainer.requestFullscreen()
    }
  }

  // Render markdown (simplified)
  const renderMarkdown = (content: string) => {
    if (!content) return null

    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let listItems: string[] = []
    let inCodeBlock = false
    let codeContent: string[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 text-lg">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    const flushCode = () => {
      if (codeContent.length > 0) {
        elements.push(
          <pre
            key={`code-${elements.length}`}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm"
          >
            <code>{codeContent.join('\n')}</code>
          </pre>
        )
        codeContent = []
      }
    }

    lines.forEach((line) => {
      // Code block
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCode()
          inCodeBlock = false
        } else {
          flushList()
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={elements.length} className="text-4xl font-bold mb-6">
            {line.substring(2)}
          </h1>
        )
        return
      }
      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={elements.length} className="text-3xl font-semibold mb-4">
            {line.substring(3)}
          </h2>
        )
        return
      }
      if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={elements.length} className="text-2xl font-medium mb-3">
            {line.substring(4)}
          </h3>
        )
        return
      }

      // List items
      if (line.match(/^[-*]\s/)) {
        listItems.push(line.substring(2))
        return
      }

      // Regular paragraph
      if (line.trim()) {
        flushList()
        elements.push(
          <p key={elements.length} className="text-lg mb-3">
            {line}
          </p>
        )
      }
    })

    flushList()
    flushCode()

    return elements
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    )
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('pages.notFound.title')}</h1>
          <p className="text-muted-foreground mb-4">
            {t('pages.notFound.description')}
          </p>
          <Link to="/">
            <Button>{t('pages.notFound.goHome')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80">
              <Presentation className="h-6 w-6 text-blue-500" />
              <span className="font-bold">Easy Slides</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="font-semibold truncate max-w-md">
              {presentation.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="h-4 w-4 mr-1" />
              {t('editor.share')}
            </Button>
            <Button variant="outline" size="sm" onClick={enterFullscreen}>
              <Maximize className="h-4 w-4 mr-1" />
              {t('editor.preview')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Slide container */}
        <div
          id="slide-container"
          className="flex-1 flex items-center justify-center p-8 bg-muted/30"
        >
          <div className="bg-card rounded-lg shadow-lg w-full max-w-4xl aspect-video flex items-center justify-center p-8 overflow-auto">
            <div className="w-full">
              {renderMarkdown(currentSlide?.content || '')}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-t bg-card py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Author info */}
            <div className="flex items-center gap-4">
              {presentation.user && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{presentation.user.full_name || presentation.user.username}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{presentation.view_count}</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevSlide}
                disabled={currentSlideIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {currentSlideIndex + 1} / {totalSlides}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextSlide}
                disabled={currentSlideIndex === totalSlides - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2">
              {presentation.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('share.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('share.link.label')}
              </label>
              <div className="flex gap-2">
                <Input value={window.location.href} readOnly />
                <Button onClick={copyLink}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      {t('share.link.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      {t('share.link.copy')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Route = createFileRoute('/p/$slug')({
  component: ShareViewPage,
})

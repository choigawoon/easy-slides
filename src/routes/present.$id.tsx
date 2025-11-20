import { useState, useEffect, useCallback, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Minimize,
  Clock,
  FileText,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { usePresentation } from '@/api/services/presentations'
import { useSlides } from '@/api/services/slides'

function PresenterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const presentationId = parseInt(id, 10)

  // State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const hideControlsTimeoutRef = useRef<number>()

  // API hooks
  const { data: presentation, isLoading: isPresentationLoading } =
    usePresentation(presentationId)
  const { data: slidesData, isLoading: isSlidesLoading } =
    useSlides(presentationId)

  const slides = slidesData?.items || []
  const currentSlide = slides[currentSlideIndex]
  const totalSlides = slides.length

  // Timer effect
  useEffect(() => {
    let interval: number
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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

  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Exit presenter
  const exitPresenter = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    navigate({ to: '/editor/$id', params: { id } })
  }, [navigate, id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          goToNextSlide()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          goToPrevSlide()
          break
        case 'Escape':
          exitPresenter()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'n':
        case 'N':
          setShowNotes((prev) => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNextSlide, goToPrevSlide, exitPresenter, toggleFullscreen])

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
      hideControlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 text-2xl">
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
            className="bg-gray-800 text-gray-100 p-6 rounded-lg overflow-x-auto text-xl"
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
          <h1 key={elements.length} className="text-6xl font-bold mb-8">
            {line.substring(2)}
          </h1>
        )
        return
      }
      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={elements.length} className="text-4xl font-semibold mb-6">
            {line.substring(3)}
          </h2>
        )
        return
      }
      if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={elements.length} className="text-3xl font-medium mb-4">
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
          <p key={elements.length} className="text-2xl mb-4">
            {line}
          </p>
        )
      }
    })

    flushList()
    flushCode()

    return elements
  }

  if (isPresentationLoading || isSlidesLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    )
  }

  if (!presentation || !slides.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-xl">{t('common.error')}</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="h-screen bg-black text-white flex flex-col overflow-hidden select-none"
      onClick={goToNextSlide}
    >
      {/* Main slide area */}
      <div className={`flex-1 flex ${showNotes ? 'flex-row' : ''}`}>
        {/* Slide content */}
        <div
          className={`flex-1 flex items-center justify-center p-12 ${
            showNotes ? 'w-2/3' : 'w-full'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            goToNextSlide()
          }}
        >
          <div className="max-w-5xl w-full">
            {renderMarkdown(currentSlide?.content || '')}
          </div>
        </div>

        {/* Notes panel */}
        {showNotes && (
          <div
            className="w-1/3 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} />
              {t('presenter.notes')}
            </h3>
            {currentSlide?.notes ? (
              <p className="text-gray-300 whitespace-pre-wrap">
                {currentSlide.notes}
              </p>
            ) : (
              <p className="text-gray-500 italic">{t('presenter.noNotes')}</p>
            )}
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Left: Timer */}
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={() => setElapsedTime(0)}
            >
              <RotateCcw size={14} />
            </Button>
          </div>

          {/* Center: Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/10"
              onClick={goToPrevSlide}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft size={24} />
            </Button>
            <span className="text-lg font-medium min-w-[100px] text-center">
              {t('presenter.slideNumber', {
                current: currentSlideIndex + 1,
                total: totalSlides,
              })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/10"
              onClick={goToNextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
            >
              <ChevronRight size={24} />
            </Button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 text-white hover:bg-white/10 ${
                showNotes ? 'bg-white/20' : ''
              }`}
              onClick={() => setShowNotes(!showNotes)}
              title={t('presenter.notes')}
            >
              <FileText size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={toggleFullscreen}
              title={t('presenter.controls.fullscreen')}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={exitPresenter}
              title={t('presenter.exit')}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{
            width: `${((currentSlideIndex + 1) / totalSlides) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/present/$id')({
  component: PresenterPage,
})

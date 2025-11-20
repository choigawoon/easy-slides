/**
 * Toolbar - Editor toolbar with actions
 */

import { useTranslation } from 'react-i18next'
import {
  Save,
  Play,
  Eye,
  Share2,
  ChevronLeft,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface ToolbarProps {
  title: string
  onTitleChange: (title: string) => void
  onSave: () => void
  onPreview: () => void
  onPresent: () => void
  onShare: () => void
  onBack: () => void
  isSaving: boolean
  hasUnsavedChanges: boolean
}

export function Toolbar({
  title,
  onTitleChange,
  onSave,
  onPreview,
  onPresent,
  onShare,
  onBack,
  isSaving,
  hasUnsavedChanges,
}: ToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="h-14 border-b bg-background flex items-center px-4 gap-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        {t('editor.back')}
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Title input */}
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="max-w-md font-medium"
        placeholder={t('editor.titlePlaceholder')}
      />

      {/* Unsaved indicator */}
      {hasUnsavedChanges && (
        <span className="text-xs text-muted-foreground">{t('editor.unsaved')}</span>
      )}

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !hasUnsavedChanges}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          {t('editor.save')}
        </Button>

        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-1" />
          {t('editor.share')}
        </Button>

        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-1" />
          {t('editor.preview')}
        </Button>

        <Button size="sm" onClick={onPresent}>
          <Play className="h-4 w-4 mr-1" />
          {t('editor.present')}
        </Button>
      </div>
    </div>
  )
}

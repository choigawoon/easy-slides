/**
 * NoteEditor - Presenter notes editor
 */

import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'

interface NoteEditorProps {
  value: string
  onChange: (value: string) => void
}

export function NoteEditor({ value, onChange }: NoteEditorProps) {
  const { t } = useTranslation()

  return (
    <div className="border-t bg-muted/30">
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{t('editor.notes')}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('editor.notesPlaceholder')}
        className="w-full h-24 resize-none bg-transparent text-sm p-4 focus:outline-none"
      />
    </div>
  )
}

/**
 * MarkdownEditor - Markdown text editor component
 */

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
}: MarkdownEditorProps) {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      // Insert tab character
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)

      // Move cursor after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className={className}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t('editor.placeholder')}
        className="w-full h-full resize-none bg-transparent font-mono text-sm p-4 focus:outline-none"
        spellCheck={false}
      />
    </div>
  )
}

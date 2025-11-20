/**
 * SlidePreview - Real-time markdown preview
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface SlidePreviewProps {
  content: string
  theme?: string
  className?: string
}

// Simple markdown to HTML converter (basic implementation)
function parseMarkdown(markdown: string): string {
  let html = markdown
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-8 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code class="text-sm font-mono">$2</code></pre>')
    // Paragraphs (empty lines)
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    // Line breaks
    .replace(/\n/gim, '<br />')

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p class="mb-4">' + html + '</p>'
  }

  // Clean up consecutive list items
  html = html.replace(/<\/li><br \/><li/g, '</li><li')

  return html
}

export function SlidePreview({ content, theme = 'default', className }: SlidePreviewProps) {
  const renderedContent = useMemo(() => parseMarkdown(content), [content])

  return (
    <div
      className={cn(
        'w-full h-full overflow-auto',
        theme === 'dark' && 'bg-gray-900 text-white',
        theme === 'minimal' && 'bg-gray-50 text-gray-900',
        theme === 'default' && 'bg-white text-gray-900',
        className
      )}
    >
      <div className="p-8 max-w-4xl mx-auto">
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>
    </div>
  )
}

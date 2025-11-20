/**
 * New Editor Route - /editor/new
 *
 * Page for creating a new presentation
 */

import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useCreatePresentation } from '@/api/services'

export const Route = createFileRoute('/editor/new')({
  component: NewEditorPage,
})

function NewEditorPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createPresentation = useCreatePresentation()

  useEffect(() => {
    // Create a new presentation and redirect to editor
    const create = async () => {
      try {
        const result = await createPresentation.mutateAsync({
          title: t('editor.newPresentation'),
          visibility: 'PRIVATE',
          theme: 'default',
          tags: [],
        })

        // Redirect to editor with the new presentation ID
        navigate({
          to: '/editor/$id',
          params: { id: result.id.toString() },
          replace: true,
        })
      } catch (error) {
        console.error('Failed to create presentation:', error)
      }
    }

    create()
  }, [createPresentation, navigate, t])

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <div className="text-muted-foreground">{t('editor.creating')}</div>
      </div>
    </div>
  )
}

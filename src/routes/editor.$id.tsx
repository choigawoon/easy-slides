/**
 * Editor Route - /editor/:id
 *
 * Page for editing an existing presentation
 */

import { createFileRoute } from '@tanstack/react-router'
import { Editor } from '@/components/editor'

export const Route = createFileRoute('/editor/$id')({
  component: EditorPage,
})

function EditorPage() {
  const { id } = Route.useParams()
  const presentationId = parseInt(id, 10)

  if (isNaN(presentationId)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-destructive">Invalid presentation ID</div>
      </div>
    )
  }

  return <Editor presentationId={presentationId} />
}

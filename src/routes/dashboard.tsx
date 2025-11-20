import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Presentation,
  FileText,
  Eye,
  MoreVertical,
  Pencil,
  Play,
  Share2,
  Copy,
  Trash2,
  Lock,
  Globe,
  Link as LinkIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

import {
  usePresentations,
  useCreatePresentation,
  useDeletePresentation,
  useDuplicatePresentation,
} from '@/api/services/presentations'

type SortOption = 'newest' | 'oldest' | 'title' | 'titleDesc' | 'mostViewed'
type FilterOption = 'all' | 'PUBLIC' | 'UNLISTED' | 'PRIVATE'

function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [presentationToDelete, setPresentationToDelete] = useState<{
    id: number
    title: string
  } | null>(null)

  // API hooks
  const { data: presentations, isLoading, error } = usePresentations()
  const createPresentation = useCreatePresentation()
  const deletePresentation = useDeletePresentation()
  const duplicatePresentation = useDuplicatePresentation()

  // Filter and sort presentations
  const filteredPresentations = useMemo(() => {
    if (!presentations?.items) return []

    let filtered = [...presentations.items]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
    }

    // Apply visibility filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((p) => p.visibility === filterBy)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        break
      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        )
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'titleDesc':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'mostViewed':
        filtered.sort((a, b) => b.view_count - a.view_count)
        break
    }

    return filtered
  }, [presentations, searchQuery, sortBy, filterBy])

  // Handlers
  const handleCreateNew = async () => {
    try {
      const result = await createPresentation.mutateAsync({
        title: 'Untitled Presentation',
        description: '',
        visibility: 'PRIVATE',
        theme: 'default',
        tags: [],
      })
      navigate({ to: '/editor/$id', params: { id: String(result.id) } })
    } catch (error) {
      console.error('Failed to create presentation:', error)
    }
  }

  const handleEdit = (id: number) => {
    navigate({ to: '/editor/$id', params: { id: String(id) } })
  }

  const handlePresent = (id: number) => {
    navigate({ to: '/present/$id', params: { id: String(id) } })
  }

  const handleDuplicate = async (id: number) => {
    try {
      await duplicatePresentation.mutateAsync(id)
    } catch (error) {
      console.error('Failed to duplicate presentation:', error)
    }
  }

  const handleDeleteClick = (id: number, title: string) => {
    setPresentationToDelete({ id, title })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!presentationToDelete) return
    try {
      await deletePresentation.mutateAsync(presentationToDelete.id)
      setDeleteDialogOpen(false)
      setPresentationToDelete(null)
    } catch (error) {
      console.error('Failed to delete presentation:', error)
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return <Globe className="h-3 w-3" />
      case 'UNLISTED':
        return <LinkIcon className="h-3 w-3" />
      case 'PRIVATE':
        return <Lock className="h-3 w-3" />
      default:
        return null
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return t('dashboard.filter.public')
      case 'UNLISTED':
        return t('dashboard.filter.unlisted')
      case 'PRIVATE':
        return t('dashboard.filter.private')
      default:
        return visibility
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-destructive">{t('common.error')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('dashboard.subtitle')}</p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('dashboard.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Filter */}
            <Select
              value={filterBy}
              onValueChange={(value) => setFilterBy(value as FilterOption)}
            >
              <SelectTrigger className="w-[130px]">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.filter.all')}</SelectItem>
                <SelectItem value="PUBLIC">
                  {t('dashboard.filter.public')}
                </SelectItem>
                <SelectItem value="UNLISTED">
                  {t('dashboard.filter.unlisted')}
                </SelectItem>
                <SelectItem value="PRIVATE">
                  {t('dashboard.filter.private')}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  {t('dashboard.sort.newest')}
                </SelectItem>
                <SelectItem value="oldest">
                  {t('dashboard.sort.oldest')}
                </SelectItem>
                <SelectItem value="title">{t('dashboard.sort.title')}</SelectItem>
                <SelectItem value="titleDesc">
                  {t('dashboard.sort.titleDesc')}
                </SelectItem>
                <SelectItem value="mostViewed">
                  {t('dashboard.sort.mostViewed')}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Create New */}
            <Button onClick={handleCreateNew} disabled={createPresentation.isPending}>
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.createNew')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        {presentations && (
          <div className="mb-4 text-sm text-muted-foreground">
            {searchQuery || filterBy !== 'all'
              ? t('dashboard.stats.showing', {
                  count: filteredPresentations.length,
                  total: presentations.total,
                })
              : t('dashboard.stats.total', { count: presentations.total })}
          </div>
        )}

        {/* Content */}
        {filteredPresentations.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Presentation className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t('dashboard.empty.title')}
            </h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              {t('dashboard.empty.description')}
            </p>
            <Button onClick={handleCreateNew} disabled={createPresentation.isPending}>
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.empty.cta')}
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPresentations.map((presentation) => (
              <Card
                key={presentation.id}
                className="group cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleEdit(presentation.id)}
              >
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 flex items-center gap-1"
                    >
                      {getVisibilityIcon(presentation.visibility)}
                      <span className="text-xs">
                        {getVisibilityLabel(presentation.visibility)}
                      </span>
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold truncate mb-1">
                      {presentation.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('dashboard.card.updated', {
                        time: formatDate(presentation.updated_at),
                      })}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {presentation.view_count}
                      </span>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(presentation.id)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        {t('dashboard.card.edit')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePresent(presentation.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        {t('dashboard.card.present')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDuplicate(presentation.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() =>
                          handleDeleteClick(presentation.id, presentation.title)
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredPresentations.map((presentation) => (
              <Card
                key={presentation.id}
                className="cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => handleEdit(presentation.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">
                        {presentation.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('dashboard.card.updated', {
                          time: formatDate(presentation.updated_at),
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getVisibilityIcon(presentation.visibility)}
                      <span className="text-xs">
                        {getVisibilityLabel(presentation.visibility)}
                      </span>
                    </Badge>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {presentation.view_count}
                    </span>
                    <div
                      className="flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(presentation.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePresent(presentation.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDuplicate(presentation.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() =>
                          handleDeleteClick(presentation.id, presentation.title)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.card.delete')}</DialogTitle>
            <DialogDescription>
              {presentationToDelete &&
                t('dashboard.card.confirmDelete', {
                  title: presentationToDelete.title,
                })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletePresentation.isPending}
            >
              {deletePresentation.isPending
                ? t('common.loading')
                : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

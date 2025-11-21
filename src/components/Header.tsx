import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Home, Menu, Plus, LayoutDashboard, Presentation, LogIn } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebar, useUiActions } from '@/stores'

export default function Header() {
  const { t } = useTranslation()
  const isSidebarOpen = useSidebar()
  const { setSidebarOpen } = useUiActions()

  return (
    <header className="p-4 flex items-center justify-between bg-gray-900 text-white shadow-lg border-b border-gray-800">
      <div className="flex items-center">
        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-gray-900 text-white border-gray-700 p-0">
            <SheetHeader className="p-4 border-b border-gray-700">
              <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Presentation size={24} className="text-blue-400" />
                Easy Slides
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 p-4 overflow-y-auto">
              <Link
                to="/"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2',
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <Home size={20} />
                <span className="font-medium">{t('nav.home')}</span>
              </Link>

              <Link
                to="/editor/new"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2',
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <Plus size={20} />
                <span className="font-medium">{t('nav.newPresentation')}</span>
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2',
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">{t('nav.dashboard')}</span>
              </Link>

              <Link
                to="/auth/login"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2',
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <LogIn size={20} />
                <span className="font-medium">{t('nav.login')}</span>
              </Link>
            </nav>

            <div className="p-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">{t('nav.loginHint')}</p>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="ml-4 text-xl font-bold">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Presentation size={28} className="text-blue-400" />
            <span>Easy Slides</span>
          </Link>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="hidden sm:block">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <LayoutDashboard size={16} className="mr-1" />
            {t('nav.dashboard')}
          </Button>
        </Link>
        <Link to="/editor/new">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-1" />
            {t('nav.newPresentation')}
          </Button>
        </Link>
        <LanguageSelector className="text-gray-800" />
      </div>
    </header>
  )
}

import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Presentation, Mail, Lock, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLogin } from '@/api/services/auth'

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      // Note: The mock API uses username, but we'll use email as username for simplicity
      await loginMutation.mutateAsync({
        username: email,
        password,
      })

      // Redirect to dashboard on success
      navigate({ to: '/dashboard' })
    } catch {
      setError(t('auth.login.error'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Presentation className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">Easy Slides</span>
          </Link>
          <CardTitle className="text-2xl">{t('auth.login.title')}</CardTitle>
          <CardDescription>{t('auth.login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.login.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.login.password')}</Label>
                <Link
                  to="/"
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? t('common.loading')
                : t('auth.login.submit')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {t('auth.login.noAccount')}{' '}
            </span>
            <Link
              to="/auth/register"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              {t('auth.login.signUp')}
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
            <strong>Demo:</strong> Use <code>admin@example.com</code> / <code>admin</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Presentation,
  Share2,
  Monitor,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Zap,
      title: t('pages.home.features.easy.title'),
      description: t('pages.home.features.easy.description'),
    },
    {
      icon: Share2,
      title: t('pages.home.features.share.title'),
      description: t('pages.home.features.share.description'),
    },
    {
      icon: Monitor,
      title: t('pages.home.features.present.title'),
      description: t('pages.home.features.present.description'),
    },
    {
      icon: Globe,
      title: t('pages.home.features.discover.title'),
      description: t('pages.home.features.discover.description'),
    },
    {
      icon: Lock,
      title: t('pages.home.features.privacy.title'),
      description: t('pages.home.features.privacy.description'),
    },
    {
      icon: Presentation,
      title: t('pages.home.features.markdown.title'),
      description: t('pages.home.features.markdown.description'),
    },
  ]

  const steps = [
    {
      title: t('pages.home.howItWorks.step1.title'),
      description: t('pages.home.howItWorks.step1.description'),
    },
    {
      title: t('pages.home.howItWorks.step2.title'),
      description: t('pages.home.howItWorks.step2.description'),
    },
    {
      title: t('pages.home.howItWorks.step3.title'),
      description: t('pages.home.howItWorks.step3.description'),
    },
    {
      title: t('pages.home.howItWorks.step4.title'),
      description: t('pages.home.howItWorks.step4.description'),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600/20 rounded-2xl">
              <Presentation size={64} className="text-blue-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('pages.home.hero.title')}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('pages.home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/editor/new">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                {t('pages.home.hero.cta')}
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Play size={20} className="mr-2" />
              {t('pages.home.hero.demo')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {t('pages.home.features.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg shrink-0">
                      <feature.icon size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {t('pages.home.howItWorks.title')}
          </h2>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-blue-600/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('pages.home.cta.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('pages.home.cta.description')}
          </p>
          <Link to="/editor/new">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              {t('pages.home.cta.button')}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>{t('pages.home.footer.copyright')}</p>
        </div>
      </footer>
    </div>
  )
}

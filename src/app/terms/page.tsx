import { useTranslations } from 'next-intl';
import HeaderNavigation from '@/components/sections/header-navigation';
import Footer from '@/components/sections/footer';

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderNavigation mode="page" />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <p className="text-muted-foreground mb-8">{t('lastUpdated')}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('section1.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section1.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('section2.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('section2.content')}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('section2.item1')}</li>
                <li>{t('section2.item2')}</li>
                <li>{t('section2.item3')}</li>
                <li>{t('section2.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('section3.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t('section3.content')}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('section3.item1')}</li>
                <li>{t('section3.item2')}</li>
                <li>{t('section3.item3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('section4.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section4.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('section5.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section5.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('section6.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section6.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('section7.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section7.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('section8.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section8.content')}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

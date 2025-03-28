'use client';

import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HowToPlay() {
  const { t } = useLanguage();

  return (
    <Layout title={t('howToPlay.title')}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black comic-text text-[var(--borderlands-yellow)] mb-6 transform -rotate-1">
          {t('howToPlay.title')}
        </h1>

        <div className="space-y-8">
          <section className="borderlands-panel bg-surface-800 p-6 transform rotate-1">
            <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)] mb-4">
              {t('howToPlay.basics.title')}
            </h2>
            <p className="mb-4">
              {t('howToPlay.basics.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howToPlay.basics.item1')}</li>
              <li>{t('howToPlay.basics.item2')}</li>
              <li>{t('howToPlay.basics.item3')}</li>
              <li>{t('howToPlay.basics.item4')}</li>
              <li>{t('howToPlay.basics.item5')}</li>
            </ul>
          </section>

          <section className="borderlands-panel bg-surface-800 p-6 transform -rotate-1">
            <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)] mb-4">
              {t('howToPlay.clues.title')}
            </h2>
            <p className="mb-4">
              {t('howToPlay.clues.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howToPlay.clues.item1')}</li>
              <li>{t('howToPlay.clues.item2')}</li>
              <li>{t('howToPlay.clues.item3')}</li>
              <li>{t('howToPlay.clues.item4')}</li>
            </ul>
          </section>

          <section className="borderlands-panel bg-surface-800 p-6 transform rotate-1">
            <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)] mb-4">
              {t('howToPlay.suspects.title')}
            </h2>
            <p className="mb-4">
              {t('howToPlay.suspects.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howToPlay.suspects.item1')}</li>
              <li>{t('howToPlay.suspects.item2')}</li>
              <li>{t('howToPlay.suspects.item3')}</li>
              <li>{t('howToPlay.suspects.item4')}</li>
            </ul>
          </section>

          <section className="borderlands-panel bg-surface-800 p-6 transform -rotate-1">
            <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)] mb-4">
              {t('howToPlay.deduction.title')}
            </h2>
            <p className="mb-4">
              {t('howToPlay.deduction.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howToPlay.deduction.item1')}</li>
              <li>{t('howToPlay.deduction.item2')}</li>
              <li>{t('howToPlay.deduction.item3')}</li>
              <li>{t('howToPlay.deduction.item4')}</li>
            </ul>
          </section>

          <section className="borderlands-panel bg-surface-800 p-6 transform rotate-1">
            <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)] mb-4">
              {t('howToPlay.tips.title')}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howToPlay.tips.item1')}</li>
              <li>{t('howToPlay.tips.item2')}</li>
              <li>{t('howToPlay.tips.item3')}</li>
              <li>{t('howToPlay.tips.item4')}</li>
              <li>{t('howToPlay.tips.item5')}</li>
              <li>{t('howToPlay.tips.item6')}</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
} 
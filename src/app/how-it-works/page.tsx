'use client';

import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaBrain, FaRobot, FaMagnifyingGlass, FaUserTie, FaScaleBalanced } from 'react-icons/fa6';

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <Layout title={t('howItWorks.title')}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black comic-text text-[var(--borderlands-yellow)] mb-6 transform -rotate-1">
          {t('howItWorks.title')}
        </h1>

        <p className="mb-8 text-lg">
          {t('howItWorks.intro')}
        </p>

        <div className="space-y-8">
          <section className="borderlands-panel bg-surface-800 p-6 transform rotate-1">
            <div className="flex items-center mb-4">
              <FaBrain className="text-3xl text-[var(--borderlands-orange)] mr-3" />
              <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)]">
                {t('howItWorks.typhoonLLM.title')}
              </h2>
            </div>
            <p className="mb-4">
              {t('howItWorks.typhoonLLM.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howItWorks.typhoonLLM.item1')}</li>
              <li>{t('howItWorks.typhoonLLM.item2')}</li>
              <li>{t('howItWorks.typhoonLLM.item3')}</li>
              <li>{t('howItWorks.typhoonLLM.item4')}</li>
            </ul>
          </section>

          <section className="borderlands-panel bg-surface-800 p-6 transform -rotate-1">
            <div className="flex items-center mb-4">
              <FaRobot className="text-3xl text-[var(--borderlands-orange)] mr-3" />
              <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)]">
                {t('howItWorks.caseGeneration.title')}
              </h2>
            </div>
            <p className="mb-4">
              {t('howItWorks.caseGeneration.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howItWorks.caseGeneration.item1')}</li>
              <li>{t('howItWorks.caseGeneration.item2')}</li>
              <li>{t('howItWorks.caseGeneration.item3')}</li>
              <li>{t('howItWorks.caseGeneration.item4')}</li>
            </ul>
          </section>

          <section className="borderlands-panel bg-surface-800 p-6 transform rotate-1">
            <div className="flex items-center mb-4">
              <FaMagnifyingGlass className="text-3xl text-[var(--borderlands-orange)] mr-3" />
              <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)]">
                {t('howItWorks.clueAnalysis.title')}
              </h2>
            </div>
            <p className="mb-4">
              {t('howItWorks.clueAnalysis.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howItWorks.clueAnalysis.item1')}</li>
              <li>{t('howItWorks.clueAnalysis.item2')}</li>
              <li>{t('howItWorks.clueAnalysis.item3')}</li>
              <li>{t('howItWorks.clueAnalysis.item4')}</li>
            </ul>
          </section>

          <section className="borderlands-panel bg-surface-800 p-6 transform -rotate-1">
            <div className="flex items-center mb-4">
              <FaUserTie className="text-3xl text-[var(--borderlands-orange)] mr-3" />
              <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)]">
                {t('howItWorks.suspectInterviews.title')}
              </h2>
            </div>
            <p className="mb-4">
              {t('howItWorks.suspectInterviews.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howItWorks.suspectInterviews.item1')}</li>
              <li>{t('howItWorks.suspectInterviews.item2')}</li>
              <li>{t('howItWorks.suspectInterviews.item3')}</li>
              <li>{t('howItWorks.suspectInterviews.item4')}</li>
            </ul>
          </section>

          <section className="borderlands-panel bg-surface-800 p-6 transform rotate-1">
            <div className="flex items-center mb-4">
              <FaScaleBalanced className="text-3xl text-[var(--borderlands-orange)] mr-3" />
              <h2 className="text-2xl font-bold comic-text text-[var(--borderlands-orange)]">
                {t('howItWorks.caseSolving.title')}
              </h2>
            </div>
            <p className="mb-4">
              {t('howItWorks.caseSolving.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howItWorks.caseSolving.item1')}</li>
              <li>{t('howItWorks.caseSolving.item2')}</li>
              <li>{t('howItWorks.caseSolving.item3')}</li>
              <li>{t('howItWorks.caseSolving.item4')}</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
} 
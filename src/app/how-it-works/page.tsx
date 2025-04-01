'use client';

import Layout from '@/components/Layout';
import AIDisclaimer from '@/components/AIDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaBrain, FaRobot, FaMagnifyingGlass, FaUserTie, FaScaleBalanced, FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <Layout title={t('howItWorks.title')}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black comic-text text-[var(--borderlands-yellow)] mb-6 transform -rotate-1">
          {t('howItWorks.title')}
        </h1>

        <p className="mb-4 text-lg">
          {t('howItWorks.intro')}
        </p>

        <p className="mb-8 text-md">
          This game showcases the capabilities of <a href="https://opentyphoon.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--borderlands-yellow)] hover:underline">Typhoon AI</a> in creating interactive, dynamic gaming experiences through state-of-the-art large language models.
        </p>

        <AIDisclaimer className="mb-8" />

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
            <div className="flex justify-between">
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('howItWorks.typhoonLLM.item1')}</li>
                <li>{t('howItWorks.typhoonLLM.item2')}</li>
                <li>{t('howItWorks.typhoonLLM.item3')}</li>
                <li>{t('howItWorks.typhoonLLM.item4')}</li>
              </ul>
              <div className="flex flex-col justify-center items-end">
                <a
                  href="https://opentyphoon.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--borderlands-yellow)] hover:text-[var(--borderlands-orange)] font-bold flex items-center mt-4"
                >
                  Learn More <FaArrowRight className="ml-2" />
                </a>
              </div>
            </div>
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

        <div className="mt-12 p-6 bg-surface-800/80 rounded-lg border border-surface-700">
          <h2 className="text-xl font-bold comic-text text-[var(--borderlands-yellow)] mb-4">
            About Typhoon AI
          </h2>
          <p className="mb-4">
            Typhoon AI offers powerful language models optimized for a wide range of applications. This game demonstrates just one example of how Typhoon's models can create engaging interactive experiences.
          </p>
          <p className="mb-4">
            Models used in this demo:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>typhoon-v2.1-12b-instruct</strong>: Used for clue analysis and suspect interviews</li>
            <li><strong>typhoon-v2-r1-70b-preview</strong>: Used for case generation and complex reasoning</li>
          </ul>
          <div className="text-center">
            <a
              href="https://opentyphoon.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[var(--borderlands-yellow)] text-black font-bold rounded-md hover:bg-[var(--borderlands-orange)] transition-colors"
            >
              Explore Typhoon AI
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/cases/new" className="text-[var(--borderlands-yellow)] hover:text-[var(--borderlands-orange)] font-bold">
            Try Creating a New Case →
          </Link>
        </div>
      </div>
    </Layout>
  );
} 
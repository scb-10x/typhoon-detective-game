'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const { state, dispatch } = useGame();
  const { cases, gameState } = state;
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeCase = gameState.activeCase
    ? cases.find(c => c.id === gameState.activeCase)
    : null;

  const handleResetGame = () => {
    if (showResetConfirm) {
      // Reset the game state
      dispatch({ type: 'RESET_GAME' });
      // Reload the page to trigger loading sample cases
      window.location.reload();
    } else {
      setShowResetConfirm(true);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-8 md:py-16">
        <h1 className="text-5xl md:text-6xl font-black comic-text mb-6 text-center text-[var(--borderlands-yellow)] transform -rotate-1">
          {t('app.title')}
        </h1>
        <p className="text-lg md:text-xl mb-10 text-center font-bold comic-text text-white">
          {t('app.subtitle')}
        </p>

        <div className="max-w-lg w-full">
          {activeCase ? (
            <div className="borderlands-panel flex flex-col gap-6 p-6 bg-surface-800 transform rotate-1">
              <h2 className="text-3xl font-black comic-text text-[var(--borderlands-yellow)]">{activeCase.title}</h2>
              <p className="opacity-80 font-bold">{activeCase.summary}</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/cases/' + activeCase.id)}
                >
                  {t('game.continue')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/cases')}
                >
                  {t('game.new_case')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="borderlands-panel flex flex-col gap-6 p-6 bg-surface-800 transform -rotate-1">
              <h2 className="text-3xl font-black comic-text text-[var(--borderlands-yellow)]">{t('game.start')}</h2>
              <p className="opacity-80 font-bold">
                Start a new investigation and solve a detective case. Use your deduction skills to analyze clues, interview suspects, and solve the mystery.
              </p>
              <Button
                variant="accent"
                size="lg"
                fullWidth
                onClick={() => router.push('/cases')}
              >
                {t('game.start')}
              </Button>
            </div>
          )}

          {/* Reset Game Button */}
          <div className="mt-10 text-center">
            <Button
              variant={showResetConfirm ? "accent" : "outline"}
              size="sm"
              onClick={handleResetGame}
              className={showResetConfirm ? "bg-[var(--borderlands-red)] text-white border-black" : "border-black"}
            >
              {showResetConfirm ? "Confirm Reset Game" : "Reset Game"}
            </Button>
            {showResetConfirm && (
              <p className="text-sm mt-2 text-[var(--borderlands-red)] font-bold comic-text">
                Warning: This will delete all your progress and start over with sample cases.
              </p>
            )}
          </div>
          
          {/* How to Play link */}
          <div className="mt-5 text-center">
            <Link href="/how-to-play" className="text-[var(--borderlands-yellow)] hover:text-[var(--borderlands-orange)] transition-colors font-bold comic-text">
              {t('nav.howToPlay') || 'How to Play'}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

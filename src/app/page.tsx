'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          {t('app.title')}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-center">
          {t('app.subtitle')}
        </p>

        <div className="max-w-lg w-full">
          {activeCase ? (
            <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold">{activeCase.title}</h2>
              <p className="opacity-80">{activeCase.summary}</p>
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
            <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold">{t('game.start')}</h2>
              <p className="opacity-80">
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
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetGame}
              className={showResetConfirm ? "bg-red-500 text-white hover:bg-red-600 border-red-500" : ""}
            >
              {showResetConfirm ? "Confirm Reset Game" : "Reset Game"}
            </Button>
            {showResetConfirm && (
              <p className="text-sm mt-2 text-red-500">
                Warning: This will delete all your progress and start over with sample cases.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

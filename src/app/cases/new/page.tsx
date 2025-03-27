'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { generateCase } from '@/lib/caseGenerator';
import { CaseGenerationParams } from '@/types/game';

export default function NewCasePage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { dispatch } = useGame();

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(0);

    // Case generation parameters
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [theme, setTheme] = useState('');
    const [location, setLocation] = useState('');
    const [era, setEra] = useState('');

    const handleGenerateCase = async () => {
        setIsGenerating(true);
        setError(null);
        setAttempts((prev) => prev + 1);

        try {
            console.log("Starting case generation process...");
            // Prepare generation parameters
            const params: CaseGenerationParams = {
                difficulty,
                language,
                ...(theme && { theme }),
                ...(location && { location }),
                ...(era && { era }),
            };

            // Generate case using the Typhoon LLM
            const generatedCase = await generateCase(params);
            console.log("Successfully generated case:", generatedCase.case.title);

            // Add case, clues, and suspects to the game state
            dispatch({ type: 'ADD_CASE', payload: generatedCase.case });

            if (generatedCase.clues && generatedCase.clues.length > 0) {
                dispatch({ type: 'ADD_CLUES', payload: generatedCase.clues });
            }

            if (generatedCase.suspects && generatedCase.suspects.length > 0) {
                dispatch({ type: 'ADD_SUSPECTS', payload: generatedCase.suspects });
            }

            // Set the case as active
            dispatch({ type: 'SET_ACTIVE_CASE', payload: generatedCase.case.id });

            // Navigate to the new case page
            router.push(`/cases/${generatedCase.case.id}`);
        } catch (err) {
            console.error('Error generating case:', err);

            // Extract error message
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.log("Error details:", errorMessage);

            // Check if it's an API key issue
            if (errorMessage.includes('API key') || errorMessage.includes('Authentication')) {
                setError(language === 'en'
                    ? 'API authentication error. Please check your API key configuration.'
                    : 'ข้อผิดพลาดในการยืนยันตัวตน API โปรดตรวจสอบการตั้งค่าคีย์ API ของคุณ');
            } else if (attempts >= 2) {
                // After 2 failed attempts, suggest using sample cases
                setError(language === 'en'
                    ? 'Multiple generation attempts failed. Try using the sample cases instead by resetting the game on the home page.'
                    : 'การสร้างคดีล้มเหลวหลายครั้ง ลองใช้คดีตัวอย่างแทนโดยรีเซ็ตเกมที่หน้าแรก');
            } else {
                setError(language === 'en'
                    ? `Failed to generate case: ${errorMessage.slice(0, 100)}... Please try again.`
                    : 'การสร้างคดีล้มเหลว โปรดลองอีกครั้ง');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Layout title={t('game.new_case')}>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">{t('game.new_case')}</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Case Parameters</h2>

                    {/* Difficulty selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Difficulty
                        </label>
                        <div className="flex space-x-4">
                            {['easy', 'medium', 'hard'].map((d) => (
                                <button
                                    key={d}
                                    className={`px-4 py-2 rounded-md border ${difficulty === d
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-transparent border-gray-300 dark:border-gray-600'
                                        }`}
                                    onClick={() => setDifficulty(d as 'easy' | 'medium' | 'hard')}
                                    disabled={isGenerating}
                                >
                                    {d.charAt(0).toUpperCase() + d.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Optional parameters */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Theme (optional)
                            </label>
                            <input
                                type="text"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                placeholder="e.g., Murder mystery, Heist, Corporate crime"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                                disabled={isGenerating}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Location (optional)
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., London, Tokyo, a small village"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                                disabled={isGenerating}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Era (optional)
                            </label>
                            <input
                                type="text"
                                value={era}
                                onChange={(e) => setEra(e.target.value)}
                                placeholder="e.g., Victorian, 1920s, Modern day"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                                disabled={isGenerating}
                            />
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md">
                            {error}

                            {error.includes('API authentication') && (
                                <div className="mt-2 text-sm">
                                    Make sure you have set the TYPHOON_API_KEY in your server environment variables.
                                </div>
                            )}

                            {error.includes('sample cases') && (
                                <div className="mt-2">
                                    <Button
                                        variant="accent"
                                        size="sm"
                                        onClick={() => {
                                            router.push('/');
                                        }}
                                    >
                                        Return to Home Page
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="accent"
                            size="lg"
                            fullWidth
                            isLoading={isGenerating}
                            onClick={handleGenerateCase}
                            isDisabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Case'}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            fullWidth
                            onClick={() => router.back()}
                            isDisabled={isGenerating}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Note</h3>
                    <p className="text-sm opacity-80">
                        Case generation uses an AI model to create a unique detective case. The quality and complexity will vary based on the parameters you provide. Generation may take up to 30 seconds.
                    </p>
                    <p className="text-sm mt-2 opacity-80">
                        If you encounter issues with case generation, you can always use the sample cases by resetting the game on the home page.
                    </p>
                </div>
            </div>
        </Layout>
    );
} 
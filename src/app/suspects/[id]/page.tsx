'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaComments, FaCheck } from 'react-icons/fa6';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTyphoon } from '@/hooks/useTyphoon';
import { TyphoonMessage } from '@/lib/typhoon';
import { SuspectAnalysis } from '@/types/game';

interface SuspectPageProps {
    params: {
        id: string;
    };
}

export default function SuspectPage({ params }: SuspectPageProps) {
    const router = useRouter();
    const { state, dispatch } = useGame();
    const { t } = useLanguage();
    const { suspects, clues, gameState } = state;
    const { sendMessage, loading: isAnalyzing } = useTyphoon();

    // Use React.use to unwrap the params promise, ensuring future compatibility
    const id = React.use(Promise.resolve(params.id));

    const [analysis, setAnalysis] = useState<SuspectAnalysis | null>(null);
    const [isInterviewing, setIsInterviewing] = useState(false);

    // Find the suspect by ID
    const suspect = suspects.find(s => s.id === id);

    // Get related case and case clues
    const relatedCase = state.cases.find(c => suspect?.caseId === c.id);
    const caseClues = clues.filter(c => c.caseId === suspect?.caseId);

    // Check if suspect exists and is interviewed
    const isInterviewed = gameState.interviewedSuspects.includes(id);

    // Handle suspect not found
    if (!suspect) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">{t('suspect.not_found')}</h1>
                    <p className="mb-6">{t('suspect.does_not_exist')}</p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/suspects')}
                    >
                        {t('nav.back_to_suspects')}
                    </Button>
                </div>
            </Layout>
        );
    }

    // Interview the suspect
    const handleInterviewSuspect = async () => {
        // If already interviewed, just show previous analysis
        if (isInterviewed && analysis) {
            return;
        }

        setIsInterviewing(true);

        try {
            // Mark as interviewed if not already
            if (!isInterviewed) {
                dispatch({
                    type: 'INTERVIEW_SUSPECT',
                    payload: id
                });
            }

            // Get discovered clues for this case
            const discoveredClues = caseClues.filter(c =>
                gameState.discoveredClues.includes(c.id)
            );

            // Get suspect analysis
            const { content } = await sendMessage([
                {
                    role: 'user',
                    content: `In this detective game, analyze this suspect:
Name: ${suspect.name}
Description: ${suspect.description}
Background: ${suspect.background}
Motive: ${suspect.motive}
Alibi: ${suspect.alibi}

The player has discovered these clues:
${discoveredClues.map(c => `${c.title}: ${c.description} (Location: ${c.location}, Type: ${c.type})`).join('\n')}

Provide me an analysis JSON with:
1. An assessment of trustworthiness (0-100)
2. Any inconsistencies in the suspect's statements
3. Connections to discovered clues with connectionType and description
4. Suggested questions for further investigation

Format:
{
  "suspectId": "${suspect.id}",
  "trustworthiness": 65,
  "inconsistencies": ["inconsistency 1", "inconsistency 2"],
  "connections": [
    {
      "clueId": "clue-id",
      "connectionType": "strong/moderate/weak",
      "description": "how this suspect connects to the clue"
    }
  ],
  "suggestedQuestions": ["question 1", "question 2"]
}`
                }
            ]);

            // Extract JSON analysis
            const jsonStart = content.indexOf('{');
            const jsonEnd = content.lastIndexOf('}') + 1;
            if (jsonStart >= 0 && jsonEnd > jsonStart) {
                const jsonStr = content.slice(jsonStart, jsonEnd);
                const analysisData = JSON.parse(jsonStr) as SuspectAnalysis;

                // Fix clue IDs if necessary (match titles to IDs)
                analysisData.connections = analysisData.connections.map(conn => {
                    // If clueId isn't a valid ID, try to match by title
                    if (!caseClues.some(c => c.id === conn.clueId)) {
                        const matchedClue = caseClues.find(c =>
                            conn.clueId.includes(c.title) || c.title.includes(conn.clueId)
                        );
                        if (matchedClue) {
                            return { ...conn, clueId: matchedClue.id };
                        }
                    }
                    return conn;
                });

                setAnalysis(analysisData);
            } else {
                console.error('Could not extract JSON from response');
            }
        } catch (error) {
            console.error('Error analyzing suspect:', error);
        } finally {
            setIsInterviewing(false);
        }
    };

    // Render clue title from ID
    const getClueTitle = (clueId: string) => {
        return clues.find(c => c.id === clueId)?.title || 'Unknown Clue';
    };

    return (
        <Layout>
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.push(`/cases/${suspect.caseId}`)}
                        className="mr-4 p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{suspect.name}</h1>
                        {relatedCase && (
                            <p className="text-surface-600 dark:text-surface-400">
                                {t('suspect.from_case')}: {relatedCase.title}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main suspect panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                {suspect.imageUrl && (
                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mr-4">
                                        <img
                                            src={suspect.imageUrl}
                                            alt={suspect.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {!isInterviewed && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleInterviewSuspect}
                                        isLoading={isInterviewing || isAnalyzing}
                                    >
                                        <FaComments className="mr-2" />
                                        {t('suspect.interview')}
                                    </Button>
                                )}

                                {isInterviewed && !analysis && (
                                    <div className="inline-flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                                        <FaCheck />
                                        <span>{t('suspect.interviewed')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">{t('suspect.description')}</h2>
                                    <p className="text-surface-700 dark:text-surface-300">{suspect.description}</p>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold mb-2">{t('suspect.background')}</h2>
                                    <p className="text-surface-700 dark:text-surface-300">{suspect.background}</p>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold mb-2">{t('suspect.motive')}</h2>
                                    <p className="text-surface-700 dark:text-surface-300">{suspect.motive}</p>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold mb-2">{t('suspect.alibi')}</h2>
                                    <p className="text-surface-700 dark:text-surface-300">{suspect.alibi}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis panel */}
                    <div className="space-y-6">
                        {isInterviewed && !analysis && (
                            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaComments className="mr-2 text-primary-500" />
                                    {t('suspect.analyze_again')}
                                </h2>
                                <p className="mb-4">{t('suspect.analyze_description')}</p>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={handleInterviewSuspect}
                                    isLoading={isInterviewing || isAnalyzing}
                                >
                                    <FaComments className="mr-2" />
                                    {t('suspect.analyze')}
                                </Button>
                            </div>
                        )}

                        {analysis && (
                            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">{t('suspect.analysis')}</h2>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-lg mb-2">{t('suspect.trustworthiness')}</h3>
                                    <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-4">
                                        <div
                                            className={`h-4 rounded-full ${analysis.trustworthiness > 66
                                                    ? 'bg-green-500'
                                                    : analysis.trustworthiness > 33
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                                }`}
                                            style={{ width: `${analysis.trustworthiness}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-1 text-sm text-right">
                                        {analysis.trustworthiness}/100
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-lg mb-2">{t('suspect.inconsistencies')}</h3>
                                    {analysis.inconsistencies.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-1 text-surface-700 dark:text-surface-300">
                                            {analysis.inconsistencies.map((inconsistency, index) => (
                                                <li key={index}>{inconsistency}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-surface-500 dark:text-surface-400 text-sm italic">
                                            {t('suspect.no_inconsistencies')}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-lg mb-2">{t('suspect.connections')}</h3>
                                    <div className="space-y-3">
                                        {analysis.connections.map((connection, index) => (
                                            <div
                                                key={index}
                                                className="border border-surface-200 dark:border-surface-700 rounded-lg p-3"
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-medium">
                                                        {getClueTitle(connection.clueId)}
                                                    </span>
                                                    <span className={`text-sm px-2 py-0.5 rounded ${connection.connectionType === 'strong'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            : connection.connectionType === 'moderate'
                                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        }`}>
                                                        {t(`suspect.connection.${connection.connectionType}`)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-surface-700 dark:text-surface-300">
                                                    {connection.description}
                                                </p>
                                            </div>
                                        ))}

                                        {analysis.connections.length === 0 && (
                                            <p className="text-surface-500 dark:text-surface-400 text-sm italic">
                                                {t('suspect.no_connections')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t('suspect.suggested_questions')}</h3>
                                    <ul className="list-disc list-inside space-y-1 text-surface-700 dark:text-surface-300">
                                        {analysis.suggestedQuestions.map((question, index) => (
                                            <li key={index}>{question}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">{t('suspect.actions')}</h2>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => router.push(`/cases/${suspect.caseId}`)}
                                >
                                    {t('suspect.back_to_case')}
                                </Button>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => router.push('/suspects')}
                                >
                                    {t('suspect.view_all_suspects')}
                                </Button>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => router.push(`/cases/${suspect.caseId}/solve`)}
                                >
                                    {t('suspect.solve_case')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 
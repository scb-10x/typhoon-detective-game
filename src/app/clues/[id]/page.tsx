'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { analyzeClue } from '@/lib/clueAnalyzer';
import { ClueAnalysis } from '@/types/game';
import { FiArrowLeft, FiFileText, FiUser } from 'react-icons/fi';

interface CluePageProps {
    params: {
        id: string;
    };
}

export default function CluePage({ params }: CluePageProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const { cases, clues, suspects, dispatch } = useGame();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ClueAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Use id directly from params - Next.js still supports this while migrating
    const clueId = params.id;

    // Find the clue by ID
    const clue = clues.find(c => c.id === clueId);

    // Get related case and suspects
    const caseData = clue ? cases.find(c => c.id === clue.caseId) : null;
    const relatedSuspects = clue?.relatedSuspectIds?.map(id =>
        suspects.find(s => s.id === id)
    ).filter(Boolean) || [];

    // Check if clue has been examined
    const isExamined = clue?.examined || false;

    // Mark clue as examined when first viewed
    useEffect(() => {
        if (clue && !isExamined) {
            dispatch({
                type: 'EXAMINE_CLUE',
                payload: { id: clue.id }
            });
        }
    }, [clue, dispatch, isExamined]);

    // Handle clue not found
    if (!clue || !caseData) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">{t('clue.not_found')}</h1>
                    <p className="mb-6">{t('clue.does_not_exist')}</p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/cases')}
                    >
                        {t('nav.back_to_cases')}
                    </Button>
                </div>
            </Layout>
        );
    }

    const handleAnalyzeClue = async () => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await analyzeClue(clue);
            setAnalysisResult(result);
        } catch (err) {
            setError(t('clue.analysis_failed'));
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleViewSuspect = (suspectId: string) => {
        router.push(`/suspects/${suspectId}`);
    };

    return (
        <Layout>
            <div className="mb-6">
                <Button
                    onClick={() => router.push(`/cases/${clue.caseId}`)}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <FiArrowLeft size={16} />
                    {t('nav.back')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main clue info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold mb-4">{clue.name}</h1>

                        {clue.imageUrl && (
                            <div className="mb-6 relative h-64 w-full">
                                <Image
                                    src={clue.imageUrl}
                                    alt={clue.name}
                                    fill
                                    className="object-contain rounded"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.type')}</div>
                                <div className="font-medium">{clue.type}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.condition')}</div>
                                <div className="font-medium">{clue.condition}</div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.description')}</div>
                            <div className="font-medium">{clue.description}</div>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.location')}</div>
                            <div className="font-medium">{clue.location}</div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.keywords')}</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {clue.keywords.map((keyword, index) => (
                                    <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-md text-sm">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">{t('clue.analysis')}</h2>

                        {error && (
                            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        {!analysisResult ? (
                            <Button
                                onClick={handleAnalyzeClue}
                                isLoading={isAnalyzing}
                                className="w-full"
                            >
                                {t('clue.analyze')}
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.significance')}</div>
                                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-md text-indigo-700 dark:text-indigo-200">
                                        {analysisResult.significance}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.possibleConnections')}</div>
                                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-md text-indigo-700 dark:text-indigo-200">
                                        {analysisResult.possibleConnections}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.questions')}</div>
                                    <ul className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-md text-indigo-700 dark:text-indigo-200 list-disc pl-5">
                                        {analysisResult.questionsToConsider.map((question, index) => (
                                            <li key={index} className="mb-1">{question}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Case info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">{t('clue.relatedCase')}</h2>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <FiFileText size={20} className="text-gray-400 mr-3" />
                                <span>{caseData.title}</span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/cases/${caseData.id}`)}
                            >
                                {t('case.view')}
                            </Button>
                        </div>
                    </div>

                    {/* Related Suspects */}
                    {relatedSuspects.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold mb-4">{t('clue.relatedSuspects')}</h2>
                            <div className="space-y-3">
                                {relatedSuspects.map(suspect => (
                                    <div key={suspect?.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center">
                                            <FiUser size={20} className="text-gray-400 mr-3" />
                                            <span>{suspect?.name}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => suspect?.id && handleViewSuspect(suspect.id)}
                                        >
                                            {t('suspect.view')}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
} 
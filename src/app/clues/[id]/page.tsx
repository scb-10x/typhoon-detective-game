'use client';

import React, { useEffect, useState, useRef } from 'react';
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
    params: Promise<{
        id: string;
    }>;
}

export default function CluePage({ params }: CluePageProps) {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { state, dispatch } = useGame();
    const { cases, clues, suspects } = state;
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ClueAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [clueId, setClueId] = useState<string>('');
    const examineActionDispatched = useRef(false);

    // Update params.id to use state with async/await approach
    useEffect(() => {
        const fetchClueId = async () => {
            setClueId((await params).id);
        };
        fetchClueId();
    }, [params]);

    // Find the clue by ID
    const clue = clues.find(c => c.id === clueId);

    // Get related case and suspects
    const caseData = clue ? cases.find(c => c.id === clue.caseId) : null;

    // Check if clue has been examined
    const isExamined = clue?.examined || false;

    // Load saved analysis when component mounts
    useEffect(() => {
        if (clueId && state.gameState.clueAnalyses[clueId]) {
            setAnalysisResult(state.gameState.clueAnalyses[clueId]);
        }
    }, [clueId, state.gameState.clueAnalyses]);

    // Mark clue as examined when first viewed
    useEffect(() => {
        if (clue && !isExamined && !examineActionDispatched.current) {
            examineActionDispatched.current = true;
            dispatch({
                type: 'EXAMINE_CLUE',
                payload: clue.id
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
            const discoveredClues = clues.filter(c => state.gameState.discoveredClues.includes(c.id));
            const result = await analyzeClue(
                clue, 
                suspects, 
                caseData!, 
                discoveredClues, 
                language
            );
            setAnalysisResult(result);
            
            // Save the analysis to the global state
            dispatch({
                type: 'SAVE_CLUE_ANALYSIS',
                payload: { clueId: clue.id, analysis: result }
            });
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
                        <h1 className="text-2xl font-bold mb-4">{clue.title}</h1>

                        {clue.imageUrl && (
                            <div className="mb-6 relative h-64 w-full">
                                <Image
                                    src={clue.imageUrl}
                                    alt={clue.title}
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
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.relevance')}</div>
                                <div className="font-medium">{clue.relevance}</div>
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
                                    <div className="bg-indigo-900/30 p-4 rounded-md text-indigo-200 font-medium">
                                        {analysisResult.summary}
                                    </div>
                                </div>

                                {analysisResult.connections.length > 0 && (
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.connections')}</div>
                                        <div className="bg-indigo-900/30 p-4 rounded-md text-indigo-200">
                                            {analysisResult.connections.map((connection, index) => {
                                                const suspect = suspects.find(s => s.id === connection.suspectId);
                                                return (
                                                    <div key={index} className="mb-4 last:mb-0">
                                                        <div className="font-medium mb-1">
                                                            {suspect ? suspect.name : 'Unknown Suspect'} - {connection.connectionType}
                                                        </div>
                                                        <div className="font-medium">{connection.description}</div>
                                                        {suspect && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="mt-1 pl-0"
                                                                onClick={() => handleViewSuspect(suspect.id)}
                                                            >
                                                                <FiUser className="inline mr-1" size={14} />
                                                                <span className="comic-text">{t('suspect.view')}</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('clue.next_steps')}</div>
                                    <ul className="bg-indigo-900/30 p-4 rounded-md text-indigo-200 list-disc pl-5">
                                        {analysisResult.nextSteps.map((step, index) => (
                                            <li key={index} className="mb-1">{step}</li>
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
                        <div className="bg-indigo-900/30 p-4 rounded-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiFileText size={20} className="text-indigo-200 mr-3" />
                                    <span className="text-indigo-200 font-medium">{caseData.title}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/cases/${caseData.id}`)}
                                >
                                    <span className="comic-text">{t('case.view')}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 
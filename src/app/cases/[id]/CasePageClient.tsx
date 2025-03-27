'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck, FaExclamationTriangle, FaSearch, FaUser, FaEye } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import Image from 'next/image';

interface CasePageClientProps {
    id: string;
}

export function CasePageClient({ id }: CasePageClientProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const { state, dispatch } = useGame();
    const { cases, clues, suspects, gameState } = state;

    // Active tab state
    const [activeTab, setActiveTab] = useState<'overview' | 'clues' | 'suspects'>('overview');

    // Find the case by ID
    const caseData = cases.find(c => c.id === id);

    // Get related clues and suspects
    const caseClues = clues.filter(c => c.caseId === id);
    const caseSuspects = suspects.filter(s => s.caseId === id);

    // Set the case as active when the page loads
    useEffect(() => {
        if (caseData && gameState.activeCase !== id) {
            dispatch({ type: 'SET_ACTIVE_CASE', payload: id });
        }
    }, [caseData, dispatch, gameState.activeCase, id]);

    if (!caseData) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">{t('case.not_found')}</h1>
                    <p className="mb-6">{t('case.does_not_exist')}</p>
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

    // Handle clue discovery
    const handleDiscoverClue = (clueId: string) => {
        if (!gameState.discoveredClues.includes(clueId)) {
            dispatch({ type: 'DISCOVER_CLUE', payload: clueId });
        }
    };

    // Handle clue examination
    const handleExamineClue = (clueId: string) => {
        if (!gameState.examinedClues.includes(clueId)) {
            dispatch({ type: 'EXAMINE_CLUE', payload: clueId });
        }
        router.push(`/clues/${clueId}`);
    };

    // Handle suspect interview
    const handleInterviewSuspect = (suspectId: string) => {
        if (!gameState.interviewedSuspects.includes(suspectId)) {
            dispatch({ type: 'INTERVIEW_SUSPECT', payload: suspectId });
        }
        router.push(`/suspects/${suspectId}`);
    };

    // Handle solving the case
    const handleSolveCase = () => {
        if (!caseData.solved) {
            // Check if enough evidence has been gathered
            const discoveredCluesCount = caseClues.filter(c =>
                gameState.discoveredClues.includes(c.id)
            ).length;

            const examinedCluesCount = caseClues.filter(c =>
                gameState.examinedClues.includes(c.id)
            ).length;

            const interviewedSuspectsCount = caseSuspects.filter(s =>
                gameState.interviewedSuspects.includes(s.id)
            ).length;

            // Require at least 70% of clues to be examined and all suspects interviewed
            const hasEnoughEvidence = (examinedCluesCount / caseClues.length) >= 0.7 &&
                interviewedSuspectsCount === caseSuspects.length;

            if (hasEnoughEvidence) {
                router.push(`/cases/${id}/solve`);
            } else {
                alert('You need to gather more evidence before solving the case. Examine more clues and interview all suspects.');
            }
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                {/* Case header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.push('/cases')}
                        className="mr-4 p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{caseData.title}</h1>
                        <div className="flex items-center mt-1">
                            <span className="text-sm text-surface-600 dark:text-surface-400 mr-2">
                                {t('case.difficulty')}:
                            </span>
                            <span className={`text-sm font-medium ${caseData.difficulty === 'easy'
                                ? 'text-green-600 dark:text-green-400'
                                : caseData.difficulty === 'medium'
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                {t(`case.${caseData.difficulty}`)}
                            </span>
                            {caseData.solved && (
                                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <FaCheck className="mr-1" size={10} />
                                    {t('case.solved')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
                    <nav className="flex -mb-px">
                        <button
                            className={`mr-4 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
                                }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            {t('case.overview')}
                        </button>
                        <button
                            className={`mr-4 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'clues'
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
                                }`}
                            onClick={() => setActiveTab('clues')}
                        >
                            {t('nav.clues')}
                        </button>
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'suspects'
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
                                }`}
                            onClick={() => setActiveTab('suspects')}
                        >
                            {t('nav.suspects')}
                        </button>
                    </nav>
                </div>

                {/* Rest of the UI code from the original file */}
                {/* This would include the conditional tab content rendering for overview, clues, and suspects */}
            </div>
        </Layout>
    );
} 
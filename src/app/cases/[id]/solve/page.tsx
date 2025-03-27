'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle, FaMedal } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { useTyphoon } from '@/hooks/useTyphoon';
import { TyphoonMessage } from '@/lib/typhoon';
import { CaseSolution } from '@/types/game';

interface SolveCasePageProps {
    params: {
        id: string;
    };
}

export default function SolveCasePage({ params }: SolveCasePageProps) {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { state, dispatch } = useGame();
    const { cases, clues, suspects, gameState } = state;
    const { sendMessage, loading: isAnalyzing } = useTyphoon();

    const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
    const [selectedClues, setSelectedClues] = useState<string[]>([]);
    const [reasoning, setReasoning] = useState('');
    const [solution, setSolution] = useState<CaseSolution | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use React.use to unwrap the params promise, ensuring future compatibility
    const id = React.use(Promise.resolve(params.id));

    // Find the case by ID
    const caseData = cases.find(c => c.id === id);

    // Get related clues and suspects
    const caseClues = clues.filter(c => c.caseId === id);
    const caseSuspects = suspects.filter(s => s.caseId === id);

    // Filter to only discovered and examined clues
    const discoveredClues = caseClues.filter(c => gameState.discoveredClues.includes(c.id));
    const examinedClues = caseClues.filter(c => gameState.examinedClues.includes(c.id));

    // Get interviewed suspects
    const interviewedSuspects = caseSuspects.filter(s => gameState.interviewedSuspects.includes(s.id));

    // Check if case is already solved
    const isSolved = caseData ? caseData.solved : false;

    // Minimum requirements to submit a solution
    const hasSelectedSuspect = !!selectedSuspect;
    const hasEnoughClues = selectedClues.length >= 2;
    const hasEnoughReasoning = reasoning.length >= 50;
    const canSubmit = hasSelectedSuspect && hasEnoughClues && hasEnoughReasoning;

    // Handle case not found
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

    // Redirect if case is already solved
    useEffect(() => {
        if (isSolved) {
            router.push(`/cases/${id}`);
        }
    }, [isSolved, router, id]);

    // Handle suspect selection
    const handleSelectSuspect = (suspectId: string) => {
        setSelectedSuspect(suspectId === selectedSuspect ? null : suspectId);
    };

    // Handle clue selection
    const handleSelectClue = (clueId: string) => {
        setSelectedClues(prev =>
            prev.includes(clueId)
                ? prev.filter(id => id !== clueId)
                : [...prev, clueId]
        );
    };

    // Handle solving the case
    const handleSolveCase = async () => {
        if (!canSubmit) {
            if (!hasSelectedSuspect) {
                setError(t('solve.select_suspect'));
            } else if (!hasEnoughClues) {
                setError(t('solve.min_evidence'));
            } else if (!hasEnoughReasoning) {
                setError(t('solve.min_reasoning'));
            }
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            // Get the selected suspect and clues
            const suspect = suspects.find(s => s.id === selectedSuspect);
            const selectedEvidence = clues.filter(c => selectedClues.includes(c.id));

            if (!suspect) {
                setError('Selected suspect not found');
                setIsSubmitting(false);
                return;
            }

            // Prepare prompt for Typhoon LLM
            const prompt = language === 'th' ?
                `ในเกมสืบสวน ฉันเลือกจับกุม ${suspect.name} ด้วยหลักฐาน: ${selectedEvidence.map(c => c.title).join(', ')}. เหตุผลของฉัน: ${reasoning}. ผู้ต้องสงสัยนี้มีแรงจูงใจคือ: ${suspect.motive}. สำหรับคดีของ ${caseData.title} ที่เกี่ยวกับ ${caseData.description}. ผู้ต้องสงสัยที่แท้จริงคือ ${caseSuspects.find(s => s.isGuilty)?.name}. วิเคราะห์คำตอบของฉันว่าถูกต้องหรือไม่ และอธิบายว่าทำไม. แสดงผลเป็น JSON ด้วยฟิลด์ "correct" (boolean), "explanation" (string), "feedback" (string), และ "nextSteps" (string)` :
                `In this detective game, I've chosen to arrest ${suspect.name} based on the evidence: ${selectedEvidence.map(c => c.title).join(', ')}. My reasoning: ${reasoning}. This suspect's motive is: ${suspect.motive}. This is for the case of ${caseData.title} about ${caseData.description}. The actual guilty suspect is ${caseSuspects.find(s => s.isGuilty)?.name}. Analyze whether my answer is correct or not and explain why. Return the result as JSON with fields "correct" (boolean), "explanation" (string), "feedback" (string), and "nextSteps" (string)`;

            const messages: TyphoonMessage[] = [
                { role: 'user', content: prompt }
            ];

            const response = await sendMessage(messages);

            let result: CaseSolution;
            try {
                // Parse the JSON response
                const jsonStart = response.content.indexOf('{');
                const jsonEnd = response.content.lastIndexOf('}') + 1;
                const jsonStr = response.content.slice(jsonStart, jsonEnd);
                const parsedResult = JSON.parse(jsonStr);

                // Map the result to match our CaseSolution interface
                result = {
                    solved: parsedResult.correct,
                    culpritId: caseSuspects.find(s => s.isGuilty)?.id || '',
                    reasoning: parsedResult.feedback || '',
                    evidenceIds: selectedClues,
                    narrative: parsedResult.explanation || '',
                    correct: parsedResult.correct,
                    explanation: parsedResult.explanation,
                    feedback: parsedResult.feedback,
                    nextSteps: parsedResult.nextSteps
                };
            } catch (e) {
                // Fallback in case JSON parsing fails
                const guiltySupect = caseSuspects.find(s => s.isGuilty);
                const isCorrect = suspect.id === guiltySupect?.id;

                result = {
                    solved: isCorrect,
                    culpritId: guiltySupect?.id || '',
                    reasoning: isCorrect ?
                        'Your reasoning and evidence led you to the right conclusion.' :
                        'The evidence and reasoning don\'t align with the case facts.',
                    evidenceIds: selectedClues,
                    narrative: isCorrect ?
                        'You correctly identified the guilty suspect.' :
                        'You did not identify the correct suspect.',
                    correct: isCorrect,
                    explanation: isCorrect ?
                        'You correctly identified the guilty suspect.' :
                        'You did not identify the correct suspect.',
                    feedback: isCorrect ?
                        'Your reasoning and evidence led you to the right conclusion.' :
                        'The evidence and reasoning don\'t align with the case facts.',
                    nextSteps: isCorrect ?
                        'Case successfully solved!' :
                        'Re-examine the evidence and try again.'
                };
            }

            setSolution(result);

            // If correct, mark the case as solved
            if (result.correct) {
                dispatch({
                    type: 'SOLVE_CASE',
                    payload: id
                });
            }

        } catch (err) {
            setError('Error analyzing your solution. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.push(`/cases/${id}`)}
                        className="mr-4 p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold">{t('solve.title')}: {caseData.title}</h1>
                </div>

                {/* Solution result modal */}
                {solution && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    {solution.correct ? (
                                        <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-3">
                                            <FaMedal className="text-green-600 dark:text-green-400 text-xl" />
                                        </div>
                                    ) : (
                                        <div className="rounded-full bg-red-100 dark:bg-red-900 p-3 mr-3">
                                            <FaTimes className="text-red-600 dark:text-red-400 text-xl" />
                                        </div>
                                    )}
                                    <h2 className="text-xl font-bold">
                                        {solution.correct ? t('solve.success') : t('solve.failure')}
                                    </h2>
                                </div>
                            </div>

                            <div className="mb-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-1">{t('solve.result')}:</h3>
                                    <p className="text-surface-800 dark:text-surface-200">{solution.explanation}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{t('solve.feedback')}:</h3>
                                    <p className="text-surface-800 dark:text-surface-200">{solution.feedback}</p>
                                </div>
                                {solution.nextSteps && (
                                    <div>
                                        <h3 className="font-semibold mb-1">{t('solve.next_steps')}:</h3>
                                        <p className="text-surface-800 dark:text-surface-200">{solution.nextSteps}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    variant="primary"
                                    onClick={() => router.push(`/cases/${id}`)}
                                >
                                    {t('solve.return_to_case')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6 mb-6">
                    <p className="mb-4 text-surface-700 dark:text-surface-300">
                        {t('solve.instructions')}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                            <div className="flex items-center">
                                <FaExclamationTriangle className="mr-2" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">{t('solve.select_suspect')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {interviewedSuspects.map(suspect => (
                                <div
                                    key={suspect.id}
                                    onClick={() => handleSelectSuspect(suspect.id)}
                                    className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${selectedSuspect === suspect.id
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-700'
                                        : 'border-surface-200 hover:border-primary-300 dark:border-surface-700 dark:hover:border-primary-800'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        {selectedSuspect === suspect.id && (
                                            <FaCheck className="text-primary-600 dark:text-primary-400 mr-2" />
                                        )}
                                        <h3 className="font-medium">{suspect.name}</h3>
                                    </div>
                                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                                        {suspect.description.slice(0, 80)}...
                                    </p>
                                </div>
                            ))}
                        </div>
                        {interviewedSuspects.length === 0 && (
                            <p className="text-surface-500 dark:text-surface-400 text-sm">
                                {t('solve.no_suspects_interviewed')}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">
                            {t('solve.select_evidence')}
                            <span className="text-sm font-normal ml-2 text-surface-500 dark:text-surface-400">
                                {selectedClues.length > 0 ? `(${selectedClues.length} ${t('solve.selected')})` : `(${t('solve.none_selected')})`}
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {examinedClues.map(clue => (
                                <div
                                    key={clue.id}
                                    onClick={() => handleSelectClue(clue.id)}
                                    className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${selectedClues.includes(clue.id)
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-700'
                                        : 'border-surface-200 hover:border-primary-300 dark:border-surface-700 dark:hover:border-primary-800'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        {selectedClues.includes(clue.id) && (
                                            <FaCheck className="text-primary-600 dark:text-primary-400 mr-2" />
                                        )}
                                        <h3 className="font-medium">{clue.title}</h3>
                                    </div>
                                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                                        {clue.description.slice(0, 80)}...
                                    </p>
                                </div>
                            ))}
                        </div>
                        {!hasEnoughClues && (
                            <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
                                {t('solve.min_evidence')}
                            </p>
                        )}
                        {examinedClues.length === 0 && (
                            <p className="text-surface-500 dark:text-surface-400 text-sm">
                                {t('solve.no_evidence_examined')}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">{t('solve.reasoning')}</h2>
                        <textarea
                            value={reasoning}
                            onChange={(e) => setReasoning(e.target.value)}
                            className="w-full p-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 min-h-[150px] resize-y"
                            placeholder={t('solve.reasoning_placeholder')}
                        />
                        {!hasEnoughReasoning && (
                            <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
                                {t('solve.min_reasoning')}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            onClick={handleSolveCase}
                            isDisabled={!canSubmit || isSubmitting || isAnalyzing}
                            isLoading={isSubmitting || isAnalyzing}
                        >
                            {isSubmitting || isAnalyzing ? t('solve.analyzing') : t('solve.submit')}
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 
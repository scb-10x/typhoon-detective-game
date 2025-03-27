'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck, FaMagnifyingGlass, FaLink } from 'react-icons/fa6';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import Image from 'next/image';

interface CluePageProps {
    params: {
        id: string;
    };
}

export default function CluePage({ params }: CluePageProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const { state, dispatch } = useGame();
    const { clues, cases, suspects, gameState } = state;

    // Find the clue by ID
    const clue = clues.find(c => c.id === params.id);

    // Get related case
    const relatedCase = clue ? cases.find(c => c.id === clue.caseId) : null;

    // Get related suspects
    const relatedSuspects = clue
        ? suspects.filter(s =>
            s.caseId === clue.caseId &&
            clue.relatedSuspects?.includes(s.id)
        )
        : [];

    // Set the clue as examined when the page loads
    useEffect(() => {
        if (clue && !gameState.examinedClues.includes(clue.id)) {
            dispatch({ type: 'EXAMINE_CLUE', payload: clue.id });
        }
    }, [clue, dispatch, gameState.examinedClues]);

    // Handle clipboard operations safely
    const copyToClipboard = async (text: string) => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                alert(t('common.copied_to_clipboard'));
            } else {
                // Fallback method
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();

                try {
                    document.execCommand('copy');
                    alert(t('common.copied_to_clipboard'));
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                }

                document.body.removeChild(textarea);
            }
        } catch (err) {
            console.error('Copy failed:', err);
            alert(t('common.clipboard_not_supported'));
        }
    };

    if (!clue) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4 text-high-contrast">{t('clue.not_found')}</h1>
                    <p className="mb-6 text-medium-contrast">{t('clue.does_not_exist')}</p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/clues')}
                    >
                        {t('nav.back_to_clues')}
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8">
                {/* Clue header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 p-2 rounded-full hover:bg-surface-700"
                        aria-label={t('nav.back')}
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-high-contrast">{clue.title}</h1>
                        <div className="flex items-center mt-1">
                            {relatedCase && (
                                <button
                                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                                    onClick={() => router.push(`/cases/${relatedCase.id}`)}
                                >
                                    {relatedCase.title}
                                </button>
                            )}
                            <span className="inline-flex items-center ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                                <FaCheck className="mr-1" size={10} />
                                {t('clue.examined')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Clue image */}
                        {clue.imageUrl && (
                            <div className="relative h-80 w-full rounded-lg overflow-hidden">
                                <Image
                                    src={clue.imageUrl}
                                    alt={clue.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Clue description */}
                        <div className="card-dark p-6">
                            <h2 className="text-xl font-semibold mb-4 text-high-contrast">{t('clue.description')}</h2>
                            <p className="whitespace-pre-wrap text-medium-contrast">
                                {clue.description}
                            </p>
                        </div>

                        {/* Analysis */}
                        <div className="card-dark p-6">
                            <h2 className="text-xl font-semibold mb-4 text-high-contrast">{t('clue.analysis')}</h2>
                            <div className="bg-surface-800 p-4 rounded-lg mb-4">
                                <div className="flex items-center mb-2">
                                    <FaMagnifyingGlass className="text-primary-400 mr-2" />
                                    <h3 className="font-medium text-high-contrast">{t('clue.analysis_results')}</h3>
                                </div>
                                <p className="whitespace-pre-wrap text-medium-contrast">
                                    {clue.analysis || t('clue.no_analysis')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Clue details */}
                        <div className="card-dark p-6">
                            <h2 className="text-xl font-semibold mb-4 text-high-contrast">{t('clue.details')}</h2>

                            <div className="mb-4">
                                <h3 className="text-sm text-medium-contrast mb-1">
                                    {t('clue.type')}
                                </h3>
                                <p className="font-medium text-high-contrast">{t(`clue.type.${clue.type}`)}</p>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm text-medium-contrast mb-1">
                                    {t('clue.location')}
                                </h3>
                                <p className="font-medium text-high-contrast">{clue.location}</p>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm text-medium-contrast mb-1">
                                    {t('clue.discovered_on')}
                                </h3>
                                <p className="font-medium text-high-contrast">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Related suspects */}
                        {relatedSuspects.length > 0 && (
                            <div className="card-dark p-6">
                                <h2 className="text-xl font-semibold mb-4 text-high-contrast">{t('clue.related_suspects')}</h2>

                                <div className="space-y-4">
                                    {relatedSuspects.map(suspect => (
                                        <div
                                            key={suspect.id}
                                            className="flex items-center p-3 bg-surface-800 rounded-lg hover:bg-surface-700 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/suspects/${suspect.id}`)}
                                        >
                                            {suspect.imageUrl && (
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                                                    <Image
                                                        src={suspect.imageUrl}
                                                        alt={suspect.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-medium text-high-contrast">{suspect.name}</h3>
                                                <p className="text-sm text-medium-contrast">{t('suspect.connection')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="card-dark p-6">
                            <h2 className="text-xl font-semibold mb-4 text-high-contrast">{t('nav.quickactions')}</h2>

                            <div className="space-y-4">
                                {relatedCase && (
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        className="justify-start"
                                        onClick={() => router.push(`/cases/${relatedCase.id}`)}
                                    >
                                        <FaArrowLeft className="mr-2" /> {t('nav.back_to_case')}
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    fullWidth
                                    className="justify-start"
                                    onClick={() => copyToClipboard(`${t('clue.title')}: ${clue.title}\n${t('clue.description')}: ${clue.description}`)}
                                >
                                    <FaLink className="mr-2" /> {t('clue.copy_details')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 
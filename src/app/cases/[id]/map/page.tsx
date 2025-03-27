'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';

interface ScenePageProps {
    params: {
        id: string;
    };
}

export default function ScenePage({ params }: ScenePageProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const { state, dispatch } = useGame();
    const { cases: allCases, clues: allClues } = state;

    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
    const [discoveredClue, setDiscoveredClue] = useState<string | null>(null);

    // Find the case by ID
    const caseData = allCases.find((c: any) => c.id === params.id);

    // Get clues for this case that can be discovered
    const caseClues = allClues.filter((c: any) =>
        c.caseId === params.id &&
        !state.gameState.discoveredClues.includes(c.id)
    );

    // Select a random undiscovered clue for the player to find
    useEffect(() => {
        if (caseClues.length > 0 && !discoveredClue) {
            const randomIndex = Math.floor(Math.random() * caseClues.length);
            setDiscoveredClue(caseClues[randomIndex].id);
        }
    }, [caseClues, discoveredClue]);

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

    // Hotspots in the crime scene
    const hotspots = [
        { id: 'desk', name: t('scene.desk'), x: 25, y: 30 },
        { id: 'window', name: t('scene.window'), x: 75, y: 20 },
        { id: 'floor', name: t('scene.floor'), x: 50, y: 70 },
        { id: 'bookshelf', name: t('scene.bookshelf'), x: 85, y: 50 },
        { id: 'table', name: t('scene.table'), x: 35, y: 55 }
    ];

    // Handle discovering a clue
    const handleDiscoverClue = (clueId: string) => {
        dispatch({
            type: 'DISCOVER_CLUE',
            payload: clueId
        });

        // After discovery, redirect to clue examination
        router.push(`/clues/${clueId}`);
    };

    return (
        <Layout>
            <div className="mb-6">
                <Button
                    onClick={() => router.push(`/cases/${params.id}`)}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <FiArrowLeft size={16} />
                    {t('nav.back')}
                </Button>
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">{t('scene.investigate')} {caseData.title}</h1>
                <p className="text-surface-600 dark:text-surface-300 mb-4">
                    {t('scene.instructions')}
                </p>
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6 mb-6">
                <div className="relative w-full h-[400px] md:h-[500px] bg-surface-200 dark:bg-surface-700 rounded-lg overflow-hidden">
                    {/* Scene background - using a gradient as placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 to-accent-100/40 dark:from-primary-900/40 dark:to-accent-900/40">
                        {caseData.imageUrl && (
                            <Image
                                src={caseData.imageUrl}
                                alt={caseData.title}
                                fill
                                className="object-cover opacity-70"
                            />
                        )}
                    </div>

                    {/* Hotspots */}
                    {hotspots.map(hotspot => (
                        <button
                            key={hotspot.id}
                            className={`absolute w-10 h-10 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all 
                                ${activeHotspot === hotspot.id ?
                                    'bg-accent-500 text-white scale-125 shadow-lg' :
                                    'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 shadow hover:scale-110'}`}
                            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                            onClick={() => setActiveHotspot(hotspot.id)}
                        >
                            <FaSearch className={activeHotspot === hotspot.id ? 'text-white' : 'text-accent-500'} />
                        </button>
                    ))}
                </div>

                {/* Hotspot details */}
                {activeHotspot && (
                    <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{hotspots.find(h => h.id === activeHotspot)?.name}</h3>

                        {/* If this hotspot has the clue to discover */}
                        {discoveredClue &&
                            ((activeHotspot === 'desk' && ['clue-001-3', 'clue-003-2'].includes(discoveredClue)) ||
                                (activeHotspot === 'floor' && ['clue-001-2', 'clue-002-1'].includes(discoveredClue)) ||
                                (activeHotspot === 'window' && ['clue-002-2'].includes(discoveredClue)) ||
                                (activeHotspot === 'bookshelf' && ['clue-003-1'].includes(discoveredClue)) ||
                                (activeHotspot === 'table' && ['clue-001-1', 'clue-003-3'].includes(discoveredClue))) ? (
                            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md text-green-800 dark:text-green-200">
                                <div className="flex items-center mb-2">
                                    <FiCheck className="text-green-600 dark:text-green-400 mr-2" />
                                    <span className="font-semibold">{t('scene.found_clue')}</span>
                                </div>
                                <p className="mb-4">{t('scene.clue_description')}</p>
                                <Button
                                    variant="accent"
                                    onClick={() => handleDiscoverClue(discoveredClue)}
                                    className="flex items-center gap-2"
                                >
                                    <FiCheck size={16} />
                                    {t('game.collect_clue')}
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-surface-600 dark:text-surface-300 mb-4">
                                    {t('scene.nothing_found')}
                                </p>
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveHotspot(null)}
                                    >
                                        {t('scene.continue_search')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaSearch, FaMagnifyingGlass } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import Image from 'next/image';

interface ScenePageProps {
    params: {
        id: string;
    };
}

// Fix the linter error by declaring a proper interface for translation function
interface TranslateFunction {
    (key: string): string;
    (key: string, params: Record<string, string>): string;
}

export default function ScenePage({ params }: ScenePageProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const { state, dispatch } = useGame();
    const { cases, clues, gameState } = state;

    // Get case data
    const caseData = cases.find(c => c.id === params.id);

    // Get undiscovered clues for this case
    const undiscoveredClues = clues.filter(
        clue => clue.caseId === params.id && !gameState.discoveredClues.includes(clue.id)
    );

    // Set the case as active when the page loads
    useEffect(() => {
        if (caseData && gameState.activeCase !== params.id) {
            dispatch({ type: 'SET_ACTIVE_CASE', payload: params.id });
        }
    }, [caseData, dispatch, gameState.activeCase, params.id]);

    const [hoveredArea, setHoveredArea] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<'magnify' | 'inspect' | null>(null);

    // Search locations where clues can be found
    const searchLocations = [
        { id: 'desk', name: t('scene.locations.desk'), x: 20, y: 30, width: 15, height: 10 },
        { id: 'window', name: t('scene.locations.window'), x: 70, y: 25, width: 15, height: 25 },
        { id: 'bookshelf', name: t('scene.locations.bookshelf'), x: 40, y: 15, width: 20, height: 30 },
        { id: 'floor', name: t('scene.locations.floor'), x: 30, y: 70, width: 40, height: 20 },
        { id: 'cabinet', name: t('scene.locations.cabinet'), x: 75, y: 60, width: 15, height: 15 },
    ];

    // Find a clue
    const handleFindClue = (locationId: string) => {
        // Check if there's an undiscovered clue at this location
        const clueAtLocation = undiscoveredClues.find(
            clue => clue.location.toLowerCase() === locationId.toLowerCase()
        );

        if (clueAtLocation) {
            dispatch({ type: 'DISCOVER_CLUE', payload: clueAtLocation.id });
            // Use proper type-safe translation
            alert(`${t('scene.found_clue')}: ${clueAtLocation.title}`);
        } else {
            alert(t('scene.nothing_found'));
        }
    };

    if (!caseData) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4 text-high-contrast">{t('case.not_found')}</h1>
                    <p className="mb-6 text-medium-contrast">{t('case.does_not_exist')}</p>
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

    return (
        <Layout>
            <div className="mb-8">
                {/* Scene header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.push(`/cases/${params.id}`)}
                        className="mr-4 p-2 rounded-full hover:bg-surface-700"
                        aria-label={t('nav.back_to_case')}
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-high-contrast">{t('scene.investigate')}</h1>
                        <p className="text-medium-contrast">{caseData.title}</p>
                    </div>
                </div>

                {/* Scene tools */}
                <div className="flex mb-6 space-x-4">
                    <Button
                        variant={activeTool === 'magnify' ? 'primary' : 'outline'}
                        onClick={() => setActiveTool('magnify')}
                    >
                        <FaMagnifyingGlass className="mr-2" />
                        {t('scene.tools.magnify')}
                    </Button>
                    <Button
                        variant={activeTool === 'inspect' ? 'primary' : 'outline'}
                        onClick={() => setActiveTool('inspect')}
                    >
                        <FaSearch className="mr-2" />
                        {t('scene.tools.inspect')}
                    </Button>
                </div>

                {/* Scene view - replace with your actual scene graphic */}
                <div className="card-dark relative mb-6 rounded-lg overflow-hidden">
                    <div className="bg-surface-800 min-h-[400px] md:min-h-[600px] relative">
                        {caseData.imageUrl ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={caseData.imageUrl}
                                    alt={t('scene.crime_scene')}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-medium-contrast">{t('scene.image_not_available')}</p>
                            </div>
                        )}

                        {/* Interactive areas - would be positioned over the image */}
                        {searchLocations.map((location) => (
                            <div
                                key={location.id}
                                className={`absolute cursor-pointer transition-all duration-300 ${hoveredArea === location.id
                                    ? 'bg-primary-500/30 border border-primary-400'
                                    : activeTool ? 'bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20' : 'hidden'
                                    }`}
                                style={{
                                    left: `${location.x}%`,
                                    top: `${location.y}%`,
                                    width: `${location.width}%`,
                                    height: `${location.height}%`,
                                }}
                                onMouseEnter={() => setHoveredArea(location.id)}
                                onMouseLeave={() => setHoveredArea(null)}
                                onClick={() => activeTool && handleFindClue(location.id)}
                            >
                                {hoveredArea === location.id && (
                                    <div className="absolute bottom-2 left-2 bg-surface-900 px-2 py-1 rounded text-sm">
                                        {location.name}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructions */}
                <div className="card-dark p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-high-contrast">{t('scene.instructions')}</h2>
                    <p className="text-medium-contrast mb-4">
                        {t('scene.instructions_text')}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-medium-contrast">
                        <li>{t('scene.instruction_1')}</li>
                        <li>{t('scene.instruction_2')}</li>
                        <li>{t('scene.instruction_3')}</li>
                    </ul>
                </div>

                {/* Found clues */}
                <div className="card-dark p-6">
                    <h2 className="text-xl font-semibold mb-4 text-high-contrast">{t('scene.found_clues')}</h2>

                    {gameState.discoveredClues.filter(id =>
                        clues.find(c => c.id === id)?.caseId === params.id
                    ).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clues
                                .filter(clue =>
                                    clue.caseId === params.id &&
                                    gameState.discoveredClues.includes(clue.id)
                                )
                                .map(clue => (
                                    <Card
                                        key={clue.id}
                                        title={clue.title}
                                        description={clue.description.length > 100
                                            ? clue.description.slice(0, 100) + '...'
                                            : clue.description}
                                        image={clue.imageUrl}
                                        highlighted={gameState.examinedClues.includes(clue.id)}
                                        discovered={true}
                                        onClick={() => {
                                            if (!gameState.examinedClues.includes(clue.id)) {
                                                dispatch({ type: 'EXAMINE_CLUE', payload: clue.id });
                                            }
                                            router.push(`/clues/${clue.id}`);
                                        }}
                                    />
                                ))}
                        </div>
                    ) : (
                        <p className="text-medium-contrast">{t('scene.no_clues_found')}</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}
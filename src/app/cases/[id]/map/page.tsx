'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';
interface ScenePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ScenePage({ params }: ScenePageProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const { state, dispatch } = useGame();
    const { cases: allCases, clues: allClues } = state;

    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
    const [discoveredClue, setDiscoveredClue] = useState<string | null>(null);
    const [caseId, setCaseId] = useState<string>('');
    const clueSelectionComplete = useRef(false);

    // Update params.id to use state with async/await approach
    useEffect(() => {
        const fetchCaseId = async () => {
            setCaseId((await params).id);
        };
        fetchCaseId();
    }, [params]);

    // Find the case by ID
    const caseData = allCases.find((c: any) => c.id === caseId);

    // Get clues for this case that can be discovered
    const caseClues = allClues.filter((c: any) =>
        c.caseId === caseId &&
        !state.gameState.discoveredClues.includes(c.id)
    );

    // Map of which objects appear in which locations and their associated clues
    const objectLocations = {
        'desk': [
            { name: 'Staff Schedule', clueId: 'clue-001-3', x: 25, y: 32, icon: '📋' },
            { name: 'Manuscript Pages', clueId: 'clue-003-2', x: 28, y: 28, icon: '📄' }
        ],
        'floor': [
            { name: 'Glass Cutter Tool', clueId: 'clue-001-2', x: 48, y: 72, icon: '🔧' },
            { name: 'Modified Water Tank', clueId: 'clue-002-1', x: 52, y: 68, icon: '💧' }
        ],
        'window': [
            { name: 'Threatening Letter', clueId: 'clue-002-2', x: 73, y: 22, icon: '✉️' }
        ],
        'bookshelf': [
            { name: 'Poison Bottle', clueId: 'clue-003-1', x: 83, y: 48, icon: '🧪' }
        ],
        'table': [
            { name: 'Security Footage Gap', clueId: 'clue-001-1', x: 33, y: 56, icon: '📹' },
            { name: 'Tea Cup Residue', clueId: 'clue-003-3', x: 37, y: 54, icon: '🍵' }
        ]
    };

    // Select a random undiscovered clue for the player to find
    useEffect(() => {
        if (caseClues.length > 0 && !discoveredClue && !clueSelectionComplete.current) {
            clueSelectionComplete.current = true;
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
        // Dispatch action to mark clue as discovered
        dispatch({
            type: 'DISCOVER_CLUE',
            payload: clueId
        });

        // Also mark it as examined so it counts toward solving the case progress
        dispatch({
            type: 'EXAMINE_CLUE',
            payload: clueId
        });

        // After discovery, redirect to clue examination
        router.push(`/clues/${clueId}`);
    };

    return (
        <Layout>
            <div className="mb-6">
                <Button
                    onClick={() => router.push(`/cases/${caseId}`)}
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
                <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-md border-l-4 border-yellow-500">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        <strong>Detective Tip:</strong> First click on areas of interest (desk, bookshelf, etc.), then look for objects within those areas that could be evidence. Some areas may contain clues that can help solve the case.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6 mb-6">
                <div className="relative w-full h-[400px] md:h-[500px] bg-surface-200 dark:bg-surface-700 rounded-lg overflow-hidden borderlands-panel">
                    {/* Scene map with grid overlay */}
                    <div className="absolute inset-0 bg-grid">
                        {/* Replace conditional image with dedicated map/scene */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/70 to-accent-900/70">
                            {/* Room outline */}
                            <div className="absolute inset-10 border-2 border-white/30"></div>

                            {/* Floor pattern */}
                            <div className="absolute inset-10 bg-surface-800/50">
                                <Image
                                    src="/floor.png"
                                    alt="Floor pattern"
                                    fill
                                    className="object-cover opacity-30"
                                />
                            </div>

                            {/* Windows */}
                            <div className="absolute top-10 right-10 w-1/4 h-8 border-2 border-white/60 bg-blue-900/30"></div>

                            {/* Furniture */}
                            {/* Desk */}
                            <div className="absolute" style={{ left: '25%', top: '30%', width: '15%', height: '10%', transform: 'translate(-50%, -50%)' }}>
                                <div className="absolute inset-0 bg-yellow-800/60 border border-white/50"></div>
                                <div className="absolute inset-y-0 left-1/2 right-0 bg-yellow-900/60 border-l border-white/50"></div>
                            </div>

                            {/* Table */}
                            <div className="absolute rounded-full bg-amber-800/60 border border-white/50"
                                style={{ left: '35%', top: '55%', width: '12%', height: '8%', transform: 'translate(-50%, -50%)' }}>
                            </div>

                            {/* Bookshelf */}
                            <div className="absolute" style={{ left: '85%', top: '50%', width: '8%', height: '20%', transform: 'translate(-50%, -50%)' }}>
                                <div className="absolute inset-0 bg-indigo-900/60 border border-white/50"></div>
                                <div className="absolute top-1/4 inset-x-0 border-t border-white/30"></div>
                                <div className="absolute top-2/4 inset-x-0 border-t border-white/30"></div>
                                <div className="absolute top-3/4 inset-x-0 border-t border-white/30"></div>
                            </div>

                            {/* Floor marking */}
                            <div className="absolute" style={{ left: '50%', top: '70%', width: '15%', height: '10%', transform: 'translate(-50%, -50%)' }}>
                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                                    <path d="M 10,10 L 90,10 L 90,90 L 10,90 Z" stroke="white" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                </svg>
                            </div>

                            {/* Decorative crime scene elements */}
                            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                                <pattern id="crimescene" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="rotate(45)">
                                    <text x="10" y="40" className="text-white fill-current" style={{ font: '14px serif' }}>CRIME SCENE</text>
                                    <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" strokeOpacity="0.3" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#crimescene)" />
                            </svg>

                            {/* Crime scene tape borders */}
                            <div className="absolute top-0 left-0 right-0 h-8 bg-yellow-400 flex items-center justify-center transform -rotate-2 border-y-2 border-black">
                                <div className="text-black font-black text-xs tracking-wider whitespace-nowrap overflow-hidden">
                                    CRIME SCENE DO NOT CROSS CRIME SCENE DO NOT CROSS CRIME SCENE DO NOT CROSS
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-yellow-400 flex items-center justify-center transform rotate-2 border-y-2 border-black">
                                <div className="text-black font-black text-xs tracking-wider whitespace-nowrap overflow-hidden">
                                    CRIME SCENE DO NOT CROSS CRIME SCENE DO NOT CROSS CRIME SCENE DO NOT CROSS
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Name Overlays */}
                    {hotspots.map(hotspot => (
                        <div
                            key={`label-${hotspot.id}`}
                            className="absolute text-xs font-bold bg-black/50 text-white px-2 py-1 rounded transform -translate-x-1/2"
                            style={{
                                left: `${hotspot.x}%`,
                                top: `${hotspot.y + 8}%`,
                                opacity: activeHotspot === hotspot.id ? 1 : 0.7
                            }}
                        >
                            {hotspot.name}
                        </div>
                    ))}

                    {/* Interactive Hotspots */}
                    {hotspots.map(hotspot => (
                        <button
                            key={hotspot.id}
                            className={`absolute w-12 h-12 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all 
                                ${activeHotspot === hotspot.id ?
                                    'bg-[var(--borderlands-orange)] text-white scale-125 shadow-lg border-2 border-black' :
                                    'bg-surface-800/80 text-white border border-[var(--borderlands-yellow)] shadow hover:scale-110'}`}
                            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                            onClick={() => setActiveHotspot(hotspot.id)}
                        >
                            <FaSearch className={`text-lg ${activeHotspot === hotspot.id ? 'animate-pulse' : ''}`} />
                        </button>
                    ))}

                    {/* Interactive Objects in hotspots */}
                    {activeHotspot && objectLocations[activeHotspot]?.map((object) => (
                        <button
                            key={`object-${object.clueId}`}
                            className={`absolute w-12 h-12 flex items-center justify-center rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                                ${discoveredClue === object.clueId ?
                                    'bg-[var(--borderlands-yellow)] text-black scale-125 animate-pulse shadow-[0_0_20px_rgba(255,204,0,0.8)] border-3 border-black z-30' :
                                    'bg-surface-800/70 text-yellow-400 border-2 border-yellow-400/70 shadow-md hover:scale-110 hover:bg-surface-800/90 hover:text-yellow-300 z-20'}`}
                            style={{ left: `${object.x}%`, top: `${object.y}%` }}
                            onClick={() => handleDiscoverClue(object.clueId)}
                            title={`Examine ${object.name}`}
                            aria-label={`Examine ${object.name}`}
                        >
                            <span className="text-2xl">{object.icon}</span>
                        </button>
                    ))}

                    {/* Compass Rose */}
                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-surface-900/70 rounded-full border-2 border-[var(--borderlands-yellow)] flex items-center justify-center">
                        <div className="relative w-12 h-12">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[var(--borderlands-yellow)] font-bold">N</div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white font-bold">S</div>
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white font-bold">W</div>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 text-white font-bold">E</div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="absolute top-4 left-4 bg-surface-900/70 border border-[var(--borderlands-yellow)] p-2 rounded">
                        <div className="text-xs text-white font-bold mb-1">Search Locations:</div>
                        <div className="flex items-center text-xs text-white mb-1">
                            <div className="w-3 h-3 rounded-full bg-[var(--borderlands-orange)] mr-1"></div>
                            <span>Areas of Interest</span>
                        </div>
                        <div className="text-xs text-white font-bold mb-1 mt-2">Evidence:</div>
                        <div className="flex items-center text-xs text-white mb-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                            <span>Discoverable Objects</span>
                        </div>
                        <div className="flex items-center text-xs text-white">
                            <div className="w-3 h-3 rounded-full bg-[var(--borderlands-yellow)] animate-pulse mr-1"></div>
                            <span>Active Clue</span>
                        </div>
                    </div>
                </div>

                {/* Hotspot details */}
                {activeHotspot && (
                    <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{hotspots.find(h => h.id === activeHotspot)?.name}</h3>

                        {/* If this hotspot has the clue to discover */}
                        {discoveredClue &&
                            objectLocations[activeHotspot]?.some(obj => obj.clueId === discoveredClue) ? (
                            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md text-green-800 dark:text-green-200">
                                <div className="flex items-center mb-2">
                                    <FiCheck className="text-green-600 dark:text-green-400 mr-2" />
                                    <span className="font-semibold">{t('scene.found_clue')}</span>
                                </div>
                                <p className="mb-4">{t('scene.clue_description')}</p>
                                <p className="mb-4 italic">Look for
                                    <span className="font-semibold text-accent"> {objectLocations[activeHotspot].find(obj => obj.clueId === discoveredClue)?.name} </span>
                                    in this area.</p>
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
                                    {objectLocations[activeHotspot]?.length > 0 ?
                                        `This area might contain evidence. Look for objects and click on them to investigate.` :
                                        t('scene.nothing_found')
                                    }
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
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck, FaExclamationTriangle, FaSearch, FaUser, FaEye } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import React from 'react';

interface CasePageProps {
    params: {
        id: string;
    };
}

export default function CasePage({ params }: CasePageProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const { state, dispatch } = useGame();
    const { cases, clues, suspects, gameState } = state;

    const [activeTab, setActiveTab] = useState<'overview' | 'clues' | 'suspects'>('overview');

    // Get the case ID without using React.use()
    const caseId = params.id;

    // Find the case by ID
    const caseData = cases.find(c => c.id === caseId);

    // Get related clues and suspects
    const caseClues = clues.filter(c => c.caseId === caseId);
    const caseSuspects = suspects.filter(s => s.caseId === caseId);

    // Set the case as active when the page loads
    useEffect(() => {
        if (caseData && gameState.activeCase !== caseData.id) {
            dispatch({ type: 'SET_ACTIVE_CASE', payload: caseData.id });
        }
    }, [caseData, dispatch, gameState.activeCase]);

    // Handle case not found
    if (!caseData) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">Case Not Found</h1>
                    <p className="mb-6">The case you are looking for does not exist.</p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/cases')}
                    >
                        Back to Cases
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
                router.push(`/cases/${params.id}/solve`);
            } else {
                alert('You need to gather more evidence before solving the case. Examine more clues and interview all suspects.');
            }
        }
    };

    return (
        <Layout title={caseData.title}>
            <div className="mb-8">
                {/* Case header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.push('/cases')}
                            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-bold">{caseData.title}</h1>
                        {caseData.solved && (
                            <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                                Solved
                            </span>
                        )}
                    </div>

                    <Button
                        variant={caseData.solved ? 'outline' : 'accent'}
                        onClick={handleSolveCase}
                        disabled={caseData.solved}
                    >
                        {caseData.solved ? 'Case Solved' : 'Solve Case'}
                    </Button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <nav className="flex space-x-8">
                        {['overview', 'clues', 'suspects'].map((tab) => (
                            <button
                                key={tab}
                                className={`py-4 px-1 text-center border-b-2 font-medium ${activeTab === tab
                                    ? 'border-accent text-accent'
                                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                onClick={() => setActiveTab(tab as any)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Case Summary</h2>
                            <p className="mb-6 whitespace-pre-wrap">{caseData.description}</p>

                            <h3 className="text-lg font-semibold mb-2">Details</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                                <span className="text-gray-600 dark:text-gray-400">Location:</span>
                                <span>{caseData.location}</span>
                                <span className="text-gray-600 dark:text-gray-400">Date/Time:</span>
                                <span>{new Date(caseData.dateTime).toLocaleString()}</span>
                                <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                                <span>{caseData.difficulty}</span>
                            </div>

                            <h3 className="text-lg font-semibold mb-2">Investigation Progress</h3>
                            <div className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm">Overall</span>
                                    <span className="text-sm">{gameState.gameProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-accent h-2 rounded-full"
                                        style={{ width: `${gameState.gameProgress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div className="text-xl font-bold">
                                        {gameState.discoveredClues.filter(id =>
                                            clues.find(c => c.id === id)?.caseId === params.id
                                        ).length} / {caseClues.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Clues Discovered</div>
                                </div>
                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div className="text-xl font-bold">
                                        {gameState.examinedClues.filter(id =>
                                            clues.find(c => c.id === id)?.caseId === params.id
                                        ).length} / {caseClues.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Clues Examined</div>
                                </div>
                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div className="text-xl font-bold">
                                        {gameState.interviewedSuspects.filter(id =>
                                            suspects.find(s => s.id === id)?.caseId === params.id
                                        ).length} / {caseSuspects.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Suspects Interviewed</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>

                            <div className="space-y-4">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    className="justify-start"
                                    onClick={() => setActiveTab('clues')}
                                >
                                    <FaSearch className="mr-2" /> View All Clues
                                </Button>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    className="justify-start"
                                    onClick={() => setActiveTab('suspects')}
                                >
                                    <FaUser className="mr-2" /> View All Suspects
                                </Button>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    className="justify-start"
                                    onClick={() => router.push(`/cases/${params.id}/map`)}
                                >
                                    <FaEye className="mr-2" /> Investigate Scene
                                </Button>
                                <Button
                                    variant={caseData.solved ? 'outline' : 'accent'}
                                    fullWidth
                                    className="justify-start"
                                    onClick={handleSolveCase}
                                    disabled={caseData.solved}
                                >
                                    <FaCheck className="mr-2" /> {caseData.solved ? 'Case Solved' : 'Solve Case'}
                                </Button>
                            </div>

                            {gameState.gameProgress < 50 && (
                                <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <div className="flex items-start">
                                        <FaExclamationTriangle className="text-yellow-700 dark:text-yellow-500 mt-1 mr-2" />
                                        <div>
                                            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Not enough evidence</h3>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                                Continue investigating to gather more clues and interview suspects before attempting to solve the case.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Clues Tab */}
                {activeTab === 'clues' && (
                    <div>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Evidence & Clues</h2>
                            <Button
                                variant="primary"
                                onClick={() => router.push(`/cases/${params.id}/map`)}
                            >
                                Discover New Clues
                            </Button>
                        </div>

                        {caseClues.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {caseClues.map(clue => {
                                    const isDiscovered = gameState.discoveredClues.includes(clue.id);
                                    const isExamined = gameState.examinedClues.includes(clue.id);

                                    return (
                                        <Card
                                            key={clue.id}
                                            title={clue.title}
                                            description={clue.description}
                                            image={clue.imageUrl}
                                            discovered={isDiscovered}
                                            highlighted={isExamined}
                                            onClick={isDiscovered ? () => handleExamineClue(clue.id) : undefined}
                                            footer={
                                                <div className="flex justify-between items-center">
                                                    <span className={`px-2 py-1 rounded text-xs ${isExamined ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                        isDiscovered ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                        }`}>
                                                        {isExamined ? 'Examined' : isDiscovered ? 'Discovered' : 'Undiscovered'}
                                                    </span>
                                                    {isDiscovered && !isExamined && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleExamineClue(clue.id);
                                                            }}
                                                        >
                                                            Examine
                                                        </Button>
                                                    )}
                                                    {!isDiscovered && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDiscoverClue(clue.id);
                                                            }}
                                                        >
                                                            Collect
                                                        </Button>
                                                    )}
                                                </div>
                                            }
                                        >
                                            {isDiscovered && (
                                                <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                                                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                                                    <span>{clue.location}</span>
                                                    <span className="text-gray-500 dark:text-gray-400">Type:</span>
                                                    <span>{clue.type}</span>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">No Clues Found</h3>
                                <p className="opacity-70 mb-6">
                                    Start your investigation to discover clues related to this case.
                                </p>
                                <Button
                                    variant="accent"
                                    onClick={() => router.push(`/cases/${params.id}/map`)}
                                >
                                    Start Investigation
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Suspects Tab */}
                {activeTab === 'suspects' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-6">Suspects</h2>

                        {caseSuspects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {caseSuspects.map(suspect => {
                                    const isInterviewed = gameState.interviewedSuspects.includes(suspect.id);

                                    return (
                                        <Card
                                            key={suspect.id}
                                            title={suspect.name}
                                            description={suspect.description}
                                            image={suspect.imageUrl}
                                            onClick={() => handleInterviewSuspect(suspect.id)}
                                            highlighted={isInterviewed}
                                            footer={
                                                <div className="flex justify-between items-center">
                                                    <span className={`px-2 py-1 rounded text-xs ${isInterviewed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                        }`}>
                                                        {isInterviewed ? 'Interviewed' : 'Not Interviewed'}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleInterviewSuspect(suspect.id);
                                                        }}
                                                    >
                                                        {isInterviewed ? 'Review' : 'Interview'}
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            <div className="text-sm">
                                                <p className="mb-2">
                                                    <span className="font-medium">Background:</span> {suspect.background.substring(0, 100)}...
                                                </p>
                                                {isInterviewed && (
                                                    <>
                                                        <p className="mb-2">
                                                            <span className="font-medium">Motive:</span> {suspect.motive.substring(0, 100)}...
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Alibi:</span> {suspect.alibi.substring(0, 100)}...
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">No Suspects Found</h3>
                                <p className="opacity-70 mb-6">
                                    Continue your investigation to identify suspects in this case.
                                </p>
                                <Button
                                    variant="accent"
                                    onClick={() => router.push(`/cases/${params.id}/map`)}
                                >
                                    Continue Investigation
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
} 
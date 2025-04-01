'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaSearch, FaRobot } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { Case } from '@/types/game';
import Link from 'next/link';

export default function CasesPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const { state } = useGame();
    const { cases } = state;

    const [searchQuery, setSearchQuery] = useState('');

    // Filter cases based on search query
    const filteredCases = cases.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCaseClick = (caseItem: Case) => {
        router.push(`/cases/${caseItem.id}`);
    };

    const handleNewCase = () => {
        router.push('/cases/new');
    };

    return (
        <Layout title={t('nav.cases')}>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{t('nav.cases')}</h1>
                    <Button
                        variant="accent"
                        onClick={handleNewCase}
                        className="flex items-center gap-2"
                    >
                        <FaPlus size={16} />
                        {t('game.new_case')}
                    </Button>
                </div>

                {/* Typhoon AI Info Box */}
                <div className="mb-6 p-4 bg-surface-800 border border-surface-700 rounded-lg">
                    <div className="flex items-start">
                        <FaRobot className="text-[var(--borderlands-yellow)] mt-1 mr-3 flex-shrink-0" size={20} />
                        <div>
                            <h2 className="text-lg font-bold text-[var(--borderlands-yellow)] mb-2">
                                Typhoon AI-Generated Cases
                            </h2>
                            <p className="text-sm mb-2">
                                Each case in this detective game is dynamically generated using Typhoon AI's language models.
                                Get unique storylines, characters, and mysteries each time you create a new case.
                            </p>
                            <div className="flex space-x-4 mt-3">
                                <Link
                                    href="/cases/new"
                                    className="text-sm text-[var(--borderlands-yellow)] hover:text-[var(--borderlands-orange)] font-bold"
                                >
                                    Create New Case →
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="text-sm text-[var(--borderlands-yellow)] hover:text-[var(--borderlands-orange)] font-bold"
                                >
                                    How It Works →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder={`${t('case.search_placeholder')}...`}
                        className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                </div>

                {/* Cases grid */}
                {filteredCases.length > 0 ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Your Cases</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCases.map(caseItem => (
                                <Card
                                    key={caseItem.id}
                                    title={caseItem.title}
                                    description={caseItem.summary}
                                    image={caseItem.imageUrl}
                                    onClick={() => handleCaseClick(caseItem)}
                                    highlighted={state.gameState.activeCase === caseItem.id}
                                    footer={
                                        <div className="flex justify-between items-center">
                                            <span className={`px-2 py-1 rounded text-xs ${caseItem.solved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                }`}>
                                                {caseItem.solved ? t('case.solved') : t('case.unsolved')}
                                            </span>
                                            <span className="text-xs opacity-70">
                                                {caseItem.difficulty === 'easy' ? t('case.easy') :
                                                    caseItem.difficulty === 'medium' ? t('case.medium') :
                                                        t('case.hard')}
                                            </span>
                                        </div>
                                    }
                                >
                                    <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                                        <span className="text-gray-500 dark:text-gray-400">{t('case.location')}:</span>
                                        <span>{caseItem.location}</span>
                                        <span className="text-gray-500 dark:text-gray-400">{t('case.date')}:</span>
                                        <span>{new Date(caseItem.dateTime).toLocaleDateString()}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">{t('case.not_found')}</h3>
                        <p className="opacity-70 mb-6">
                            {searchQuery ? t('case.try_different_search') : t('case.create_first')}
                        </p>
                        <Button
                            variant="accent"
                            onClick={handleNewCase}
                            className="inline-flex items-center gap-2"
                        >
                            <FaPlus size={16} />
                            {t('game.new_case')}
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
} 
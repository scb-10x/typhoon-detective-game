import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useGame } from '@/contexts/GameContext';
import {
    FaHome,
    FaClipboardList,
    FaSearch,
    FaUser,
    FaCog,
    FaSun,
    FaMoon
} from 'react-icons/fa';
import ProgressBar from './ProgressBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const { theme, setTheme } = useTheme();
    const { state, dispatch } = useGame();
    const { gameState } = state;
    const [progress, setProgress] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (gameState.activeCase) {
            setProgress(gameState.gameProgress);
        } else {
            setProgress(0);
        }
    }, [gameState]);

    const navItems = [
        { href: '/', icon: <FaHome className="text-lg" />, label: t('nav.home') },
        { href: '/cases', icon: <FaClipboardList className="text-lg" />, label: t('nav.cases') },
        { href: '/clues', icon: <FaSearch className="text-lg" />, label: t('nav.clues') },
        { href: '/suspects', icon: <FaUser className="text-lg" />, label: t('nav.suspects') },
        { href: '/settings', icon: <FaCog className="text-lg" />, label: t('nav.settings') }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-950 dark:to-surface-900">
            <header
                className={`sticky top-0 z-50 backdrop-blur-md border-b border-surface-200/30 dark:border-surface-800/30 transition-all duration-300 ${isScrolled ? 'bg-white/70 dark:bg-surface-950/70 shadow-md' : 'bg-white/30 dark:bg-surface-950/30'
                    }`}
            >
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            {t('app.title')}
                        </Link>
                        <span className="text-xs text-surface-500 dark:text-surface-400 px-2 py-1 rounded-full border border-surface-200 dark:border-surface-700">
                            {t('app.subtitle')}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex rounded-full bg-surface-100 dark:bg-surface-800 p-1">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1 text-sm rounded-full transition-all ${language === 'en'
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('th')}
                                className={`px-3 py-1 text-sm rounded-full transition-all ${language === 'th'
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                                    }`}
                            >
                                TH
                            </button>
                        </div>

                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all"
                            aria-label={theme === 'dark' ? t('settings.switch_to_light') : t('settings.switch_to_dark')}
                        >
                            {theme === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-400" />}
                        </button>
                    </div>
                </div>

                {gameState.activeCase && (
                    <div className="container mx-auto px-4 pb-2">
                        <div className="flex items-center justify-between">
                            <div className="w-full max-w-3xl mx-auto">
                                <ProgressBar
                                    progress={progress}
                                    showText={true}
                                    showSteps={true}
                                    size="md"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-grow container mx-auto px-4 py-6">
                {children}
            </main>

            <nav className="sticky bottom-0 border-t border-surface-200/30 dark:border-surface-800/30 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md py-2 px-4">
                <div className="container mx-auto flex justify-between items-center max-w-md">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center p-2 rounded-lg transition-all ${pathname === item.href
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-surface-600 dark:text-surface-400 hover:text-primary-500 dark:hover:text-primary-300'
                                }`}
                        >
                            <div className={`mb-1 ${pathname === item.href
                                ? 'scale-110 text-primary-600 dark:text-primary-400'
                                : 'text-surface-500 dark:text-surface-400'
                                }`}>
                                {item.icon}
                            </div>
                            <span className="text-xs font-medium">{item.label}</span>
                            {pathname === item.href && (
                                <div className="h-1 w-6 bg-primary-600 dark:bg-primary-400 rounded-full mt-1"></div>
                            )}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
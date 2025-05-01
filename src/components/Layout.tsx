import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import {
    FaHome,
    FaClipboardList,
    FaCog,
    FaQuestionCircle,
    FaCogs,
    FaGithub,
    FaDiscord,
    FaTwitter
} from 'react-icons/fa';
import { SiHuggingface } from 'react-icons/si';
import ProgressBar from './ProgressBar';

export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const { state } = useGame();
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
        { href: '/how-to-play', icon: <FaQuestionCircle className="text-lg" />, label: t('nav.howToPlay') || 'How to Play' },
        { href: '/how-it-works', icon: <FaCogs className="text-lg" />, label: t('nav.howItWorks') || 'How It Works' },
        // { href: '/clues', icon: <FaSearch className="text-lg" />, label: t('nav.clues') },
        // { href: '/suspects', icon: <FaUser className="text-lg" />, label: t('nav.suspects') },
        { href: '/settings', icon: <FaCog className="text-lg" />, label: t('nav.settings') }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-grid bg-surface-900">
            <header
                className={`sticky top-0 z-50 borderlands-panel transition-all duration-300 ${isScrolled ? 'bg-surface-900 shadow-md' : 'bg-surface-900'}`}
            >
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="text-3xl font-black comic-text text-yellow-300 transform -rotate-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                            {t('app.title')}
                        </Link>
                        <span className="text-xs font-bold borderlands-panel px-2 py-1 bg-surface-800 rotate-2">
                            {t('app.subtitle')}
                        </span>
                        <span className="text-xs font-bold borderlands-panel px-2 py-1 bg-red-600 -rotate-3 animate-pulse">
                            DEMO
                        </span>
                    </div>

                    <div className="flex items-center">
                        <div className="flex borderlands-panel bg-surface-800 p-1">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1 text-sm font-bold transition-all ${language === 'en'
                                    ? 'bg-[var(--borderlands-orange)] text-white'
                                    : 'text-surface-300 hover:bg-surface-700'
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('th')}
                                className={`px-3 py-1 text-sm font-bold transition-all ${language === 'th'
                                    ? 'bg-[var(--borderlands-orange)] text-white'
                                    : 'text-surface-300 hover:bg-surface-700'
                                    }`}
                            >
                                TH
                            </button>
                        </div>
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
                <div className="borderlands-panel p-6">
                    {children}
                </div>
            </main>

            <nav className="sticky bottom-0 borderlands-panel bg-surface-900 py-2 px-4">
                <div className="container mx-auto flex justify-between items-center max-w-md">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center p-2 rounded-lg transition-all ${pathname === item.href
                                ? 'text-[var(--borderlands-yellow)]'
                                : 'text-surface-400 hover:text-[var(--borderlands-orange)]'
                                }`}
                        >
                            <div className={`mb-1 ${pathname === item.href
                                ? 'scale-125 text-[var(--borderlands-yellow)]'
                                : 'text-surface-400'
                                }`}>
                                {item.icon}
                            </div>
                            <span className="text-xs font-bold comic-text">{item.label}</span>
                            {pathname === item.href && (
                                <div className="h-1 w-6 bg-[var(--borderlands-orange)] rounded-full mt-1"></div>
                            )}
                        </Link>
                    ))}
                </div>
            </nav>

            <footer className="bg-surface-950 border-t border-surface-800 py-6 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div>
                            <a
                                href="https://opentyphoon.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-500 hover:text-purple-400 font-medium transition-colors"
                            >
                                #BuiltWithTyphoon
                            </a>
                        </div>

                        <div>
                            <a
                                href="https://opentyphoon.ai/tac"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-surface-300 hover:text-white transition-colors text-sm"
                            >
                                Terms and Conditions
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <a
                                href="https://github.com/scb-10x"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-surface-300 hover:text-white transition-colors"
                                aria-label="GitHub"
                            >
                                <FaGithub className="w-5 h-5" />
                            </a>
                            <a
                                href="https://discord.gg/9F6nrFXyNt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-surface-300 hover:text-white transition-colors"
                                aria-label="Discord"
                            >
                                <FaDiscord className="w-5 h-5" />
                            </a>
                            <a
                                href="https://huggingface.co/scb10x"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-surface-300 hover:text-white transition-colors"
                                aria-label="Hugging Face"
                            >
                                <SiHuggingface className="w-5 h-5" />
                            </a>
                            <a
                                href="https://x.com/opentyphoon"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-surface-300 hover:text-white transition-colors"
                                aria-label="X (Twitter)"
                            >
                                <FaTwitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
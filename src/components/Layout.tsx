import React, { useState, useEffect, useMemo } from 'react';
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

// Define type for navigation items
interface NavItem {
    href: string;
    icon: React.ReactNode;
    label: string;
    isExternal?: boolean;
}

export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const { state } = useGame();
    const { gameState } = state;
    const [progress, setProgress] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showGithubButton, setShowGithubButton] = useState(false);

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

    // Check if current date is after May 8, 2025 17:00:01 UTC
    useEffect(() => {
        const checkDate = () => {
            try {
                const releaseDate = new Date('2025-05-08T17:00:01Z');
                const currentDate = new Date();
                setShowGithubButton(currentDate > releaseDate);
            } catch (error) {
                console.error('Error checking date:', error);
            }
        };

        checkDate();
        // Check periodically in case user keeps the page open
        const interval = setInterval(checkDate, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    // Create nav items with useMemo to prevent unnecessary re-renders
    const navItems = useMemo<NavItem[]>(() => {
        const items: NavItem[] = [
            { href: '/', icon: <FaHome className="text-lg" />, label: t('nav.home') },
            { href: '/cases', icon: <FaClipboardList className="text-lg" />, label: t('nav.cases') },
            { href: '/how-to-play', icon: <FaQuestionCircle className="text-lg" />, label: t('nav.howToPlay') || 'How to Play' },
            { href: '/how-it-works', icon: <FaCogs className="text-lg" />, label: t('nav.howItWorks') || 'How It Works' },
            // { href: '/clues', icon: <FaSearch className="text-lg" />, label: t('nav.clues') },
            // { href: '/suspects', icon: <FaUser className="text-lg" />, label: t('nav.suspects') },
            { href: '/settings', icon: <FaCog className="text-lg" />, label: t('nav.settings') }
        ];

        // Add GitHub source button if it should be shown
        if (showGithubButton) {
            items.push({
                href: 'https://github.com/scb-10x/typhoon-detective-game',
                icon: <FaGithub className="text-lg" />,
                label: 'Source',
                isExternal: true
            });
        }

        return items;
    }, [t, showGithubButton]); // Only recalculate when language (affects t) or showGithubButton changes

    // Create a safe wrapper for the Link component to handle any potential errors
    const SafeLink = ({ item }: { item: NavItem }) => {
        try {
            // For external links (like GitHub)
            if (item.isExternal) {
                return (
                    <a
                        href={item.href}
                        className={`flex flex-col items-center p-2 rounded-lg transition-all text-surface-400 hover:text-[var(--borderlands-orange)]`}
                        data-gtm-id={item.href.includes('github') ? 'nav-github-source' : `nav-link-external`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="mb-1 text-surface-400">
                            {item.icon}
                        </div>
                        <span className="text-xs font-bold comic-text">{item.label}</span>
                    </a>
                );
            }

            // For internal navigation links
            return (
                <Link
                    href={item.href}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all ${pathname === item.href
                        ? 'text-[var(--borderlands-yellow)]'
                        : 'text-surface-400 hover:text-[var(--borderlands-orange)]'
                        }`}
                    data-gtm-id={`nav-${item.href.replace(/\//g, '') || 'home'}`}
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
            );
        } catch (error) {
            console.error('Error rendering navigation link:', error);
            // Fallback rendering in case of error
            return (
                <span className="flex flex-col items-center p-2 text-surface-400">
                    <div className="mb-1">{item.icon}</div>
                    <span className="text-xs font-bold comic-text">{item.label}</span>
                </span>
            );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-grid bg-surface-900">
            <header
                className={`sticky top-0 z-50 borderlands-panel transition-all duration-300 ${isScrolled ? 'bg-surface-900 shadow-md' : 'bg-surface-900'}`}
                data-gtm-id="main-header"
            >
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="text-3xl font-black comic-text text-yellow-300 transform -rotate-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" data-gtm-id="header-logo">
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
                                data-gtm-id="lang-en"
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('th')}
                                className={`px-3 py-1 text-sm font-bold transition-all ${language === 'th'
                                    ? 'bg-[var(--borderlands-orange)] text-white'
                                    : 'text-surface-300 hover:bg-surface-700'
                                    }`}
                                data-gtm-id="lang-th"
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

            <main className="flex-grow container mx-auto px-4 py-6" data-gtm-id="main-content">
                <div className="borderlands-panel p-6">
                    {children}
                </div>
            </main>

            <nav className="sticky bottom-0 borderlands-panel bg-surface-900 py-2 px-4" data-gtm-id="bottom-nav">
                <div className="container mx-auto flex justify-between items-center max-w-md">
                    {navItems.map((item) => (
                        <SafeLink key={item.href} item={item} />
                    ))}
                </div>
            </nav>

            <footer className="bg-surface-950 border-t border-surface-800 py-6 px-4" data-gtm-id="main-footer">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div>
                            <a
                                href="https://opentyphoon.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-500 hover:text-purple-400 font-medium transition-colors"
                                data-gtm-id="footer-typhoon-link"
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
                                data-gtm-id="footer-terms-link"
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
                                data-gtm-id="social-github"
                            >
                                <FaGithub className="w-5 h-5" />
                            </a>
                            <a
                                href="https://discord.gg/9F6nrFXyNt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-surface-300 hover:text-white transition-colors"
                                aria-label="Discord"
                                data-gtm-id="social-discord"
                            >
                                <FaDiscord className="w-5 h-5" />
                            </a>
                            <a
                                href="https://huggingface.co/scb10x"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-surface-300 hover:text-white transition-colors"
                                aria-label="Hugging Face"
                                data-gtm-id="social-huggingface"
                            >
                                <SiHuggingface className="w-5 h-5" />
                            </a>
                            <a
                                href="https://x.com/opentyphoon"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-surface-300 hover:text-white transition-colors"
                                aria-label="X (Twitter)"
                                data-gtm-id="social-twitter"
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
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiFolder, FiSearch, FiUsers, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ProgressBar from './ProgressBar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { t } = useLanguage();
    const { setLanguage, language } = useLanguage();
    const { state } = useGame();
    const { gameState } = state;
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const progressPercentage = Math.round(gameState.gameProgress * 100);
    const router = useRouter();

    // Handle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu on navigation or resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [pathname]);

    const navItems = [
        { label: t('nav.home'), href: '/', icon: <FiHome className="text-lg" /> },
        { label: t('nav.cases'), href: '/cases', icon: <FiFolder className="text-lg" /> },
        { label: t('nav.clues'), href: '/clues', icon: <FiSearch className="text-lg" /> },
        { label: t('nav.suspects'), href: '/suspects', icon: <FiUsers className="text-lg" /> },
        { label: t('nav.settings'), href: '/settings', icon: <FiSettings className="text-lg" /> },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="glass-effect sticky top-0 z-50 backdrop-blur-md border-b border-surface-700/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="bg-gradient-purple text-white p-2 rounded-lg shadow-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" />
                                    <circle cx="12" cy="13" r="3" />
                                </svg>
                            </div>
                            <span className="font-bold text-2xl text-high-contrast">
                                {t('app.title')}
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 text-lg transition-all hover:text-primary-300 font-medium
                    ${pathname === item.href
                                            ? 'text-primary-400 glow-sm'
                                            : 'text-medium-contrast'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Language Switch & Mobile Menu Button */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center space-x-2 bg-surface-800/70 rounded-full p-1 shadow-inner-glow">
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'en'
                                        ? 'bg-primary-700 text-white shadow-sm'
                                        : 'text-surface-400 hover:text-white'
                                        }`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => setLanguage('th')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'th'
                                        ? 'bg-primary-700 text-white shadow-sm'
                                        : 'text-surface-400 hover:text-white'
                                        }`}
                                >
                                    TH
                                </button>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                className="md:hidden text-2xl p-1 rounded-lg hover:bg-surface-800"
                                onClick={toggleMenu}
                            >
                                {isMenuOpen ? <FiX /> : <FiMenu />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden glass-effect border-b border-primary-800/20 shadow-lg">
                    <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 p-2 rounded-lg text-lg transition-all
                  ${pathname === item.href
                                        ? 'bg-primary-900/50 text-primary-300'
                                        : 'text-medium-contrast hover:bg-surface-800/50'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {/* Language switch on mobile */}
                        <div className="flex items-center justify-center gap-2 mt-2 py-2 border-t border-surface-800">
                            <span className="text-low-contrast">{t('language.select')}:</span>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'en'
                                    ? 'bg-primary-700 text-white'
                                    : 'bg-surface-800 text-surface-400 hover:text-white'
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('th')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'th'
                                    ? 'bg-primary-700 text-white'
                                    : 'bg-surface-800 text-surface-400 hover:text-white'
                                    }`}
                            >
                                TH
                            </button>
                        </div>
                    </nav>
                </div>
            )}

            {/* Progress bar */}
            <div className="container mx-auto px-4 md:px-6 py-3">
                <ProgressBar
                    progress={progressPercentage}
                    showText={true}
                    showSteps={false}
                    size="md"
                />
            </div>

            {/* Main content */}
            <main className="flex-1 container mx-auto px-4 md:px-6 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="container-dark border-t border-primary-900/30 mt-auto">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="text-center text-low-contrast text-sm">
                        <p>{t('footer.copyright')}</p>
                        <p className="mt-1">{t('footer.rights')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/Button';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">
                        Error
                    </h1>
                    <h2 className="text-xl font-medium mb-6">
                        {t('app.error')}
                    </h2>
                    <p className="mb-8 text-gray-600 dark:text-gray-300">
                        {error?.message || t('error.page_not_found')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => reset()}
                            className="flex items-center justify-center gap-2"
                        >
                            <FiArrowLeft size={18} />
                            {t('button.try_again')}
                        </Button>

                        <Link href="/">
                            <Button
                                variant="accent"
                                className="flex items-center justify-center gap-2"
                            >
                                <FiHome size={18} />
                                {t('nav.home')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 
'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
    const { language, setLanguage, t } = useLanguage();

    return (
        <Layout title={t('nav.settings')}>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">{t('nav.settings')}</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <div className="space-y-6">
                        {/* Language settings */}
                        <div>
                            <h2 className="text-xl font-semibold mb-3">{t('settings.language')}</h2>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant={language === 'en' ? 'accent' : 'outline'}
                                    size="sm"
                                    onClick={() => setLanguage('en')}
                                >
                                    English
                                </Button>
                                <Button
                                    variant={language === 'th' ? 'accent' : 'outline'}
                                    size="sm"
                                    onClick={() => setLanguage('th')}
                                >
                                    ไทย
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">{t('app.title')}</h3>
                    <p className="text-sm opacity-80">
                        {t('app.subtitle')}
                    </p>
                </div>
            </div>
        </Layout>
    );
} 
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
    showText?: boolean;
    showSteps?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function ProgressBar({
    progress,
    showText = false,
    showSteps = false,
    size = 'md',
    className = ''
}: ProgressBarProps) {
    const { t } = useLanguage();

    // Define size-dependent styles
    const heights = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-3.5',
    };

    // Calculate which steps are active based on progress
    const isDiscoveryActive = progress >= 0;
    const isAnalysisActive = progress >= 25;
    const isInterviewActive = progress >= 50;
    const isSolutionActive = progress >= 75;

    // Progress status text
    const getProgressText = () => {
        if (progress < 10) return t('progress.just_started');
        if (progress < 40) return t('progress.investigating');
        if (progress < 70) return t('progress.making_progress');
        if (progress < 95) return t('progress.almost_there');
        return t('progress.complete');
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Main progress bar */}
            <div className={`w-full rounded-full bg-surface-200 dark:bg-surface-700 ${heights[size]} overflow-hidden shadow-inner`}>
                <motion.div
                    className="rounded-full bg-gradient-to-r from-primary-600 to-accent-600 h-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* Step markers */}
            {showSteps && (
                <div className="mt-3 flex justify-between items-center px-1">
                    {/* Discovery */}
                    <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full mb-1.5 ${isDiscoveryActive
                            ? 'bg-primary-600 ring-2 ring-primary-200 dark:ring-primary-900'
                            : 'bg-surface-300 dark:bg-surface-600'
                            }`} />
                        <span className={`text-xs font-medium text-center ${isDiscoveryActive
                            ? 'text-primary-900 dark:text-primary-300'
                            : 'text-surface-600 dark:text-surface-400'
                            }`}>
                            {t('progress.discovery')}
                        </span>
                    </div>

                    {/* Analysis */}
                    <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full mb-1.5 ${isAnalysisActive
                            ? 'bg-primary-600 ring-2 ring-primary-200 dark:ring-primary-900'
                            : 'bg-surface-300 dark:bg-surface-600'
                            }`} />
                        <span className={`text-xs font-medium text-center ${isAnalysisActive
                            ? 'text-primary-900 dark:text-primary-300'
                            : 'text-surface-600 dark:text-surface-400'
                            }`}>
                            {t('progress.analysis')}
                        </span>
                    </div>

                    {/* Interview */}
                    <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full mb-1.5 ${isInterviewActive
                            ? 'bg-primary-600 ring-2 ring-primary-200 dark:ring-primary-900'
                            : 'bg-surface-300 dark:bg-surface-600'
                            }`} />
                        <span className={`text-xs font-medium text-center ${isInterviewActive
                            ? 'text-primary-900 dark:text-primary-300'
                            : 'text-surface-600 dark:text-surface-400'
                            }`}>
                            {t('progress.interview')}
                        </span>
                    </div>

                    {/* Solution */}
                    <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full mb-1.5 ${isSolutionActive
                            ? 'bg-primary-600 ring-2 ring-primary-200 dark:ring-primary-900'
                            : 'bg-surface-300 dark:bg-surface-600'
                            }`} />
                        <span className={`text-xs font-medium text-center ${isSolutionActive
                            ? 'text-primary-900 dark:text-primary-300'
                            : 'text-surface-600 dark:text-surface-400'
                            }`}>
                            {t('progress.solution')}
                        </span>
                    </div>
                </div>
            )}

            {/* Progress percentage text */}
            {showText && (
                <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
                        {getProgressText()}
                    </span>
                    <span className="text-sm font-bold text-primary-800 dark:text-primary-300">
                        {progress}%
                    </span>
                </div>
            )}
        </div>
    );
} 
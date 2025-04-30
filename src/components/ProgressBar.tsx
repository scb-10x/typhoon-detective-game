import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
    showText?: boolean;
    showSteps?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    gtmId?: string;
}

export default function ProgressBar({
    progress,
    showText = false,
    showSteps = false,
    size = 'md',
    className = '',
    gtmId,
}: ProgressBarProps) {
    const { t } = useLanguage();

    // Define size-dependent styles
    const heights = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };

    // Calculate which steps are active based on progress
    const isDiscoveryActive = progress >= 0;
    const isAnalysisActive = progress >= 25;
    const isInterviewActive = progress >= 50;
    const isSolutionActive = progress >= 75;

    // Progress status text
    const getProgressText = () => {
        console.log(progress);
        if (progress < 10) return t('progress.just_started');
        if (progress < 40) return t('progress.investigating');
        if (progress < 70) return t('progress.making_progress');
        if (progress < 95) return t('progress.almost_there');
        return t('progress.complete');
    };

    return (
        <div className={`relative ${className}`} data-gtm-id={gtmId || "progress-bar"}>
            {/* Step markers */}
            {showSteps && (
                <div className="mt-3 flex justify-between items-center px-1">
                    {/* Discovery */}
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 mb-1.5 transform rotate-12 border-2 border-black ${isDiscoveryActive
                            ? 'bg-[var(--borderlands-yellow)]'
                            : 'bg-surface-600'
                            }`} />
                        <span className={`text-xs font-bold text-center comic-text ${isDiscoveryActive
                            ? 'text-[var(--borderlands-yellow)]'
                            : 'text-surface-400'
                            }`}>
                            {t('progress.discovery')}
                        </span>
                    </div>

                    {/* Analysis */}
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 mb-1.5 transform -rotate-12 border-2 border-black ${isAnalysisActive
                            ? 'bg-[var(--borderlands-orange)]'
                            : 'bg-surface-600'
                            }`} />
                        <span className={`text-xs font-bold text-center comic-text ${isAnalysisActive
                            ? 'text-[var(--borderlands-orange)]'
                            : 'text-surface-400'
                            }`}>
                            {t('progress.analysis')}
                        </span>
                    </div>

                    {/* Interview */}
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 mb-1.5 transform rotate-12 border-2 border-black ${isInterviewActive
                            ? 'bg-[var(--borderlands-orange)]'
                            : 'bg-surface-600'
                            }`} />
                        <span className={`text-xs font-bold text-center comic-text ${isInterviewActive
                            ? 'text-[var(--borderlands-orange)]'
                            : 'text-surface-400'
                            }`}>
                            {t('progress.interview')}
                        </span>
                    </div>

                    {/* Solution */}
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 mb-1.5 transform -rotate-12 border-2 border-black ${isSolutionActive
                            ? 'bg-[var(--borderlands-yellow)]'
                            : 'bg-surface-600'
                            }`} />
                        <span className={`text-xs font-bold text-center comic-text ${isSolutionActive
                            ? 'text-[var(--borderlands-yellow)]'
                            : 'text-surface-400'
                            }`}>
                            {t('progress.solution')}
                        </span>
                    </div>
                </div>
            )}

            {/* Main progress bar */}
            <div className={`w-full bg-surface-800 ${heights[size]} overflow-hidden relative border-2 border-black`} data-gtm-id={gtmId ? `${gtmId}-container` : "progress-bar-container"}>
                <motion.div
                    className="bg-yellow-500 from-yellow-300 to-yellow-500 h-full relative z-999 shadow-[0_0_8px_rgba(255,204,0,0.8)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    data-gtm-id={gtmId ? `${gtmId}-fill` : "progress-bar-fill"}
                />
            </div>

            {/* Progress percentage text */}
            {showText && (
                <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-bold text-surface-200 comic-text">
                        {getProgressText()}
                    </span>
                    <span className="text-sm font-black text-[var(--borderlands-yellow)] comic-text">
                        {progress}%
                    </span>
                </div>
            )}
        </div>
    );
} 
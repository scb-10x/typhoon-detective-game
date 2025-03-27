import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    isDisabled?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export default function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    isDisabled = false,
    fullWidth = false,
    type = 'button',
    className = '',
}: ButtonProps) {
    const { t } = useLanguage();

    // Define base classes
    const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all flex items-center justify-center';

    // Classes based on variant
    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-400',
        secondary: 'bg-surface-200 hover:bg-surface-300 active:bg-surface-400 text-surface-800 focus:ring-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 dark:text-surface-50 dark:focus:ring-surface-500',
        accent: 'bg-accent-600 hover:bg-accent-700 active:bg-accent-800 text-white focus:ring-accent-500 dark:bg-accent-500 dark:hover:bg-accent-600 dark:focus:ring-accent-400',
        outline: 'border border-surface-300 hover:bg-surface-100 text-surface-800 focus:ring-surface-200 dark:border-surface-600 dark:hover:bg-surface-800 dark:text-surface-100 dark:focus:ring-surface-700',
        ghost: 'hover:bg-surface-100 text-surface-800 focus:ring-surface-200 dark:hover:bg-surface-800 dark:text-surface-100 dark:focus:ring-surface-700',
    };

    // Classes based on size
    const sizeClasses = {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-sm px-4 py-2 gap-2',
        lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    // Combine all classes
    const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

    // Disabled state
    const disabledProps = isDisabled ? { disabled: true } : {};

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            {...disabledProps}
            aria-disabled={isDisabled}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    {t('app.loading')}
                </>
            ) : (
                children
            )}
        </button>
    );
} 
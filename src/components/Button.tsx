import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
    const baseClasses = 'font-bold comic-text tracking-wide rounded-lg focus:outline-none transition-all flex items-center justify-center transform skew-x-[-5deg] uppercase';

    // Classes based on variant
    const variantClasses = {
        primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white border-3 border-black box-shadow: inset 0 0 0 1px var(--borderlands-yellow), 0 4px 0 0 black',
        secondary: 'bg-surface-700 hover:bg-surface-600 active:bg-surface-500 text-surface-50 border-3 border-black',
        accent: 'bg-[var(--borderlands-orange)] hover:bg-[var(--borderlands-red)] active:bg-[var(--borderlands-red)] text-white border-3 border-black shadow-[inset_0_0_0_1px_var(--borderlands-yellow),_0_4px_0_0_black] hover:shadow-[inset_0_0_0_1px_var(--borderlands-yellow),_0_6px_0_0_black] hover:-translate-y-1 active:translate-y-1 active:shadow-[inset_0_0_0_1px_var(--borderlands-yellow),_0_2px_0_0_black]',
        outline: 'border-3 border-black hover:bg-surface-800 text-surface-100 shadow-[0_4px_0_0_black] hover:shadow-[0_6px_0_0_black] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_black]',
        ghost: 'hover:bg-surface-800 text-surface-100',
    };

    // Classes based on size
    const sizeClasses = {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-sm px-4 py-2 gap-2',
        lg: 'text-base px-5 py-3 gap-2.5',
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
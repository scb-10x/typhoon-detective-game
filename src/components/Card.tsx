import React from 'react';
import Image from 'next/image';

interface CardProps {
    title: string;
    description?: string;
    image?: string;
    footer?: React.ReactNode;
    onClick?: () => void;
    highlighted?: boolean;
    discovered?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export default function Card({
    title,
    description,
    image,
    footer,
    onClick,
    highlighted = false,
    discovered = false,
    children,
    className = '',
}: CardProps) {
    const baseClasses = 'rounded-lg overflow-hidden transition-all duration-200 h-full flex flex-col';

    const cardClasses = `
        ${baseClasses}
        ${highlighted
            ? 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/30 border border-primary-200 dark:border-primary-700 shadow-md'
            : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:shadow-md dark:hover:shadow-surface-900/50'
        }
        ${onClick ? 'cursor-pointer hover:translate-y-[-2px]' : ''}
        ${discovered ? 'opacity-100' : ''}
        ${!discovered && highlighted ? 'opacity-90 hover:opacity-100' : ''}
        ${className}
    `;

    return (
        <div
            className={cardClasses}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* Card image */}
            {image && (
                <div className="relative w-full h-40 overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                    />

                    {/* Discovery badge */}
                    {!discovered && (
                        <div className="absolute top-2 right-2 bg-surface-800/80 text-white text-xs font-medium px-2 py-1 rounded-full">
                            Undiscovered
                        </div>
                    )}
                </div>
            )}

            {/* Card body */}
            <div className="flex-1 p-4">
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-2">{title}</h3>

                {description && (
                    <p className="text-surface-700 dark:text-surface-300 text-sm">
                        {description}
                    </p>
                )}

                {children && <div className="mt-3">{children}</div>}
            </div>

            {/* Card footer */}
            {footer && (
                <div className="p-4 pt-2 mt-auto border-t border-surface-200 dark:border-surface-700">
                    {footer}
                </div>
            )}

            {/* Highlight indicator */}
            {highlighted && (
                <div className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 w-full"></div>
            )}
        </div>
    );
}
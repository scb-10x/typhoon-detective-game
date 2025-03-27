import React from 'react';
import Image from 'next/image';
import { FaMagnifyingGlass, FaPhotoFilm } from 'react-icons/fa6';

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
    const baseClasses = 'borderlands-panel rounded-lg transition-all duration-200 h-full flex flex-col';

    const cardClasses = `
        ${baseClasses}
        ${highlighted
            ? 'bg-gradient-to-br from-[var(--borderlands-orange)] to-[var(--borderlands-red)] border-[3px] border-black shadow-lg transform-rotate-1'
            : 'bg-surface-800 border-[3px] border-black hover:shadow-lg'
        }
        ${onClick ? 'cursor-pointer hover:translate-y-[-4px] hover:rotate-1' : ''}
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
            {/* Card image with polaroid-style */}
            <div className="relative w-full h-48 bg-surface-900 p-3">
                <div className="absolute inset-0 border-b-[3px] border-black z-10"></div>
                
                {/* Clue image container with styling */}
                <div className="relative w-full h-full bg-gray-100 dark:bg-surface-700 border-4 border-white dark:border-surface-500 shadow-md overflow-hidden">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-800 p-4">
                            <FaPhotoFilm className="text-4xl text-yellow-500 mb-2" />
                            <div className="text-xs text-center text-surface-300 font-medium comic-text">
                                {discovered ? "Evidence Photo" : "Undiscovered Evidence"}
                            </div>
                        </div>
                    )}

                    {/* Film frame overlay */}
                    <div className="absolute inset-0 bg-black opacity-5 pointer-events-none">
                        {/* Film sprocket holes */}
                        <div className="absolute top-0 left-0 right-0 h-4 flex justify-between px-2">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-black opacity-40 rounded-full" />
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-between px-2">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-black opacity-40 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Polaroid date stamp */}
                    <div className="absolute bottom-1 right-2 text-xs text-white bg-black/50 px-1 font-mono">
                        {discovered ? (new Date().toLocaleDateString()) : "??/??/??"}
                    </div>
                    
                    {/* Clue markings for discovered items */}
                    {discovered && (
                        <div className="absolute top-2 left-2 transform -rotate-12">
                            <div className="bg-yellow-600 text-white text-xs px-1 py-0.5 font-bold comic-text whitespace-nowrap">
                                EVIDENCE #{title.slice(-2)} 
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Discovery badge - Moved outside of the clue image container to prevent clipping */}
                {!discovered && (
                    <div className="borderlands-panel absolute top-0 right-0 bg-surface-800 text-white text-xs font-bold px-2 py-1 z-20 rotate-3 comic-text shadow-lg transform translate-x-[4px] translate-y-[-24px]">
                        Undiscovered
                    </div>
                )}
                
                {/* Magnifying glass for highlight effect */}
                {highlighted && (
                    <div className="absolute -bottom-3 -right-3 bg-yellow-500 rounded-full p-2 shadow-lg border-2 border-black z-20">
                        <FaMagnifyingGlass className="text-black text-lg" />
                    </div>
                )}
            </div>

            {/* Card body */}
            <div className="flex-1 p-4">
                <h3 className="text-lg font-bold text-surface-50 mb-2 comic-text">{title}</h3>

                {description && (
                    <p className="text-surface-300 text-sm">
                        {description}
                    </p>
                )}

                {children && <div className="mt-3">{children}</div>}
            </div>

            {/* Card footer */}
            {footer && (
                <div className="p-4 pt-2 mt-auto border-t-[3px] border-black">
                    {footer}
                </div>
            )}

            {/* Highlight indicator */}
            {highlighted && (
                <div className="h-1 bg-gradient-to-r from-[var(--borderlands-yellow)] to-[var(--borderlands-orange)] w-full"></div>
            )}
        </div>
    );
}
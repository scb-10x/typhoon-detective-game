import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
    discovered = true,
    children,
    className = '',
}: CardProps) {
    const cardVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        hover: { y: -5, boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)' },
        tap: { y: 0, scale: 0.98 },
    };

    // Base classes for all cards
    const baseClasses = `
        card-dark relative flex flex-col overflow-hidden
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
    `;

    // Classes for highlighted and discovered states
    const stateClasses = highlighted
        ? 'ring-2 ring-primary-500 glow-sm'
        : discovered
            ? ''
            : 'opacity-80 grayscale';

    return (
        <motion.div
            className={`${baseClasses} ${stateClasses}`}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover={onClick ? "hover" : undefined}
            whileTap={onClick ? "tap" : undefined}
            onClick={onClick}
        >
            {/* Card image if provided */}
            {image && (
                <div className="relative w-full h-48 overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 to-transparent" />
                </div>
            )}

            {/* Card content */}
            <div className={`flex-1 p-5 ${image ? '-mt-8 relative z-10' : ''}`}>
                <h3 className="text-high-contrast text-xl font-semibold mb-2">{title}</h3>

                {description && (
                    <p className="text-medium-contrast text-sm mb-4">{description}</p>
                )}

                {children}
            </div>

            {/* Highlighted indicator */}
            {highlighted && (
                <div className="absolute top-0 right-0">
                    <div className="w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-primary-600">
                        <div className="absolute top-[-38px] right-[-33px] transform rotate-45 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Not discovered overlay */}
            {!discovered && (
                <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="p-4 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 mx-auto mb-2 text-surface-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        <p className="text-surface-300 font-medium">Not yet discovered</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
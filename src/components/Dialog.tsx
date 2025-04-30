import React, { useRef, useEffect } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';
import Button from './Button';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'error';
    className?: string;
    gtmId?: string;
}

export default function Dialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    type = 'warning',
    className = '',
    gtmId,
}: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Handle escape key to close
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            data-gtm-id={gtmId || "dialog-backdrop"}
        >
            <div
                ref={dialogRef}
                className={`relative bg-surface-800 rounded-lg shadow-xl max-w-md w-full mx-auto borderlands-panel p-0 transition-all ${className}`}
                onClick={e => e.stopPropagation()}
                data-gtm-id={gtmId ? `${gtmId}-container` : "dialog-container"}
            >
                {title && (
                    <div className="px-6 py-4 border-b-2 border-surface-700">
                        <h3 className="text-xl font-bold text-surface-50 comic-text">{title}</h3>
                    </div>
                )}

                <div className="p-6">
                    <div className="flex items-start">
                        {type === 'warning' && (
                            <div className="mr-3 text-yellow-400">
                                <FaExclamationTriangle size={24} />
                            </div>
                        )}
                        {type === 'info' && (
                            <div className="mr-3 text-blue-400">
                                <FaInfoCircle size={24} />
                            </div>
                        )}
                        {type === 'error' && (
                            <div className="mr-3 text-red-400">
                                <FaExclamationCircle size={24} />
                            </div>
                        )}
                        <div>
                            <p className="text-surface-200 mb-6">{message}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-end">
                        {onConfirm && (
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                {cancelText}
                            </Button>
                        )}
                        <Button
                            variant="accent"
                            onClick={onConfirm || onClose}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>

                <button
                    className="absolute top-3 right-3 text-surface-400 hover:text-white"
                    onClick={onClose}
                    aria-label="Close dialog"
                    data-gtm-id={gtmId ? `${gtmId}-close` : "dialog-close"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
} 
import React, { useRef, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Button from './Button';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'error';
}

export default function Dialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    type = 'warning'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div 
                ref={dialogRef}
                className="borderlands-panel bg-surface-800 border-[3px] border-black rounded-lg max-w-md w-full mx-4 shadow-lg transform skew-x-[-3deg] rotate-1"
            >
                <div className="p-5">
                    <div className="flex items-start">
                        {type === 'warning' && (
                            <div className="mr-3 text-yellow-400">
                                <FaExclamationTriangle size={24} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-bold comic-text text-white mb-2">{title}</h3>
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
            </div>
        </div>
    );
} 
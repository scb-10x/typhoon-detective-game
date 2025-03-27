import React from 'react';

interface SpinnerProps {
    className?: string;
}

export function Spinner({ className = '' }: SpinnerProps) {
    return (
        <div className="relative inline-block">
            <svg
                className={`animate-spin ${className}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="black"
                    strokeWidth="6"
                ></circle>
                <circle
                    className="opacity-75"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="var(--borderlands-yellow)"
                    strokeWidth="3"
                ></circle>
                <path
                    className="opacity-90"
                    fill="var(--borderlands-orange)"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
            </svg>
        </div>
    );
} 
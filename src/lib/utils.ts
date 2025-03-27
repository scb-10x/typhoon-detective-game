/**
 * Utility function to conditionally join class names
 * 
 * @param classes Array of class names or objects to conditionally include
 * @returns A string of joined class names
 */
export function cn(...classes: (string | undefined | null | false | { [key: string]: boolean })[]): string {
    return classes
        .filter(Boolean)
        .map((entry) => {
            if (typeof entry === 'string') return entry;
            if (!entry) return '';

            return Object.entries(entry)
                .filter(([, value]) => Boolean(value))
                .map(([key]) => key)
                .join(' ');
        })
        .join(' ');
} 
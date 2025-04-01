import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How It Works | Typhoon AI Detective Game',
    description: 'Explore how Typhoon AI powers this interactive detective game with dynamic case generation, intelligent clue analysis, and realistic suspect interviews.',
    keywords: 'Typhoon AI, LLM technology, AI game mechanics, detective game AI, language model gaming, Typhoon capabilities',
    openGraph: {
        title: 'How Typhoon AI Powers This Detective Game',
        description: 'Discover the technology behind our interactive detective game and how Typhoon AI creates dynamic narratives, intelligent clue analysis, and realistic character interactions.',
        images: [
            {
                url: '/og-how-it-works.jpg',
                width: 1200,
                height: 630,
                alt: 'Typhoon AI Detective Game Technology'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'How Typhoon AI Powers This Detective Game',
        description: 'Discover the technology behind our interactive detective game and how Typhoon AI creates dynamic narratives, intelligent clue analysis, and realistic character interactions.',
        images: ['/twitter-how-it-works.jpg']
    }
}; 
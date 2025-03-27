import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
    // Basic config that can be exposed to the client
    const config = {
        apiVersion: '1.0.0',
        features: {
            multiLanguage: true,
            darkMode: true,
            debugMode: process.env.NODE_ENV === 'development'
        },
        models: {
            default: 'typhoon-v2-70b-instruct',
            advanced: 'typhoon-v2-r1-70b-preview'
        },
        maxGenerationLength: 1000
    };

    return NextResponse.json(config);
} 
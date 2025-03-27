import { NextRequest, NextResponse } from 'next/server';
import { fetchTyphoonCompletion, TyphoonMessage, TyphoonModel } from '@/lib/typhoon';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, model = 'typhoon-v2-70b-instruct', temperature = 0.7, max_tokens = 800 } = body;

        if (!messages || !Array.isArray(messages)) {
            console.error('API route error: Invalid messages format', messages);
            return NextResponse.json(
                { error: 'Invalid messages format. Messages should be an array.' },
                { status: 400 }
            );
        }

        // Validate the model type
        if (model !== 'typhoon-v2-70b-instruct' && model !== 'typhoon-v2-r1-70b-preview') {
            console.error('API route error: Invalid model', model);
            return NextResponse.json(
                { error: 'Invalid model. Must be either typhoon-v2-70b-instruct or typhoon-v2-r1-70b-preview.' },
                { status: 400 }
            );
        }

        console.log(`API route processing request for model: ${model}`);

        const response = await fetchTyphoonCompletion(
            messages as TyphoonMessage[],
            model as TyphoonModel,
            temperature,
            max_tokens
        );

        return NextResponse.json({ response });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('API route error:', errorMessage);

        // Check for specific error types
        if (errorMessage.includes('API key for Typhoon is missing')) {
            return NextResponse.json(
                { error: 'Configuration error: API key is missing. Please contact the administrator.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
} 
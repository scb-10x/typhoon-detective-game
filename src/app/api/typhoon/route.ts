import { NextRequest, NextResponse } from 'next/server';

// Configurable values with defaults
const TYPHOON_API_ENDPOINT = process.env.TYPHOON_API_ENDPOINT || 'https://api.opentyphoon.ai/v1/chat/completions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, model = 'typhoon-v2.1-12b-instruct', temperature = 0.7, max_tokens = 800 } = body;

        if (!messages || !Array.isArray(messages)) {
            console.error('API route error: Invalid messages format', messages);
            return NextResponse.json(
                { error: 'Invalid messages format. Messages should be an array.' },
                { status: 400 }
            );
        }

        // Validate the model type
        if (model !== 'typhoon-v2.1-12b-instruct' && model !== 'typhoon-v2-r1-70b-preview') {
            console.error('API route error: Invalid model', model);
            return NextResponse.json(
                { error: 'Invalid model. Must be either typhoon-v2.1-12b-instruct or typhoon-v2-r1-70b-preview.' },
                { status: 400 }
            );
        }

        console.log(`API route processing request for model: ${model}`);

        // Call Typhoon API directly from the server
        const apiKey = process.env.TYPHOON_API_KEY;

        if (!apiKey) {
            console.error('TYPHOON_API_KEY is not defined in environment variables');
            return NextResponse.json(
                { error: 'API key for Typhoon is missing. Please check your server configuration.' },
                { status: 500 }
            );
        }

        // Set up timeout controller
        const controller = new AbortController();

        try {
            const typhoonResponse = await fetch(TYPHOON_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages,
                    temperature,
                    max_tokens,
                }),
                signal: controller.signal
            });
            if (!typhoonResponse.ok) {
                const errorText = await typhoonResponse.text();
                console.error(`Typhoon API error: Status ${typhoonResponse.status}`, errorText);
                return NextResponse.json(
                    { error: `Typhoon API error (${typhoonResponse.status}): ${errorText}` },
                    { status: typhoonResponse.status }
                );
            }

            const data = await typhoonResponse.json();

            if (!data.choices || data.choices.length === 0) {
                console.error('Typhoon API returned no choices:', data);
                return NextResponse.json(
                    { error: 'Received invalid response from Typhoon API' },
                    { status: 500 }
                );
            }

            let content = data.choices[0]?.message?.content || '';

            // Filter out <think> tags for typhoon-v2-r1-70b-preview model
            if (model === 'typhoon-v2-r1-70b-preview') {
                content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
            }

            return NextResponse.json({ response: content });
        } catch (fetchError) {
            if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
                return NextResponse.json(
                    { error: 'Typhoon API request timed out' },
                    { status: 504 }
                );
            }
            throw fetchError;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('API route error:', errorMessage);

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
} 
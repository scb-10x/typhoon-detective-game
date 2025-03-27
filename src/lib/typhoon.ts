export type TyphoonModel = 'typhoon-v2-70b-instruct' | 'typhoon-v2-r1-70b-preview';

export interface TyphoonMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface TyphoonResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export async function fetchTyphoonCompletion(
    messages: TyphoonMessage[],
    model: TyphoonModel = 'typhoon-v2-70b-instruct',
    temperature: number = 0.7,
    max_tokens: number = 800
): Promise<string> {
    const endpoint = 'https://api.opentyphoon.ai/v1/chat/completions';
    // Use process.env.NEXT_PUBLIC_TYPHOON_API_KEY for client-side access
    const apiKey = process.env.TYPHOON_API_KEY || process.env.NEXT_PUBLIC_TYPHOON_API_KEY;

    if (!apiKey) {
        console.error('TYPHOON_API_KEY is not defined in environment variables');
        throw new Error('API key for Typhoon is missing. Please check your environment configuration.');
    }

    try {
        console.log(`Calling Typhoon API with model: ${model}`);

        const response = await fetch(endpoint, {
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
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Typhoon API error: Status ${response.status}`, errorText);
            throw new Error(`Typhoon API error (${response.status}): ${errorText}`);
        }

        const data: TyphoonResponse = await response.json();

        if (!data.choices || data.choices.length === 0) {
            console.error('Typhoon API returned no choices:', data);
            throw new Error('Received invalid response from Typhoon API');
        }

        let content = data.choices[0]?.message?.content || '';

        // Filter out <think> tags for typhoon-v2-r1-70b-preview model
        if (model === 'typhoon-v2-r1-70b-preview') {
            content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
        }

        return content;
    } catch (error) {
        console.error('Error calling Typhoon API:', error);
        throw error;
    }
} 
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
    try {
        console.log(`Calling Typhoon API with model: ${model}`);

        // Get base URL for the API endpoint
        const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : process.env.NEXT_PUBLIC_BASE_URL || '';
            
        const apiUrl = `${baseUrl}/api/typhoon`;

        const controller = new AbortController();
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                model,
                temperature,
                max_tokens,
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Typhoon API error: Status ${response.status}`, errorText);
            throw new Error(`Typhoon API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.response) {
            console.error('Server API returned invalid response:', data);
            throw new Error('Received invalid response from server');
        }

        return data.response;
    } catch (error) {
        console.error('Error calling Typhoon API:', error);
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Request timed out. The server took too long to respond.');
        }
        throw error;
    }
} 
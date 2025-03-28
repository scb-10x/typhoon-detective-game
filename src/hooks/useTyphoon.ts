import { useState } from 'react';
import { TyphoonMessage, TyphoonModel } from '@/lib/typhoon';

interface UseTyphoonOptions {
    onSuccess?: (response: string) => void;
    onError?: (error: Error) => void;
}

export function useTyphoon(options: UseTyphoonOptions = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [response, setResponse] = useState<string | null>(null);

    const sendMessage = async (
        messages: TyphoonMessage[],
        model: TyphoonModel = 'typhoon-v2.1-12b-instruct',
        temperature: number = 0.7,
        max_tokens: number = 800
    ) => {
        setLoading(true);
        setError(null);

        try {
            console.log(`Sending request to Typhoon API with model: ${model}`);

            const result = await fetch('/api/typhoon', {
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
            });

            if (!result.ok) {
                const errorData = await result.json().catch(() => ({ error: `HTTP error ${result.status}` }));
                const errorMessage = errorData.error || `Failed to get response from Typhoon API: ${result.status}`;
                console.error('Typhoon API error:', errorMessage);
                throw new Error(errorMessage);
            }

            const data = await result.json().catch(() => {
                throw new Error('Failed to parse JSON response from API');
            });

            if (!data.response) {
                console.error('Invalid API response format:', data);
                throw new Error('Received invalid response format from API');
            }

            setResponse(data.response);

            if (options.onSuccess) {
                options.onSuccess(data.response);
            }

            return data.response;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error occurred');
            console.error('Error in useTyphoon hook:', error.message);
            setError(error);

            if (options.onError) {
                options.onError(error);
            }

            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        sendMessage,
        loading,
        error,
        response,
    };
} 
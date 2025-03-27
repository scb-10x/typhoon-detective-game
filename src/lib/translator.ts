import { fetchTyphoonCompletion, TyphoonMessage } from './typhoon';

// Language codes
export type Language = 'en' | 'th';

/**
 * Translates text from one language to another using the Typhoon LLM
 */
export async function translateText(
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language
): Promise<string> {
    // Skip translation if languages are the same
    if (sourceLanguage === targetLanguage) {
        return text;
    }

    // Create system prompt
    const systemPrompt = `You are a professional translator who specializes in translating between English and Thai. 
Translate the given text accurately, preserving the meaning, tone, and style of the original text. 
Respond only with the translated text, without any additional comments or explanations.`;

    // Create user prompt
    const userPrompt = `Translate the following ${sourceLanguage === 'en' ? 'English' : 'Thai'} text to ${targetLanguage === 'en' ? 'English' : 'Thai'}:

${text}`;

    // Prepare messages for API call
    const messages: TyphoonMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    // Use the standard model for translation
    try {
        const response = await fetchTyphoonCompletion(
            messages,
            'typhoon-v2-70b-instruct',
            0.7,
            2048
        );

        return response;
    } catch (error) {
        console.error('Translation failed:', error);
        return text; // Return original text if translation fails
    }
}

/**
 * Translates an object's text fields from one language to another
 */
export async function translateObject<T extends Record<string, unknown>>(
    obj: T,
    sourceLanguage: Language,
    targetLanguage: Language,
    textFields: (keyof T)[]
): Promise<T> {
    // Skip translation if languages are the same
    if (sourceLanguage === targetLanguage) {
        return obj;
    }

    // Clone the object to avoid mutating the original
    const translatedObj = { ...obj } as T;

    // Translate each specified field
    for (const field of textFields) {
        if (typeof obj[field] === 'string' && obj[field]) {
            try {
                // Type assertion to make TypeScript happy
                translatedObj[field] = await translateText(
                    obj[field] as string,
                    sourceLanguage,
                    targetLanguage
                ) as unknown as T[typeof field];
            } catch (error) {
                console.error(`Failed to translate field ${String(field)}:`, error);
            }
        }
    }

    return translatedObj;
}

/**
 * Batches translations to reduce API calls
 */
export async function batchTranslate(
    texts: string[],
    sourceLanguage: Language,
    targetLanguage: Language
): Promise<string[]> {
    // Skip translation if languages are the same
    if (sourceLanguage === targetLanguage) {
        return texts;
    }

    // Skip empty arrays
    if (texts.length === 0) {
        return [];
    }

    // Join texts with a special delimiter that's unlikely to appear in the text
    const delimiter = '|||TRANSLATE_DELIMITER|||';
    const combinedText = texts.join(delimiter);

    // Create system prompt
    const systemPrompt = `You are a professional translator who specializes in translating between English and Thai.
Translate the given text accurately, preserving the meaning, tone, and style of the original text.
The input consists of multiple separate text segments joined by the delimiter "${delimiter}".
Respond only with the translated segments joined by the same delimiter, maintaining the exact number of segments.`;

    // Create user prompt
    const userPrompt = `Translate the following ${sourceLanguage === 'en' ? 'English' : 'Thai'} text segments to ${targetLanguage === 'en' ? 'English' : 'Thai'}, keeping each segment separate:

${combinedText}`;

    // Prepare messages for API call
    const messages: TyphoonMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    try {
        // Use the standard model for translation
        const response = await fetchTyphoonCompletion(
            messages,
            'typhoon-v2-70b-instruct',
            0.7,
            2048
        );

        // Split the response back into an array
        const translatedTexts = response.split(delimiter);

        // Ensure we have the same number of translated segments as input segments
        if (translatedTexts.length === texts.length) {
            return translatedTexts;
        } else {
            console.error('Translation returned incorrect number of segments:', translatedTexts.length, 'expected:', texts.length);
            return texts; // Return original texts if translation fails
        }
    } catch (error) {
        console.error('Batch translation failed:', error);
        return texts; // Return original texts if translation fails
    }
} 
import { v4 as uuidv4 } from 'uuid';
import { fetchTyphoonCompletion, TyphoonMessage } from './typhoon';
import { CaseGenerationParams, GeneratedCase, Case, Clue, Suspect } from '@/types/game';

// System prompt templates for case generation
const CASE_GENERATION_PROMPT_EN = `You are a master detective story creator. Create a complete detective case with the following:
1. A detailed case description with a title, summary, location, date, and time.
2. 5-8 clues with descriptions, locations, and relevance.
3. 3-5 suspects with names, descriptions, backgrounds, motives, and alibis.
4. A clear solution identifying which suspect is guilty and why.

The case should be logical, solvable through deduction, and have clear connections between clues and suspects.
Respond in a structured JSON format that can be parsed by JavaScript.`;

const CASE_GENERATION_PROMPT_TH = `คุณเป็นนักเขียนนิยายสืบสวนชั้นเยี่ยม สร้างคดีสืบสวนที่สมบูรณ์โดยมีองค์ประกอบดังนี้:
1. รายละเอียดคดีพร้อมชื่อเรื่อง สรุปย่อ สถานที่ วันที่ และเวลา
2. 5-8 หลักฐานพร้อมคำอธิบาย ตำแหน่งที่พบ และความสำคัญ
3. 3-5 ผู้ต้องสงสัยพร้อมชื่อ คำอธิบาย ประวัติ แรงจูงใจ และข้ออ้างที่อยู่
4. คำตอบที่ชัดเจนว่าผู้ต้องสงสัยคนไหนเป็นผู้กระทำผิดและเพราะอะไร

คดีควรมีเหตุผล สามารถแก้ไขได้ด้วยการอนุมาน และมีความเชื่อมโยงที่ชัดเจนระหว่างหลักฐานและผู้ต้องสงสัย
ตอบในรูปแบบ JSON ที่มีโครงสร้างซึ่งสามารถแปลงโดย JavaScript ได้`;

// Fallback example case in case of API failures
const FALLBACK_CASE = {
    case: {
        title: "The Missing Artifact",
        description: "A valuable artifact has disappeared from the city museum. You need to investigate the clues and interview the suspects to solve the case.",
        summary: "Solve the mysterious theft at the city museum.",
        difficulty: "medium",
        location: "City Museum",
        dateTime: new Date().toISOString()
    },
    clues: [
        {
            title: "Security Footage",
            description: "Security camera was disabled between 1:00 AM and 1:15 AM on the night of the theft.",
            location: "Security Office",
            type: "digital",
            relevance: "critical"
        },
        {
            title: "Footprints",
            description: "Small footprints found near the display case.",
            location: "Exhibition Hall",
            type: "physical",
            relevance: "important"
        },
        {
            title: "Staff Schedule",
            description: "List of staff members who were on duty the night of the theft.",
            location: "Manager's Office",
            type: "document",
            relevance: "important"
        }
    ],
    suspects: [
        {
            name: "Security Guard",
            description: "Night security guard who was on duty",
            background: "Has worked at the museum for 5 years with a clean record",
            motive: "Financial troubles recently",
            alibi: "Claims to have been patrolling the east wing at the time of the theft",
            isGuilty: false
        },
        {
            name: "Curator",
            description: "Museum curator who has extensive knowledge of the artifact",
            background: "Respected expert in the field with publications about the artifact",
            motive: "Recent conflicts with museum management about the artifact's display",
            alibi: "Claims to have been at home sleeping",
            isGuilty: true
        }
    ],
    solution: "The curator took the artifact because they believed it wasn't being properly preserved."
};

/**
 * Generates a detective case using the Typhoon LLM
 */
export async function generateCase(params: CaseGenerationParams): Promise<GeneratedCase> {
    const { difficulty, theme, location, era, language } = params;

    try {
        console.log("Starting case generation with params:", params);

        // Choose appropriate prompt based on language
        const systemPrompt = language === 'th' ? CASE_GENERATION_PROMPT_TH : CASE_GENERATION_PROMPT_EN;

        // Create user prompt with additional parameters
        let userPrompt = language === 'th'
            ? `สร้างคดีสืบสวนที่มีความยาก ${difficulty === 'easy' ? 'ง่าย' : difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}`
            : `Create a ${difficulty} difficulty detective case`;

        if (theme) {
            userPrompt += language === 'th' ? ` ในธีม ${theme}` : ` with a ${theme} theme`;
        }

        if (location) {
            userPrompt += language === 'th' ? ` ที่เกิดขึ้นใน ${location}` : ` set in ${location}`;
        }

        if (era) {
            userPrompt += language === 'th' ? ` ในยุค ${era}` : ` during the ${era} era`;
        }

        // Prepare messages for API call
        const messages: TyphoonMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        // Use the client-side API route instead of direct API call for better error handling
        let response;

        // If running on client-side, use the API route
        if (typeof window !== 'undefined') {
            console.log("Using client-side API route for case generation");
            const result = await fetch('/api/typhoon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages,
                    model: 'typhoon-v2-r1-70b-preview',
                    temperature: 0.7,
                    max_tokens: 4000
                }),
            });

            if (!result.ok) {
                const errorData = await result.json().catch(() => ({ error: `HTTP error ${result.status}` }));
                throw new Error(errorData.error || `Failed to generate case: ${result.status}`);
            }

            const data = await result.json();
            response = data.response;
        } else {
            // If running on server-side, use direct API call
            console.log("Using server-side direct API call for case generation");
            response = await fetchTyphoonCompletion(
                messages,
                'typhoon-v2-r1-70b-preview',
                0.7,
                4096
            );
        }

        console.log("Received response from Typhoon API");

        // Parse the JSON response
        try {
            // Use a fallback technique to extract JSON if direct parsing fails
            const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                response.match(/```([\s\S]*?)```/) ||
                response.match(/({[\s\S]*})/);

            const jsonContent = jsonMatch ? jsonMatch[1] : response;
            console.log("Attempting to parse JSON response");
            const parsedData = JSON.parse(jsonContent);

            // Format the response into our expected structure
            return formatGeneratedCase(parsedData, language);
        } catch (parseError) {
            console.error('Failed to parse case data:', parseError);
            console.log('Raw response:', response);
            throw new Error('Failed to parse the generated case data. Please try again.');
        }
    } catch (error) {
        console.error('Case generation error:', error);

        // Provide a fallback case if generation fails
        if (process.env.NODE_ENV === 'development') {
            console.log("Using fallback case due to error");
            return formatGeneratedCase(FALLBACK_CASE, language);
        }

        throw error;
    }
}

/**
 * Formats the raw LLM output into our application's data structure
 */
function formatGeneratedCase(data: unknown, _language: 'en' | 'th'): GeneratedCase {
    // Extract and format case data
    const caseData: Case = {
        id: uuidv4(),
        title: (data as any)?.case?.title || (data as any)?.case_details?.title || (data as any)?.title || 'Untitled Case',
        description: (data as any)?.case?.description || (data as any)?.case_details?.synopsis || (data as any)?.description || '',
        summary: (data as any)?.case?.summary || (data as any)?.case_details?.synopsis || (data as any)?.summary || '',
        difficulty: (data as any)?.case?.difficulty || 'medium',
        solved: false,
        location: (data as any)?.case?.location || (data as any)?.case_details?.location || (data as any)?.location || '',
        dateTime: (data as any)?.case?.dateTime ||
            ((data as any)?.case_details?.date ?
                new Date(`${(data as any)?.case_details?.date} ${(data as any)?.case_details?.time || '00:00'}`).toISOString() :
                (data as any)?.dateTime || new Date().toISOString()),
        imageUrl: `https://picsum.photos/seed/mystery/800/600`,
        isLLMGenerated: true
    };

    // Extract and format clues (handle both clues and evidence field names)
    const cluesData = (data as any)?.clues || (data as any)?.evidence || [];
    const clues: Clue[] = cluesData.map((clue: unknown) => ({
        id: uuidv4(),
        caseId: caseData.id,
        title: (clue as any)?.title || (clue as any)?.item || 'Untitled Clue',
        description: (clue as any)?.description || '',
        location: (clue as any)?.location || (clue as any)?.position_found || '',
        type: (clue as any)?.type || 'physical',
        discovered: false,
        examined: false,
        relevance: (clue as any)?.relevance || (clue as any)?.significance || 'important'
    }));

    // Extract and format suspects
    const suspects: Suspect[] = ((data as any)?.suspects || []).map((suspect: unknown) => ({
        id: uuidv4(),
        caseId: caseData.id,
        name: (suspect as any)?.name || 'Unknown Suspect',
        description: (suspect as any)?.description || '',
        background: (suspect as any)?.background || '',
        motive: (suspect as any)?.motive || '',
        alibi: (suspect as any)?.alibi || '',
        isGuilty: (suspect as any)?.isGuilty || false,
        interviewed: false
    }));

    // Find the guilty suspect based on the solution
    const solution = (data as any)?.solution?.reasoning || (data as any)?.solution || '';
    const guiltySuspectName = (data as any)?.solution?.culprit || '';

    if (solution && suspects.length > 0) {
        if (guiltySuspectName) {
            // Mark the identified suspect from solution.culprit as guilty
            suspects.forEach(suspect => {
                if (suspect.name.toLowerCase() === guiltySuspectName.toLowerCase()) {
                    suspect.isGuilty = true;
                }
            });
        } else {
            // Try to identify the guilty suspect from the solution text
            const guiltyName = suspects.map(s => s.name).find(name =>
                solution.toLowerCase().includes(name.toLowerCase())
            );

            if (guiltyName) {
                // Mark the identified suspect as guilty
                suspects.forEach(suspect => {
                    if (suspect.name.toLowerCase() === guiltyName.toLowerCase()) {
                        suspect.isGuilty = true;
                    }
                });
            } else {
                // If we can't identify by name, mark the first suspect as guilty
                suspects[0].isGuilty = true;
            }
        }
    }

    return {
        case: caseData,
        clues,
        suspects,
        solution
    };
} 
import { fetchTyphoonCompletion, TyphoonMessage } from './typhoon';
import { CaseSolution, Case, Clue, Suspect } from '@/types/game';

// System prompts for case solving
const CASE_SOLUTION_PROMPT_EN = `You are a brilliant detective evaluating a case solution. 
Given details about a case, the evidence collected, and a proposed solution, evaluate whether:
1. The solution correctly identifies the culprit
2. The evidence supports the reasoning
3. The narrative is logical and consistent with the case facts

Be fair but rigorous in your assessment, and explain your reasoning in detail.`;

const CASE_SOLUTION_PROMPT_TH = `คุณเป็นนักสืบผู้เชี่ยวชาญที่กำลังประเมินการแก้คดี
เมื่อได้รับรายละเอียดเกี่ยวกับคดี หลักฐานที่รวบรวมได้ และเสนอคำตอบ ประเมินว่า:
1. คำตอบระบุตัวผู้กระทำผิดได้ถูกต้องหรือไม่
2. หลักฐานสนับสนุนเหตุผลหรือไม่
3. เรื่องราวมีเหตุผลและสอดคล้องกับข้อเท็จจริงของคดีหรือไม่

ประเมินอย่างยุติธรรมแต่เข้มงวด และอธิบายเหตุผลของคุณอย่างละเอียด`;

/**
 * Analyzes a player's solution to a case using the Typhoon LLM
 */
export async function analyzeSolution(
    caseData: Case,
    suspects: Suspect[],
    clues: Clue[],
    accusedSuspectId: string,
    evidenceIds: string[],
    reasoning: string,
    language: 'en' | 'th'
): Promise<CaseSolution> {
    // Choose appropriate prompt based on language
    const systemPrompt = language === 'th' ? CASE_SOLUTION_PROMPT_TH : CASE_SOLUTION_PROMPT_EN;

    // Find the accused suspect
    const accusedSuspect = suspects.find(s => s.id === accusedSuspectId);
    if (!accusedSuspect) {
        throw new Error('Accused suspect not found');
    }

    // Find the actual guilty suspect
    const guiltySuspect = suspects.find(s => s.isGuilty);
    if (!guiltySuspect) {
        throw new Error('No guilty suspect found in the case data');
    }

    // Get the selected evidence
    const selectedEvidence = clues.filter(c => evidenceIds.includes(c.id));
    if (selectedEvidence.length === 0) {
        throw new Error('No evidence selected');
    }

    // Create user prompt with case context
    let userPrompt = '';

    if (language === 'th') {
        userPrompt = `ข้อมูลคดี:
ชื่อคดี: ${caseData.title}
คำอธิบาย: ${caseData.description}
สถานที่: ${caseData.location}
วันที่และเวลา: ${caseData.dateTime}

ผู้ต้องสงสัยทั้งหมด:
${suspects.map(s => `- ${s.name}: ${s.description}`).join('\n')}

หลักฐานที่พบ:
${clues.map(c => `- ${c.title}: ${c.description} (พบที่: ${c.location})`).join('\n')}

คำตอบที่เสนอ:
ผู้ต้องสงสัยที่กล่าวหา: ${accusedSuspect.name}
หลักฐานที่ใช้: ${selectedEvidence.map(e => e.title).join(', ')}
เหตุผล: ${reasoning}

ข้อมูลเพิ่มเติม (สำหรับการประเมินของคุณเท่านั้น ไม่ใช่ข้อมูลที่ผู้เล่นรู้):
ผู้กระทำผิดที่แท้จริง: ${guiltySuspect.name}

กรุณาประเมินคำตอบที่เสนอและให้:
1. คำตอบนี้ถูกต้องหรือไม่ (ระบุตัวผู้กระทำผิดได้ถูกต้องหรือไม่)
2. หลักฐานที่เลือกสนับสนุนเหตุผลหรือไม่
3. การบรรยายเหตุการณ์ที่อาจเกิดขึ้นตามคำตอบที่เสนอ

ตอบในรูปแบบ JSON ที่มีโครงสร้างซึ่งสามารถแปลงโดย JavaScript ได้ โดยมีฟิลด์ "solved" (boolean), "narrative" (string), และคำอธิบายอื่นๆ`;
    } else {
        userPrompt = `Case Information:
Title: ${caseData.title}
Description: ${caseData.description}
Location: ${caseData.location}
Date and Time: ${caseData.dateTime}

All Suspects:
${suspects.map(s => `- ${s.name}: ${s.description}`).join('\n')}

Discovered Clues:
${clues.map(c => `- ${c.title}: ${c.description} (Found at: ${c.location})`).join('\n')}

Proposed Solution:
Accused Suspect: ${accusedSuspect.name}
Evidence Used: ${selectedEvidence.map(e => e.title).join(', ')}
Reasoning: ${reasoning}

Additional Information (for your assessment only, not known to the player):
Actual Culprit: ${guiltySuspect.name}

Please evaluate the proposed solution and provide:
1. Whether the solution is correct (identifies the right culprit)
2. Whether the selected evidence supports the reasoning
3. A narrative of what likely happened based on the proposed solution

Respond in a structured JSON format that can be parsed by JavaScript, including fields for "solved" (boolean), "narrative" (string), and other explanations.`;
    }

    // Prepare messages for API call
    const messages: TyphoonMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    // Use the standard model for solution analysis
    const response = await fetchTyphoonCompletion(
        messages,
        'typhoon-v2-70b-instruct',
        0.7,
        2048
    );

    // Parse the JSON response
    try {
        // Use a fallback technique to extract JSON if direct parsing fails
        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
            response.match(/```([\s\S]*?)```/) ||
            response.match(/({[\s\S]*})/);

        const jsonContent = jsonMatch ? jsonMatch[1] : response;
        const parsedData = JSON.parse(jsonContent);

        // Format the response into our expected structure
        return formatCaseSolution(
            parsedData,
            accusedSuspectId,
            evidenceIds,
            reasoning,
            accusedSuspect.id === guiltySuspect.id
        );
    } catch (error) {
        console.error('Failed to parse case solution:', error);

        // If JSON parsing fails, create a fallback solution
        return createFallbackSolution(
            accusedSuspectId,
            evidenceIds,
            reasoning,
            accusedSuspect.id === guiltySuspect.id,
            language
        );
    }
}

/**
 * Formats the raw LLM JSON output into our CaseSolution structure
 */
function formatCaseSolution(
    data: unknown,
    culpritId: string,
    evidenceIds: string[],
    reasoning: string,
    isCorrect: boolean
): CaseSolution {
    // Determine if the solution is correct
    // The actual model output might have a "solved", "correct", "isCorrect" etc. field
    const solved = isCorrect && (
        (data as any).solved === true ||
        (data as any).correct === true ||
        (data as any).isCorrect === true
    );

    // Get the narrative or explanation
    const narrative = (data as any).narrative || (data as any).explanation || (data as any).description || '';

    return {
        solved,
        culpritId,
        reasoning,
        evidenceIds,
        narrative
    };
}

/**
 * Creates a fallback solution when JSON parsing fails
 */
function createFallbackSolution(
    culpritId: string,
    evidenceIds: string[],
    reasoning: string,
    isCorrect: boolean,
    language: 'en' | 'th'
): CaseSolution {
    // Create a default narrative based on whether the solution is correct
    let narrative = '';

    if (language === 'th') {
        narrative = isCorrect
            ? `การวิเคราะห์ของคุณถูกต้อง! คุณได้ระบุผู้กระทำผิดที่แท้จริงและมีเหตุผลที่สมเหตุสมผล หลักฐานที่คุณเลือกสนับสนุนข้อสรุปของคุณได้ดี คุณได้แก้คดีนี้สำเร็จแล้ว!`
            : `การวิเคราะห์ของคุณมีจุดที่น่าสนใจ แต่ยังไม่ถูกต้องทั้งหมด ผู้ต้องสงสัยที่คุณเลือกไม่ใช่ผู้กระทำผิดที่แท้จริง ลองตรวจสอบหลักฐานและพิจารณาผู้ต้องสงสัยคนอื่นๆ อีกครั้ง`;
    } else {
        narrative = isCorrect
            ? `Your analysis is correct! You have identified the true culprit and provided reasonable logic. The evidence you selected supports your conclusion well. You have successfully solved this case!`
            : `Your analysis has interesting points, but isn't entirely correct. The suspect you've chosen is not the actual culprit. Try reviewing the evidence again and reconsider the other suspects.`;
    }

    return {
        solved: isCorrect,
        culpritId,
        reasoning,
        evidenceIds,
        narrative
    };
} 
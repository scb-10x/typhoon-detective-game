import { fetchTyphoonCompletion, TyphoonMessage } from './typhoon';
import { ClueAnalysis, Clue, Suspect, Case } from '@/types/game';

// System prompts for clue analysis
const CLUE_ANALYSIS_PROMPT_EN = `You are a brilliant detective assistant helping analyze evidence in a case. 
Given details about a clue and the case context, provide a detailed analysis including:
1. A summary of the clue's significance 
2. Connections to suspects
3. Suggested next investigative steps

Be precise, logical, and focus on deduction based on the evidence provided.`;

const CLUE_ANALYSIS_PROMPT_TH = `คุณเป็นผู้ช่วยนักสืบที่ฉลาดเฉียบแหลมที่กำลังช่วยวิเคราะห์หลักฐานในคดี
เมื่อได้รับรายละเอียดเกี่ยวกับหลักฐานและบริบทของคดี โปรดให้การวิเคราะห์โดยละเอียดซึ่งรวมถึง:
1. สรุปความสำคัญของหลักฐาน
2. ความเชื่อมโยงกับผู้ต้องสงสัย
3. ขั้นตอนการสืบสวนต่อไปที่แนะนำ

มีความแม่นยำ มีเหตุผล และมุ่งเน้นการอนุมานตามหลักฐานที่มี`;

/**
 * Analyzes a clue in the context of a case using the Typhoon LLM
 */
export async function analyzeClue(
    clue: Clue,
    suspects: Suspect[],
    caseData: Case,
    discoveredClues: Clue[],
    language: 'en' | 'th'
): Promise<ClueAnalysis> {
    // Choose appropriate prompt based on language
    const systemPrompt = language === 'th' ? CLUE_ANALYSIS_PROMPT_TH : CLUE_ANALYSIS_PROMPT_EN;

    // Create user prompt with case context
    let userPrompt = '';

    if (language === 'th') {
        userPrompt = `ข้อมูลคดี:
ชื่อคดี: ${caseData.title}
สรุป: ${caseData.summary}
สถานที่: ${caseData.location}
วันที่และเวลา: ${caseData.dateTime}

หลักฐานที่ต้องการวิเคราะห์:
ชื่อ: ${clue.title}
คำอธิบาย: ${clue.description}
สถานที่พบ: ${clue.location}
ประเภท: ${clue.type}
ความสำคัญ: ${clue.relevance}

ผู้ต้องสงสัย:
${suspects.map(s => `${s.name}: ${s.description}`).join('\n')}

หลักฐานอื่นที่พบแล้ว:
${discoveredClues.filter(c => c.id !== clue.id).map(c => `${c.title}: ${c.description}`).join('\n')}

กรุณาวิเคราะห์หลักฐานนี้และให้:
1. สรุปความสำคัญของหลักฐาน
2. ความเชื่อมโยงกับผู้ต้องสงสัย
3. ขั้นตอนการสืบสวนต่อไปที่แนะนำ

ตอบในรูปแบบ JSON ที่มีโครงสร้างซึ่งสามารถแปลงโดย JavaScript ได้`;
    } else {
        userPrompt = `Case Information:
Title: ${caseData.title}
Summary: ${caseData.summary}
Location: ${caseData.location}
Date and Time: ${caseData.dateTime}

Clue to Analyze:
Title: ${clue.title}
Description: ${clue.description}
Location Found: ${clue.location}
Type: ${clue.type}
Relevance: ${clue.relevance}

Suspects:
${suspects.map(s => `${s.name}: ${s.description}`).join('\n')}

Other Discovered Clues:
${discoveredClues.filter(c => c.id !== clue.id).map(c => `${c.title}: ${c.description}`).join('\n')}

Please analyze this clue and provide:
1. A summary of the clue's significance
2. Connections to suspects
3. Suggested next investigative steps

Respond in a structured JSON format that can be parsed by JavaScript.`;
    }

    // Prepare messages for API call
    const messages: TyphoonMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    // Use the standard model for clue analysis
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
        return formatClueAnalysis(parsedData, suspects, clue.id);
    } catch (error) {
        console.error('Failed to parse clue analysis:', error);

        // If JSON parsing fails, try to extract information from raw text
        return extractClueAnalysisFromText(response, suspects, clue.id);
    }
}

/**
 * Formats the raw LLM JSON output into our ClueAnalysis structure
 */
function formatClueAnalysis(data: any, suspects: Suspect[], clueId: string): ClueAnalysis {
    const connections = [];

    // Process connections data
    if (data.connections && Array.isArray(data.connections)) {
        for (const connection of data.connections) {
            // Try to find the suspect this connection refers to
            const suspectName = connection.suspect || connection.suspectName || connection.name;
            const connectionType = connection.type || connection.connectionType || 'related';
            const description = connection.description || '';

            const matchedSuspect = suspects.find(s =>
                s.name.toLowerCase().includes(suspectName.toLowerCase()) ||
                suspectName.toLowerCase().includes(s.name.toLowerCase())
            );

            if (matchedSuspect) {
                connections.push({
                    suspectId: matchedSuspect.id,
                    connectionType,
                    description
                });
            }
        }
    }

    // If no connections were found but there's a connections text field
    if (connections.length === 0 && typeof data.connections === 'string') {
        // Try to find mentions of suspect names in the connections text
        for (const suspect of suspects) {
            if (data.connections.toLowerCase().includes(suspect.name.toLowerCase())) {
                connections.push({
                    suspectId: suspect.id,
                    connectionType: 'mentioned',
                    description: data.connections
                });
            }
        }
    }

    return {
        summary: data.summary || '',
        connections,
        nextSteps: Array.isArray(data.nextSteps) ? data.nextSteps :
            (data.nextSteps ? [data.nextSteps] : [])
    };
}

/**
 * Falls back to extracting information from raw text when JSON parsing fails
 */
function extractClueAnalysisFromText(text: string, suspects: Suspect[], clueId: string): ClueAnalysis {
    const summary = text.match(/summary[:\s]+(.*?)(?:\n|$)/i)?.[1] ||
        text.match(/significance[:\s]+(.*?)(?:\n|$)/i)?.[1] ||
        'Analysis unavailable';

    const connections = [];

    // Try to extract connections by finding suspect names in the text
    for (const suspect of suspects) {
        const suspectNameIndex = text.toLowerCase().indexOf(suspect.name.toLowerCase());
        if (suspectNameIndex !== -1) {
            // Extract some context around the suspect mention
            const start = Math.max(0, suspectNameIndex - 50);
            const end = Math.min(text.length, suspectNameIndex + suspect.name.length + 100);
            const context = text.substring(start, end);

            connections.push({
                suspectId: suspect.id,
                connectionType: 'mentioned',
                description: context
            });
        }
    }

    // Try to extract next steps
    const nextStepsMatch = text.match(/next steps?[:\s]+(.*?)(?:\n\n|$)/i);
    const nextSteps = nextStepsMatch ?
        nextStepsMatch[1]
            .split(/\n/) // Split by newlines
            .map(s => s.replace(/^[-*]\s*/, '').trim()) // Remove bullet points
            .filter(s => s.length > 0) : // Remove empty lines
        ['Continue investigating'];

    return {
        summary,
        connections,
        nextSteps
    };
} 
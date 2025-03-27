import { fetchTyphoonCompletion, TyphoonMessage } from './typhoon';
import { ClueAnalysis, Clue, Suspect, Case } from '@/types/game';

// System prompts for clue analysis
const CLUE_ANALYSIS_PROMPT_EN = `You are a brilliant detective assistant helping analyze evidence in a case. 
Given details about a clue and the case context, provide a detailed analysis including:
1. A summary of the clue's significance 
2. Connections to suspects
3. Suggested next investigative steps

Be precise, logical, and focus on deduction based on the evidence provided.

IMPORTANT: You must respond in valid JSON format with the following structure:
{
  "summary": "A comprehensive summary of the clue's significance",
  "connections": [
    {
      "suspect": "Name of suspect", 
      "connectionType": "Type of connection (e.g., direct, indirect)",
      "description": "Description of how this clue connects to the suspect"
    }
  ],
  "nextSteps": [
    "First investigative step to take",
    "Second investigative step to take"
  ]
}`;

const CLUE_ANALYSIS_PROMPT_TH = `คุณเป็นผู้ช่วยนักสืบที่ฉลาดเฉียบแหลมที่กำลังช่วยวิเคราะห์หลักฐานในคดี
เมื่อได้รับรายละเอียดเกี่ยวกับหลักฐานและบริบทของคดี โปรดให้การวิเคราะห์โดยละเอียดซึ่งรวมถึง:
1. สรุปความสำคัญของหลักฐาน
2. ความเชื่อมโยงกับผู้ต้องสงสัย
3. ขั้นตอนการสืบสวนต่อไปที่แนะนำ

มีความแม่นยำ มีเหตุผล และมุ่งเน้นการอนุมานตามหลักฐานที่มี

สำคัญ: คุณต้องตอบในรูปแบบ JSON ที่ถูกต้องตามโครงสร้างต่อไปนี้:
{
  "summary": "สรุปหลักฐานแบบรอบด้าน",
  "connections": [
    {
      "suspect": "ชื่อผู้ต้องสงสัย", 
      "connectionType": "ประเภทของความเชื่อมโยง (เช่น ทางตรง ทางอ้อม)",
      "description": "คำอธิบายว่าหลักฐานนี้เชื่อมโยงกับผู้ต้องสงสัยอย่างไร"
    }
  ],
  "nextSteps": [
    "ขั้นตอนแรกที่ควรทำต่อไป",
    "ขั้นตอนที่สองที่ควรทำต่อไป"
  ]
}`;

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

ตอบในรูปแบบ JSON ตามโครงสร้างที่กำหนดในคำแนะนำระบบ`;
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

Respond in the JSON format specified in the system instructions.`;
    }

    // Prepare messages for API call
    const messages: TyphoonMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    try {
        // Use the standard model for clue analysis
        const response = await fetchTyphoonCompletion(
            messages,
            'typhoon-v2-70b-instruct',
            0.7,
            2048
        );

        // Parse the JSON response
        try {
            // First try to parse the response directly
            let jsonContent = response;
            
            // If direct parsing fails, try to extract JSON
            try {
                JSON.parse(jsonContent);
            } catch {
                // Look for JSON block in markdown or text
                const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                    response.match(/```([\s\S]*?)```/) ||
                    response.match(/({[\s\S]*})/);
                
                if (jsonMatch) {
                    jsonContent = jsonMatch[1];
                }
            }
            
            const parsedData = JSON.parse(jsonContent);

            // Format the response into our expected structure
            return formatClueAnalysis(parsedData, suspects);
        } catch (parseError) {
            console.error('Failed to parse clue analysis as JSON:', parseError);
            console.log('Raw response:', response);

            // If JSON parsing fails, try to extract information from raw text
            return extractClueAnalysisFromText(response, suspects);
        }
    } catch (apiError) {
        console.error('Failed to get clue analysis from API:', apiError);
        throw new Error('Failed to analyze clue. Please try again later.');
    }
}

/**
 * Formats the raw LLM JSON output into our ClueAnalysis structure
 */
function formatClueAnalysis(data: unknown, suspects: Suspect[]): ClueAnalysis {
    const connections: Array<{
        suspectId: string;
        connectionType: string;
        description: string;
    }> = [];

    // Process connections data
    if ((data as any).connections && Array.isArray((data as any).connections)) {
        for (const connection of (data as any).connections) {
            // Try to find the suspect this connection refers to
            const suspectName = connection.suspect || connection.suspectName || connection.name || '';
            const connectionType = connection.connectionType || connection.type || 'related';
            const description = connection.description || '';

            if (suspectName) {
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
    }

    // If no connections were found but there's a connections text field
    if (connections.length === 0 && typeof (data as any).connections === 'string') {
        // Try to find mentions of suspect names in the connections text
        for (const suspect of suspects) {
            if ((data as any).connections.toLowerCase().includes(suspect.name.toLowerCase())) {
                connections.push({
                    suspectId: suspect.id,
                    connectionType: 'mentioned',
                    description: (data as any).connections
                });
            }
        }
    }

    // Ensure we have a valid summary
    const summary = (data as any).summary || 'No summary available';
    
    // Process next steps - ensure it's an array
    let nextSteps: string[] = [];
    if ((data as any).nextSteps) {
        if (Array.isArray((data as any).nextSteps)) {
            nextSteps = (data as any).nextSteps;
        } else if (typeof (data as any).nextSteps === 'string') {
            // Split by newlines if it's a string
            nextSteps = [(data as any).nextSteps];
        }
    }

    return {
        summary,
        connections,
        nextSteps: nextSteps.length > 0 ? nextSteps : ['Continue investigating']
    };
}

/**
 * Falls back to extracting information from raw text when JSON parsing fails
 */
function extractClueAnalysisFromText(text: string, suspects: Suspect[]): ClueAnalysis {
    const summary = text.match(/summary[:\s]+(.*?)(?:\n|$)/i)?.[1] ||
        text.match(/significance[:\s]+(.*?)(?:\n|$)/i)?.[1] ||
        text.match(/1\.([\s\S]*?)(?:2\.|$)/)?.[1]?.trim() ||
        'Analysis unavailable';

    const connections: Array<{
        suspectId: string;
        connectionType: string;
        description: string;
    }> = [];

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

    // Try to extract next steps - look for section "3." or "Next steps"
    let nextSteps: string[] = [];
    const nextStepsRegex = /(?:3\.|next steps?)[:\s]+([\s\S]*?)(?:\n\n|$)/i;
    const nextStepsMatch = text.match(nextStepsRegex);
    
    if (nextStepsMatch && nextStepsMatch[1]) {
        nextSteps = nextStepsMatch[1]
            .split(/\n|-|\*/)  // Split by newlines or bullet points
            .map(s => s.trim())
            .filter(s => s.length > 0); // Remove empty lines
    }
    
    if (nextSteps.length === 0) {
        nextSteps = ['Continue investigating'];
    }

    return {
        summary,
        connections,
        nextSteps
    };
} 
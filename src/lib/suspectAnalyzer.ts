import { fetchTyphoonCompletion, TyphoonMessage } from './typhoon';
import { SuspectAnalysis, Suspect, Clue, Case, Interview } from '@/types/game';

// System prompts for suspect analysis
const SUSPECT_ANALYSIS_PROMPT_EN = `You are a brilliant detective assistant helping analyze suspects in a case. 
Given details about a suspect and the case context, provide a detailed analysis including:
1. Assessment of the suspect's trustworthiness (on a scale of 0-100)
2. Potential inconsistencies in their story or background
3. Connections to discovered clues
4. Suggested questions for further interrogation

Be precise, logical, and focus on deduction based on the evidence provided.`;

const SUSPECT_ANALYSIS_PROMPT_TH = `คุณเป็นผู้ช่วยนักสืบที่ฉลาดเฉียบแหลมที่กำลังช่วยวิเคราะห์ผู้ต้องสงสัยในคดี
เมื่อได้รับรายละเอียดเกี่ยวกับผู้ต้องสงสัยและบริบทของคดี โปรดให้การวิเคราะห์โดยละเอียดซึ่งรวมถึง:
1. การประเมินความน่าเชื่อถือของผู้ต้องสงสัย (ในระดับ 0-100)
2. ความไม่สอดคล้องที่อาจเกิดขึ้นในเรื่องราวหรือประวัติของพวกเขา
3. ความเชื่อมโยงกับหลักฐานที่ค้นพบ
4. คำถามที่แนะนำสำหรับการสอบสวนเพิ่มเติม

มีความแม่นยำ มีเหตุผล และมุ่งเน้นการอนุมานตามหลักฐานที่มี`;

/**
 * Analyzes a suspect in the context of a case using the Typhoon LLM
 */
export async function analyzeSuspect(
    suspect: Suspect,
    clues: Clue[],
    caseData: Case,
    interview: Interview | null,
    language: 'en' | 'th'
): Promise<SuspectAnalysis> {
    // Choose appropriate prompt based on language
    const systemPrompt = language === 'th' ? SUSPECT_ANALYSIS_PROMPT_TH : SUSPECT_ANALYSIS_PROMPT_EN;

    // Create user prompt with case context
    let userPrompt = '';

    if (language === 'th') {
        userPrompt = `ข้อมูลคดี:
ชื่อคดี: ${caseData.title}
สรุป: ${caseData.summary}
สถานที่: ${caseData.location}
วันที่และเวลา: ${caseData.dateTime}

ผู้ต้องสงสัยที่ต้องการวิเคราะห์:
ชื่อ: ${suspect.name}
คำอธิบาย: ${suspect.description}
ประวัติ: ${suspect.background}
แรงจูงใจที่เป็นไปได้: ${suspect.motive}
ข้ออ้างที่อยู่: ${suspect.alibi}

หลักฐานที่พบ:
${clues.map(c => `${c.title}: ${c.description} (พบที่: ${c.location})`).join('\n')}`;

        // Add interview data if available
        if (interview && interview.questions.some(q => q.asked)) {
            userPrompt += `\n\nบันทึกการสัมภาษณ์:
${interview.questions.filter(q => q.asked).map(q => `คำถาม: ${q.question}\nคำตอบ: ${q.answer}`).join('\n\n')}`;
        }

        userPrompt += `\n\nกรุณาวิเคราะห์ผู้ต้องสงสัยนี้และให้:
1. การประเมินความน่าเชื่อถือของผู้ต้องสงสัย (ในระดับ 0-100)
2. ความไม่สอดคล้องที่อาจเกิดขึ้นในเรื่องราวหรือประวัติของพวกเขา
3. ความเชื่อมโยงกับหลักฐานที่ค้นพบ
4. คำถามที่แนะนำสำหรับการสอบสวนเพิ่มเติม

ตอบในรูปแบบ JSON ที่มีโครงสร้างซึ่งสามารถแปลงโดย JavaScript ได้`;
    } else {
        userPrompt = `Case Information:
Title: ${caseData.title}
Summary: ${caseData.summary}
Location: ${caseData.location}
Date and Time: ${caseData.dateTime}

Suspect to Analyze:
Name: ${suspect.name}
Description: ${suspect.description}
Background: ${suspect.background}
Possible Motive: ${suspect.motive}
Alibi: ${suspect.alibi}

Discovered Clues:
${clues.map(c => `${c.title}: ${c.description} (Found at: ${c.location})`).join('\n')}`;

        // Add interview data if available
        if (interview && interview.questions.some(q => q.asked)) {
            userPrompt += `\n\nInterview Records:
${interview.questions.filter(q => q.asked).map(q => `Question: ${q.question}\nAnswer: ${q.answer}`).join('\n\n')}`;
        }

        userPrompt += `\n\nPlease analyze this suspect and provide:
1. Assessment of the suspect's trustworthiness (on a scale of 0-100)
2. Potential inconsistencies in their story or background
3. Connections to discovered clues
4. Suggested questions for further interrogation

Respond in a structured JSON format that can be parsed by JavaScript.`;
    }

    // Prepare messages for API call
    const messages: TyphoonMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    // Use the standard model for suspect analysis
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
        return formatSuspectAnalysis(parsedData, clues, suspect.id);
    } catch (error) {
        console.error('Failed to parse suspect analysis:', error);

        // If JSON parsing fails, try to extract information from raw text
        return extractSuspectAnalysisFromText(response, clues, suspect.id);
    }
}

/**
 * Processes an interview question and generates a realistic response
 */
export async function processInterviewQuestion(
    question: string,
    suspect: Suspect,
    clues: Clue[],
    caseData: Case,
    previousQuestions: { question: string, answer: string }[],
    language: 'en' | 'th'
): Promise<string> {
    // System prompt for generating interview responses
    const systemPrompt = language === 'th'
        ? `คุณเป็น${suspect.name} ผู้ต้องสงสัยในคดี ตอบคำถามตามบุคลิกและข้อมูลของคุณ`
        : `You are ${suspect.name}, a suspect in this case. Answer questions according to your character and information.`;

    // Create context message
    let contextMessage = '';

    if (language === 'th') {
        contextMessage = `ข้อมูลของคุณในฐานะผู้ต้องสงสัย:
ชื่อ: ${suspect.name}
คำอธิบาย: ${suspect.description}
ประวัติ: ${suspect.background}
แรงจูงใจที่เป็นไปได้: ${suspect.motive}
ข้ออ้างที่อยู่: ${suspect.alibi}

ข้อมูลเพิ่มเติม:
- ${suspect.isGuilty ? 'คุณเป็นคนที่กระทำผิดในคดีนี้จริง แต่พยายามปกปิดความจริง' : 'คุณไม่ได้เป็นผู้กระทำผิดในคดีนี้ แต่คุณอาจมีความลับที่คุณไม่ต้องการให้คนอื่นรู้'}
- คุณควรตอบตามบุคลิกและข้อมูลของคุณ
- อย่าบอกว่าคุณผิดหรือไม่ผิดโดยตรง แม้ว่าจะถูกถามตรงๆ
- เมื่อถูกถามเกี่ยวกับหลักฐาน ให้ตอบในลักษณะที่สมเหตุสมผลกับสถานการณ์ของคุณ`;
    } else {
        contextMessage = `Your information as a suspect:
Name: ${suspect.name}
Description: ${suspect.description}
Background: ${suspect.background}
Possible Motive: ${suspect.motive}
Alibi: ${suspect.alibi}

Additional information:
- ${suspect.isGuilty ? 'You are actually guilty of this crime but trying to hide the truth' : 'You are not guilty of this crime, but you may have secrets you don\'t want others to know'}
- You should answer in character according to your information
- Do not directly state whether you are guilty or not, even if asked directly
- When asked about evidence, respond in a way that makes sense for your situation`;
    }

    // Prepare the conversation history
    const messages: TyphoonMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextMessage },
    ];

    // Add previous questions to conversation history
    for (const prevQ of previousQuestions) {
        messages.push({ role: 'user', content: prevQ.question });
        messages.push({ role: 'assistant', content: prevQ.answer });
    }

    // Add the current question
    messages.push({ role: 'user', content: question });

    // Use the more advanced model for more nuanced responses
    const response = await fetchTyphoonCompletion(
        messages,
        'typhoon-v2-r1-70b-preview',
        0.7,
        2048
    );

    return response;
}

/**
 * Formats the raw LLM JSON output into our SuspectAnalysis structure
 */
function formatSuspectAnalysis(data: any, clues: Clue[], suspectId: string): SuspectAnalysis {
    const connections: SuspectAnalysis['connections'] = [];

    // Process connections data
    if (data.connections && Array.isArray(data.connections)) {
        for (const connection of data.connections) {
            // Try to find the clue this connection refers to
            const clueTitle = connection.clue || connection.clueTitle || connection.title;
            const connectionType = connection.type || connection.connectionType || 'related';
            const description = connection.description || '';

            const matchedClue = clues.find(c =>
                c.title.toLowerCase().includes(clueTitle.toLowerCase()) ||
                clueTitle.toLowerCase().includes(c.title.toLowerCase())
            );

            if (matchedClue) {
                connections.push({
                    clueId: matchedClue.id,
                    connectionType,
                    description
                });
            }
        }
    }

    // Ensure trustworthiness is within range
    let trustworthiness = typeof data.trustworthiness === 'number'
        ? data.trustworthiness
        : parseInt(data.trustworthiness);

    if (isNaN(trustworthiness)) {
        trustworthiness = 50; // Default if not a number
    } else {
        trustworthiness = Math.max(0, Math.min(100, trustworthiness)); // Clamp between 0-100
    }

    // Process inconsistencies
    let inconsistencies: string[] = [];
    if (Array.isArray(data.inconsistencies)) {
        inconsistencies = data.inconsistencies;
    } else if (typeof data.inconsistencies === 'string') {
        inconsistencies = [data.inconsistencies];
    }

    // Process suggested questions
    let suggestedQuestions: string[] = [];
    if (Array.isArray(data.suggestedQuestions)) {
        suggestedQuestions = data.suggestedQuestions;
    } else if (typeof data.suggestedQuestions === 'string') {
        suggestedQuestions = [data.suggestedQuestions];
    }

    return {
        suspectId,
        trustworthiness,
        inconsistencies,
        connections,
        suggestedQuestions
    };
}

/**
 * Falls back to extracting information from raw text when JSON parsing fails
 */
function extractSuspectAnalysisFromText(text: string, clues: Clue[], suspectId: string): SuspectAnalysis {
    // Extract trustworthiness
    const trustworthinessMatch = text.match(/trustworthiness[:\s]+(\d+)/i);
    const trustworthiness = trustworthinessMatch ? parseInt(trustworthinessMatch[1]) : 50;

    // Extract inconsistencies
    const inconsistenciesSection = text.match(/inconsistencies[:\s]+([\s\S]*?)(?=\n\n|connections|$)/i);
    let inconsistencies: string[] = [];

    if (inconsistenciesSection) {
        inconsistencies = inconsistenciesSection[1]
            .split(/\n/) // Split by newlines
            .map(s => s.replace(/^[-*]\s*/, '').trim()) // Remove bullet points
            .filter(s => s.length > 0); // Remove empty lines
    }

    // Extract connections to clues
    const connections: SuspectAnalysis['connections'] = [];
    for (const clue of clues) {
        if (text.toLowerCase().includes(clue.title.toLowerCase())) {
            connections.push({
                clueId: clue.id,
                connectionType: 'mentioned',
                description: `The suspect may be connected to the ${clue.title}`
            });
        }
    }

    // Extract suggested questions
    const questionsSection = text.match(/questions[:\s]+([\s\S]*?)(?=\n\n|$)/i);
    let suggestedQuestions: string[] = [];

    if (questionsSection) {
        suggestedQuestions = questionsSection[1]
            .split(/\n/) // Split by newlines
            .map(s => s.replace(/^[-*]\s*/, '').trim()) // Remove bullet points
            .filter(s => s.length > 0 && s.includes('?')); // Keep only question lines
    }

    if (suggestedQuestions.length === 0) {
        // If no questions were extracted, create some generic ones
        suggestedQuestions = [
            "Can you provide more details about your alibi?",
            "Where were you at the time of the incident?",
            "Do you know any of the other suspects?"
        ];
    }

    return {
        suspectId,
        trustworthiness,
        inconsistencies,
        connections,
        suggestedQuestions
    };
} 
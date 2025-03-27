'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle, FaMedal } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { useTyphoon } from '@/hooks/useTyphoon';
import { TyphoonMessage } from '@/lib/typhoon';
import { CaseSolution } from '@/types/game';

interface SolveCasePageProps {
    params: {
        id: string;
    };
}

export default function SolveCasePage({ params }: SolveCasePageProps) {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { state, dispatch } = useGame();
    const { cases, clues, suspects, gameState } = state;
    const { sendMessage, loading: isAnalyzing } = useTyphoon();

    const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
    const [selectedClues, setSelectedClues] = useState<string[]>([]);
    const [reasoning, setReasoning] = useState('');
    const [solution, setSolution] = useState<CaseSolution | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Note: Direct access to params.id is supported for migration in this Next.js version
    // In a future version, params will need to be unwrapped with React.use()
    const caseId = params.id;

    // Find the case by ID
    const caseData = cases.find(c => c.id === caseId);

    // Get related clues and suspects
    const caseClues = clues.filter(c => c.caseId === caseId);
    const caseSuspects = suspects.filter(s => s.caseId === caseId);

    // Filter to only discovered and examined clues
    const discoveredClues = caseClues.filter(c => gameState.discoveredClues.includes(c.id));
    const examinedClues = caseClues.filter(c => gameState.examinedClues.includes(c.id));

    // Get interviewed suspects
    const interviewedSuspects = caseSuspects.filter(s => gameState.interviewedSuspects.includes(s.id));

    // Handle case not found
    if (!caseData) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">Case Not Found</h1>
                    <p className="mb-6">The case you are looking for does not exist.</p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/cases')}
                    >
                        Back to Cases
                    </Button>
                </div>
            </Layout>
        );
    }

    // Redirect if case is already solved
    useEffect(() => {
        if (caseData.solved) {
            router.push(`/cases/${params.id}`);
        }
    }, [caseData.solved, params.id, router]);

    // Toggle clue selection
    const toggleClueSelection = (clueId: string) => {
        setSelectedClues(prev =>
            prev.includes(clueId)
                ? prev.filter(id => id !== clueId)
                : [...prev, clueId]
        );
    };

    // Handle solving the case
    const handleSolveCase = async () => {
        // Validation checks
        if (!selectedSuspect) {
            setError('You must select a suspect as the culprit.');
            return;
        }

        if (selectedClues.length < 2) {
            setError('You must select at least 2 pieces of evidence to support your conclusion.');
            return;
        }

        if (reasoning.trim().length < 20) {
            setError('Please provide a more detailed reasoning for your conclusion.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Prepare data for LLM
            const selectedSuspectData = caseSuspects.find(s => s.id === selectedSuspect);
            const selectedCluesData = caseClues.filter(c => selectedClues.includes(c.id));

            if (!selectedSuspectData) {
                throw new Error('Selected suspect not found');
            }

            // Prepare the prompt for the LLM
            const systemPrompt = language === 'th'
                ? `คุณเป็นผู้ช่วยสรุปคดีสำหรับเกมสืบสวน ประเมินคำตอบของผู้เล่นและตัดสินว่าถูกต้องหรือไม่โดยเปรียบเทียบกับคำตอบจริง
คำตอบที่ถูกต้อง: ผู้ร้ายคือ ${caseSuspects.find(s => s.isGuilty)?.name}
กรุณาตรวจสอบเหตุผลของผู้เล่นและตัดสินว่าถูกต้องหรือไม่ โดยให้คำอธิบายแบบละเอียด`
                : `You are a case summary assistant for a detective game. Evaluate the player's solution and determine if they are correct by comparing to the actual solution.
Correct answer: The culprit is ${caseSuspects.find(s => s.isGuilty)?.name}
Please review the player's reasoning and determine if they are correct, providing a detailed explanation.`;

            const userPrompt = language === 'th'
                ? `คดี: ${caseData.title}
รายละเอียดคดี: ${caseData.summary}

ผู้ต้องสงสัยที่ผู้เล่นเลือก: ${selectedSuspectData.name}
รายละเอียดผู้ต้องสงสัย: ${selectedSuspectData.description}
ภูมิหลัง: ${selectedSuspectData.background}
แรงจูงใจ: ${selectedSuspectData.motive}
ข้ออ้าง: ${selectedSuspectData.alibi}

หลักฐานที่ผู้เล่นเลือก:
${selectedCluesData.map(c => `- ${c.title}: ${c.description}`).join('\n')}

เหตุผลของผู้เล่น:
${reasoning}

กรุณาวิเคราะห์คำตอบของผู้เล่น และใช้ฟอร์แมต JSON ตามนี้ในคำตอบ (แทรกในข้อความตอบ):
\`\`\`json
{
  "solved": boolean, // ผู้เล่นระบุตัวผู้ร้ายถูกต้องหรือไม่
  "culpritId": "string", // ID ของผู้ร้ายตัวจริง
  "reasoning": "string", // การวิเคราะห์ว่าเหตุผลของผู้เล่นถูกต้องหรือไม่
  "evidenceIds": ["string"], // ID ของหลักฐานสำคัญที่เชื่อมโยงกับผู้ร้าย
  "narrative": "string" // เรื่องราวสรุปของคดีว่าเกิดอะไรขึ้นจริงๆ
}
\`\`\``
                : `Case: ${caseData.title}
Case Details: ${caseData.summary}

Player's Selected Suspect: ${selectedSuspectData.name}
Suspect Details: ${selectedSuspectData.description}
Background: ${selectedSuspectData.background}
Motive: ${selectedSuspectData.motive}
Alibi: ${selectedSuspectData.alibi}

Player's Selected Evidence:
${selectedCluesData.map(c => `- ${c.title}: ${c.description}`).join('\n')}

Player's Reasoning:
${reasoning}

Please analyze the player's solution and include this JSON format in your response:
\`\`\`json
{
  "solved": boolean, // whether the player correctly identified the culprit
  "culpritId": "string", // the ID of the actual culprit
  "reasoning": "string", // analysis of whether the player's reasoning is sound
  "evidenceIds": ["string"], // IDs of key evidence pieces linked to the culprit
  "narrative": "string" // a narrative summary of what actually happened in the case
}
\`\`\``;

            const messages: TyphoonMessage[] = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];

            // Get the response from the LLM
            const response = await sendMessage(messages, 'typhoon-v2-r1-70b-preview');

            // Extract JSON solution
            const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                response.match(/```([\s\S]*?)```/) ||
                response.match(/({[\s\S]*})/);

            if (jsonMatch) {
                const solution = JSON.parse(jsonMatch[1]) as CaseSolution;
                setSolution(solution);

                // Mark case as solved regardless of player's accuracy
                dispatch({ type: 'SOLVE_CASE', payload: params.id });
            } else {
                throw new Error('Could not parse solution from LLM response');
            }
        } catch (err) {
            console.error('Error solving case:', err);
            setError(language === 'en'
                ? 'Failed to analyze your solution. Please try again.'
                : 'การวิเคราะห์คำตอบล้มเหลว โปรดลองอีกครั้ง');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Solution result page
    if (solution) {
        // Find the actual culprit
        const actualCulprit = caseSuspects.find(s => s.id === solution.culpritId);
        const isCorrect = solution.solved;

        return (
            <Layout title={`Case Solved: ${caseData.title}`}>
                <div className="mb-8">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => router.push(`/cases/${params.id}`)}
                            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-bold">Case Conclusion</h1>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                        <div className="text-center mb-8">
                            {isCorrect ? (
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 mb-4">
                                        <FaCheck size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-200">Correct!</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        You successfully solved the case.
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 mb-4">
                                        <FaTimes size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-200">Not Quite Right</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Your conclusion was incorrect.
                                    </p>
                                </div>
                            )}

                            <div className="max-w-lg mx-auto">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                    <FaMedal className="text-accent mr-3" size={24} />
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">The culprit was</div>
                                        <div className="font-bold">{actualCulprit?.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-xl mb-3">Case Summary</h3>
                        <p className="whitespace-pre-wrap mb-6">{solution.narrative}</p>

                        <h3 className="font-semibold text-xl mb-3">Analysis of Your Reasoning</h3>
                        <p className="whitespace-pre-wrap mb-6">{solution.reasoning}</p>

                        <h3 className="font-semibold text-xl mb-3">Key Evidence</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {solution.evidenceIds.map(id => {
                                const evidence = clues.find(c => c.id === id);
                                if (!evidence) return null;

                                return (
                                    <div key={id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                        <h4 className="font-medium mb-1">{evidence.title}</h4>
                                        <p className="text-sm">{evidence.description.substring(0, 100)}...</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => router.push(`/cases/${params.id}`)}
                            >
                                Back to Case
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => router.push('/cases')}
                            >
                                Browse Other Cases
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Check if enough evidence is available
    const hasEnoughEvidence =
        examinedClues.length >= Math.ceil(caseClues.length * 0.7) &&
        interviewedSuspects.length === caseSuspects.length;

    return (
        <Layout title={`Solve Case: ${caseData.title}`}>
            <div className="mb-8">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.push(`/cases/${params.id}`)}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold">Solve the Case</h1>
                </div>

                {!hasEnoughEvidence && (
                    <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 mb-6">
                        <div className="flex">
                            <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                                    Insufficient Evidence
                                </h3>
                                <p className="text-yellow-700 dark:text-yellow-200">
                                    You haven't examined enough evidence or interviewed all suspects yet.
                                    This might affect your ability to correctly solve the case.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Case summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Case Summary</h2>
                            <p className="mb-4">{caseData.summary}</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <span className="text-gray-600 dark:text-gray-400">Location:</span>
                                <span>{caseData.location}</span>
                                <span className="text-gray-600 dark:text-gray-400">Date/Time:</span>
                                <span>{new Date(caseData.dateTime).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Select the culprit */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Select the Culprit</h2>
                            <p className="mb-4">Who do you think committed the crime?</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {caseSuspects.map(suspect => (
                                    <div
                                        key={suspect.id}
                                        className={`p-4 rounded-lg cursor-pointer border-2 transition-colors ${selectedSuspect === suspect.id
                                            ? 'border-accent bg-accent/10'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                        onClick={() => setSelectedSuspect(suspect.id)}
                                    >
                                        <div className="font-semibold mb-1">{suspect.name}</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {suspect.description.substring(0, 100)}...
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Select evidence */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Select Evidence</h2>
                            <p className="mb-4">Select the evidence that supports your conclusion:</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {examinedClues.map(clue => (
                                    <div
                                        key={clue.id}
                                        className={`p-4 rounded-lg cursor-pointer border-2 transition-colors ${selectedClues.includes(clue.id)
                                            ? 'border-accent bg-accent/10'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                        onClick={() => toggleClueSelection(clue.id)}
                                    >
                                        <div className="font-semibold mb-1">{clue.title}</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {clue.description.substring(0, 100)}...
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {examinedClues.length === 0 && (
                                <div className="text-center py-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        You haven't examined any clues yet. Go back and examine some clues first.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Reasoning */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Your Reasoning</h2>
                            <p className="mb-4">Explain why you think your selected suspect is the culprit:</p>

                            <textarea
                                value={reasoning}
                                onChange={(e) => setReasoning(e.target.value)}
                                className="w-full h-40 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                                placeholder="Enter your reasoning here. Be specific about how the evidence connects to the suspect."
                            />
                        </div>
                    </div>

                    {/* Side panel */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Case Solution</h2>
                            <p className="mb-6">
                                Once you've made your selections and provided your reasoning, submit your solution.
                                Our AI detective will analyze your conclusion and determine if you correctly solved the case.
                            </p>

                            <Button
                                variant="accent"
                                fullWidth
                                onClick={handleSolveCase}
                                isLoading={isSubmitting || isAnalyzing}
                                disabled={!selectedSuspect || selectedClues.length < 2 || reasoning.trim().length < 20}
                            >
                                {isSubmitting || isAnalyzing ? 'Analyzing...' : 'Submit Solution'}
                            </Button>

                            {error && (
                                <div className="mt-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="font-semibold text-lg mb-3">Your Selections</h3>

                            <div className="mb-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Selected Culprit:</div>
                                {selectedSuspect ? (
                                    <div className="font-medium">
                                        {caseSuspects.find(s => s.id === selectedSuspect)?.name || 'None'}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">None selected</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Evidence Selected: {selectedClues.length}
                                </div>
                                {selectedClues.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm">
                                        {selectedClues.map(id => (
                                            <li key={id}>
                                                {clues.find(c => c.id === id)?.title || 'Unknown Evidence'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-500 italic">None selected</div>
                                )}
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reasoning:</div>
                                {reasoning.trim() ? (
                                    <div className="text-sm">
                                        {reasoning.length > 100
                                            ? `${reasoning.substring(0, 100)}...`
                                            : reasoning}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">Not provided</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 
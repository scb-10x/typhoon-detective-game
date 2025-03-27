'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft, FaChevronRight, FaComment, FaUserTie, FaQuestionCircle, FaEllipsisH } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { useTyphoon } from '@/hooks/useTyphoon';
import { TyphoonMessage } from '@/lib/typhoon';

interface SuspectPageProps {
    params: {
        id: string;
    };
}

export default function SuspectPage({ params }: SuspectPageProps) {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { state, dispatch } = useGame();
    const { suspects, cases, gameState } = state;
    const { sendMessage, loading: isAsking } = useTyphoon();

    const [customQuestion, setCustomQuestion] = useState('');
    const [conversation, setConversation] = useState<{
        question: string;
        answer: string;
        isCustom?: boolean;
    }[]>([]);

    // Predefined questions based on suspect
    const [predefinedQuestions, setPredefinedQuestions] = useState<string[]>([
        'Where were you at the time of the incident?',
        'Can you tell me about your relationship with the victim?',
        'Do you have an alibi that can be verified?',
        'Have you noticed anything unusual lately?'
    ]);

    // Note: Direct access to params.id is supported for migration in this Next.js version
    // In a future version, params will need to be unwrapped with React.use()
    const suspectId = params.id;

    // Find the suspect by ID
    const suspect = suspects.find(s => s.id === suspectId);

    // Get related case
    const caseData = suspect ? cases.find(c => c.id === suspect.caseId) : null;

    // Track if suspect is interviewed
    const isInterviewed = suspect ? gameState.interviewedSuspects.includes(suspect.id) : false;

    // Set the suspect as interviewed when the page loads
    useEffect(() => {
        if (suspect && !isInterviewed) {
            dispatch({ type: 'INTERVIEW_SUSPECT', payload: suspect.id });
        }
    }, [suspect, dispatch, isInterviewed]);

    // Handle suspect not found
    if (!suspect || !caseData) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">Suspect Not Found</h1>
                    <p className="mb-6">The suspect you are looking for does not exist.</p>
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

    // Handle asking a question
    const handleAskQuestion = async (question: string, isCustom: boolean = false) => {
        if (isAsking || !question.trim()) return;

        try {
            // Remove the question from predefined list if it's not custom
            if (!isCustom) {
                setPredefinedQuestions(prev => prev.filter(q => q !== question));
            } else {
                setCustomQuestion('');
            }

            // Add the question to conversation immediately with loading state
            setConversation(prev => [
                ...prev,
                { question, answer: '...', isCustom }
            ]);

            // Prepare the prompt for the LLM
            const systemPrompt = language === 'th'
                ? `คุณเป็น ${suspect.name} จากคดี "${caseData.title}". จงตอบคำถามตามบุคลิกของตัวละครและข้อมูลด้านล่าง:
ข้อมูลคดี: ${caseData.summary}
คำอธิบายผู้ต้องสงสัย: ${suspect.description}
ภูมิหลัง: ${suspect.background}
แรงจูงใจ: ${suspect.motive}
ข้ออ้าง: ${suspect.alibi}

ตอบคำถามในฐานะผู้ต้องสงสัย ใช้ภาษาที่เป็นธรรมชาติและสมจริง จงคงความลึกลับไว้หากเหมาะสม`
                : `You are ${suspect.name} from the case "${caseData.title}". Respond to questions in character based on the following information:
Case summary: ${caseData.summary}
Suspect description: ${suspect.description}
Background: ${suspect.background}
Motive: ${suspect.motive}
Alibi: ${suspect.alibi}

Answer as the suspect would, using natural language and appropriate demeanor. Maintain mystery where appropriate.`;

            const messages: TyphoonMessage[] = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: question }
            ];

            // Get the response from the LLM
            const response = await sendMessage(messages);

            // Update the conversation with the actual response
            setConversation(prev =>
                prev.map((item, i) =>
                    i === prev.length - 1 ? { ...item, answer: response } : item
                )
            );
        } catch (error) {
            console.error('Error asking question:', error);

            // Update with error
            setConversation(prev =>
                prev.map((item, i) =>
                    i === prev.length - 1
                        ? {
                            ...item, answer: language === 'en'
                                ? 'Sorry, I couldn\'t process that question. Please try again.'
                                : 'ขออภัย ไม่สามารถประมวลผลคำถามได้ กรุณาลองอีกครั้ง'
                        }
                        : item
                )
            );
        }
    };

    // Handle custom question submission
    const handleSubmitCustomQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        if (customQuestion.trim()) {
            handleAskQuestion(customQuestion, true);
        }
    };

    return (
        <Layout title={suspect.name}>
            <div className="mb-8">
                {/* Suspect header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold">{suspect.name}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Suspect details */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        {/* Suspect image and basic info */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row gap-6">
                                {suspect.imageUrl ? (
                                    <div className="w-32 h-32 rounded-full overflow-hidden relative flex-shrink-0 mx-auto sm:mx-0">
                                        <Image
                                            src={suspect.imageUrl}
                                            alt={suspect.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                                        <FaUserTie size={48} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">{suspect.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">{suspect.description}</p>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                            {caseData.title}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs ${isInterviewed
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}>
                                            {isInterviewed ? 'Interviewed' : 'Not Interviewed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interview section */}
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Interview</h2>

                            {/* Conversation history */}
                            <div className="space-y-6 mb-8">
                                {conversation.length === 0 ? (
                                    <div className="text-center py-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <FaComment size={32} className="mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Start asking questions to interview the suspect.
                                        </p>
                                    </div>
                                ) : (
                                    conversation.map((item, index) => (
                                        <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="mb-3">
                                                <div className="font-medium text-accent mb-1 flex items-center">
                                                    <FaQuestionCircle className="mr-2" /> You
                                                </div>
                                                <p className="text-sm">{item.question}</p>
                                            </div>
                                            <div>
                                                <div className="font-medium mb-1 flex items-center">
                                                    <FaUserTie className="mr-2" /> {suspect.name}
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {item.answer === '...' ? (
                                                        <span className="flex items-center text-gray-500">
                                                            <FaEllipsisH className="animate-pulse mr-2" /> Thinking...
                                                        </span>
                                                    ) : (
                                                        item.answer
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Ask a custom question */}
                            <form onSubmit={handleSubmitCustomQuestion} className="mb-6">
                                <label htmlFor="custom-question" className="block text-sm font-medium mb-2">
                                    Ask a custom question
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="custom-question"
                                        type="text"
                                        value={customQuestion}
                                        onChange={(e) => setCustomQuestion(e.target.value)}
                                        placeholder="Type your question..."
                                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                                        disabled={isAsking}
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={!customQuestion.trim() || isAsking}
                                        isLoading={isAsking}
                                    >
                                        Ask
                                    </Button>
                                </div>
                            </form>

                            {/* Predefined questions */}
                            {predefinedQuestions.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Suggested Questions</h3>
                                    <div className="space-y-2">
                                        {predefinedQuestions.map((question, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                                onClick={() => handleAskQuestion(question)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm">{question}</span>
                                                    <FaChevronRight size={12} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side information */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Background Information</h2>

                            <div className="mb-4">
                                <h3 className="font-medium mb-1">Background</h3>
                                <p className="text-sm whitespace-pre-wrap">{suspect.background}</p>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-medium mb-1">Alibi</h3>
                                <p className="text-sm whitespace-pre-wrap">{suspect.alibi}</p>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-medium mb-1">Possible Motive</h3>
                                <p className="text-sm whitespace-pre-wrap">{suspect.motive}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Case Context</h2>
                            <h3 className="font-medium mb-2">{caseData.title}</h3>
                            <p className="text-sm mb-4">{caseData.summary}</p>

                            <div
                                className="rounded p-3 mb-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => router.push(`/cases/${caseData.id}`)}
                            >
                                <div className="flex justify-between items-center">
                                    <span>Back to case</span>
                                    <FaChevronRight size={12} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 
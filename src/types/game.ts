// Game object types
export interface Case {
    id: string;
    title: string;
    description: string;
    summary: string;
    difficulty: 'easy' | 'medium' | 'hard';
    solved: boolean;
    location: string;
    dateTime: string;
    imageUrl?: string;
    isLLMGenerated: boolean;
}

export interface Clue {
    id: string;
    caseId: string;
    title: string;
    description: string;
    location: string;
    type: 'physical' | 'testimonial' | 'digital';
    imageUrl?: string;
    discovered: boolean;
    examined: boolean;
    relevance: 'critical' | 'important' | 'minor';
}

export interface Suspect {
    id: string;
    caseId: string;
    name: string;
    description: string;
    background: string;
    motive: string;
    alibi: string;
    imageUrl?: string;
    isGuilty: boolean;
    interviewed: boolean;
}

export interface Interview {
    id: string;
    suspectId: string;
    caseId: string;
    questions: InterviewQuestion[];
    completed: boolean;
}

export interface InterviewQuestion {
    id: string;
    question: string;
    answer: string;
    asked: boolean;
}

export interface GameState {
    activeCase: string | null;
    discoveredClues: string[];
    examinedClues: string[];
    interviewedSuspects: string[];
    casesSolved: string[];
    gameProgress: number;
}

// Case generation parameters
export interface CaseGenerationParams {
    difficulty: 'easy' | 'medium' | 'hard';
    theme?: string;
    location?: string;
    era?: string;
    language: 'en' | 'th';
}

// App state
export interface AppState {
    cases: Case[];
    clues: Clue[];
    suspects: Suspect[];
    interviews: Interview[];
    gameState: GameState;
}

// Response formats from LLM
export interface GeneratedCase {
    case: Case;
    clues: Clue[];
    suspects: Suspect[];
    solution: string;
}

export interface ClueAnalysis {
    summary: string;
    connections: {
        suspectId: string;
        connectionType: string;
        description: string;
    }[];
    nextSteps: string[];
}

export interface SuspectAnalysis {
    suspectId: string;
    trustworthiness: number; // 0-100
    inconsistencies: string[];
    connections: {
        clueId: string;
        connectionType: string;
        description: string;
    }[];
    suggestedQuestions: string[];
}

export interface CaseSolution {
    solved: boolean;
    culpritId: string;
    reasoning: string;
    evidenceIds: string[];
    narrative: string;
} 
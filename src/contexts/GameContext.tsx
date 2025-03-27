'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, Case, Clue, Suspect, Interview, GameState, ClueAnalysis } from '@/types/game';
import { defaultCases, defaultClues, defaultSuspects } from '@/data/defaultCases';
import { thCases, thClues, thSuspects } from '@/data/translatedCases';
import { useLanguage } from './LanguageContext';

// Initial state
const initialState: AppState = {
    cases: [...defaultCases],
    clues: [...defaultClues],
    suspects: [...defaultSuspects],
    interviews: [],
    gameState: {
        activeCase: null,
        discoveredClues: [],
        examinedClues: [],
        interviewedSuspects: [],
        casesSolved: [],
        gameProgress: 0,
        clueAnalyses: {},
        suspectInterviews: {},
    },
};

// Action types
type ActionType =
    | { type: 'ADD_CASE'; payload: Case }
    | { type: 'ADD_CLUES'; payload: Clue[] }
    | { type: 'ADD_SUSPECTS'; payload: Suspect[] }
    | { type: 'ADD_INTERVIEW'; payload: Interview }
    | { type: 'SET_ACTIVE_CASE'; payload: string }
    | { type: 'DISCOVER_CLUE'; payload: string }
    | { type: 'EXAMINE_CLUE'; payload: string }
    | { type: 'INTERVIEW_SUSPECT'; payload: string }
    | { type: 'SOLVE_CASE'; payload: string }
    | { type: 'RESET_GAME' }
    | { type: 'LOAD_GAME'; payload: AppState }
    | { type: 'SAVE_CLUE_ANALYSIS'; payload: { clueId: string, analysis: ClueAnalysis } }
    | { type: 'SAVE_SUSPECT_INTERVIEW'; payload: { suspectId: string, conversation: {question: string, answer: string, isCustom?: boolean}[] } };

// Reducer function
function gameReducer(state: AppState, action: ActionType): AppState {
    switch (action.type) {
        case 'ADD_CASE':
            return {
                ...state,
                cases: [...state.cases, action.payload],
            };

        case 'ADD_CLUES':
            return {
                ...state,
                clues: [...state.clues, ...action.payload],
            };

        case 'ADD_SUSPECTS':
            return {
                ...state,
                suspects: [...state.suspects, ...action.payload],
            };

        case 'ADD_INTERVIEW':
            return {
                ...state,
                interviews: [...state.interviews, action.payload],
            };

        case 'SET_ACTIVE_CASE':
            return {
                ...state,
                gameState: {
                    ...state.gameState,
                    activeCase: action.payload,
                },
            };

        case 'DISCOVER_CLUE':
            return {
                ...state,
                clues: state.clues.map(clue =>
                    clue.id === action.payload ? { ...clue, discovered: true } : clue
                ),
                gameState: {
                    ...state.gameState,
                    discoveredClues: [...state.gameState.discoveredClues, action.payload],
                    gameProgress: calculateProgress({
                        ...state.gameState,
                        discoveredClues: [...state.gameState.discoveredClues, action.payload],
                    }, state),
                },
            };

        case 'EXAMINE_CLUE':
            return {
                ...state,
                clues: state.clues.map(clue =>
                    clue.id === action.payload ? { ...clue, examined: true } : clue
                ),
                gameState: {
                    ...state.gameState,
                    examinedClues: [...state.gameState.examinedClues, action.payload],
                    gameProgress: calculateProgress({
                        ...state.gameState,
                        examinedClues: [...state.gameState.examinedClues, action.payload],
                    }, state),
                },
            };

        case 'INTERVIEW_SUSPECT':
            return {
                ...state,
                suspects: state.suspects.map(suspect =>
                    suspect.id === action.payload ? { ...suspect, interviewed: true } : suspect
                ),
                gameState: {
                    ...state.gameState,
                    interviewedSuspects: [...state.gameState.interviewedSuspects, action.payload],
                    gameProgress: calculateProgress({
                        ...state.gameState,
                        interviewedSuspects: [...state.gameState.interviewedSuspects, action.payload],
                    }, state),
                },
            };

        case 'SOLVE_CASE':
            return {
                ...state,
                cases: state.cases.map(c =>
                    c.id === action.payload ? { ...c, solved: true } : c
                ),
                gameState: {
                    ...state.gameState,
                    casesSolved: [...state.gameState.casesSolved, action.payload],
                    gameProgress: 100, // When case is solved, progress is 100%
                },
            };

        case 'RESET_GAME':
            return initialState;

        case 'LOAD_GAME':
            return action.payload;

        case 'SAVE_CLUE_ANALYSIS':
            return {
                ...state,
                gameState: {
                    ...state.gameState,
                    clueAnalyses: {
                        ...state.gameState.clueAnalyses,
                        [action.payload.clueId]: action.payload.analysis
                    }
                }
            };

        case 'SAVE_SUSPECT_INTERVIEW':
            return {
                ...state,
                gameState: {
                    ...state.gameState,
                    suspectInterviews: {
                        ...state.gameState.suspectInterviews,
                        [action.payload.suspectId]: action.payload.conversation
                    }
                }
            };

        default:
            return state;
    }
}

// Helper to calculate game progress
function calculateProgress(gameState: GameState, state: AppState): number {
    if (!gameState.activeCase) return 0;

    const activeCase = state.cases.find(c => c.id === gameState.activeCase);
    if (!activeCase) return 0;

    const caseClues = state.clues.filter(c => c.caseId === gameState.activeCase);
    const caseSuspects = state.suspects.filter(s => s.caseId === gameState.activeCase);

    const totalClues = caseClues.length;
    const totalSuspects = caseSuspects.length;

    const discoveredCluesCount = caseClues.filter(c =>
        gameState.discoveredClues.includes(c.id)
    ).length;

    const examinedCluesCount = caseClues.filter(c =>
        gameState.examinedClues.includes(c.id)
    ).length;

    const interviewedSuspectsCount = caseSuspects.filter(s =>
        gameState.interviewedSuspects.includes(s.id)
    ).length;

    // Weights for each activity
    const discoveryWeight = 0.3;
    const examinationWeight = 0.4;
    const interviewWeight = 0.3;

    // Calculate weighted progress
    const discoveryProgress = totalClues > 0 ? (discoveredCluesCount / totalClues) * discoveryWeight : 0;
    const examinationProgress = totalClues > 0 ? (examinedCluesCount / totalClues) * examinationWeight : 0;
    const interviewProgress = totalSuspects > 0 ? (interviewedSuspectsCount / totalSuspects) * interviewWeight : 0;

    const totalProgress = (discoveryProgress + examinationProgress + interviewProgress) * 100;

    return Math.min(Math.round(totalProgress), 99); // Cap at 99% until solved
}

// Create context
interface GameContextType {
    state: AppState;
    dispatch: React.Dispatch<ActionType>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { language } = useLanguage();

    // Effect to apply translations when language changes
    useEffect(() => {
        if (language === 'th') {
            // Apply Thai translations to cases, clues, and suspects
            const updatedCases = state.cases.map(c => ({
                ...c,
                ...thCases[c.id]
            }));

            const updatedClues = state.clues.map(c => ({
                ...c,
                ...thClues[c.id]
            }));

            const updatedSuspects = state.suspects.map(s => ({
                ...s,
                ...thSuspects[s.id]
            }));

            // Update the state with translated content
            dispatch({
                type: 'LOAD_GAME',
                payload: {
                    ...state,
                    cases: updatedCases,
                    clues: updatedClues,
                    suspects: updatedSuspects
                }
            });
        } else {
            // For English, reload the default data
            dispatch({
                type: 'LOAD_GAME',
                payload: {
                    ...state,
                    cases: [...defaultCases],
                    clues: [...defaultClues],
                    suspects: [...defaultSuspects]
                }
            });
        }
    }, [language]);

    // Load game from localStorage on initial mount
    useEffect(() => {
        const savedGame = localStorage.getItem('detective-game-state');
        if (savedGame) {
            try {
                const parsedState = JSON.parse(savedGame) as AppState;
                dispatch({ type: 'LOAD_GAME', payload: parsedState });
            } catch (e) {
                console.error('Failed to load saved game:', e);
                // If loading fails, start with a fresh game
            }
        }
    }, []);

    // Save game state to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('detective-game-state', JSON.stringify(state));
    }, [state]);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

// Hook to use the game context
export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
} 
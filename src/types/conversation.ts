export interface Conversation {
    attempted: boolean;
    attempts: number;
    conversationId: number;
    correct: boolean;
    correctAnswer: string | null;
    country: string;
    explanation: string | null;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    locked: boolean;
    nextConversationId: number | null;
    npcScript: string;
    options: string[] | null;
    place: string;
    question: string;
    topic: string;
}
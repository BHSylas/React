export interface Conversation {
    id: number;
    topic: string;
    place: string;
    npcScript: string;
    question: string;
    nextConversationId: number | null;
}
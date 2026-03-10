import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import type { Conversation } from "../../types/conversation";
import BeginnerAnswer from "./levels/BeginnerAnswer";
import IntermediateAnswer from "./levels/IntermediateAnswer";
import AdvancedAnswer from "./levels/AdvancedAnswer";

export default function AnswerBox({ conversation }: { conversation: Conversation; }) {
    const [explanation, setExplanation] = useState<string | null>(conversation.explanation);
    const [attemptsLeft, setAttemptsLeft] = useState<number>(Math.max(0, 3 - conversation.attempts));
    const [isCorrect, setIsCorrect] = useState<boolean>(conversation.correct);
    const [correctAnswer, setCorrectAnswer] = useState<string[] | null>(
        conversation.correctAnswer ? [conversation.correctAnswer] : null
    );
    useEffect(() => {
        console.log(conversation);
        api.get(`/user/npc/conversation/${conversation.conversationId}`).then(res => {
            const data = res.data;
            setExplanation(data.explanation);
            setAttemptsLeft(Math.max(0, 3 - data.attempts));
            setIsCorrect(data.correct);
            setCorrectAnswer(data.correctAnswer);
        }).catch(err => {
            console.error("Failed to fetch conversation details:", err);
        });
    }, []);
    const handleSubmit = (answer: string) => {
        const userAnswer = conversation.level === 'INTERMEDIATE'
            ? answer.split(" ")   // "I am a student" → ["I", "am", "a", "student"]
            : answer;
        console.log(`Submitted answer for conversation ${conversation.conversationId}: ${answer}`);
        api.post(`/user/answer/${conversation.conversationId}`,
            {
                userAnswer: userAnswer,
            }
        ).then(res => {
            console.log(res.data);
            if (res.data.correct) {
                alert("정답!");
                setIsCorrect(true);
                setCorrectAnswer(res.data.correctAnswer || [answer]);
            }
            else if (res.data.locked) {
                setExplanation(res.data.explanation);
                setIsCorrect(false);
                setAttemptsLeft(0);
                alert("기회를 모두 소모하였습니다.");
            }
            else {
                const currentAttempt = res.data.attempts; // 시도한 횟수
                const remaining = Math.max(0, 3 - currentAttempt); // 횟수 제한
                setAttemptsLeft(remaining)
                alert(`오답입니다. (현재 ${currentAttempt} / 3회 시도) \n다시 한 번 도전하세요!`);
            }
        }).catch(err => {
            console.error("Failed to submit answer:", err);
            alert("답변을 제출하는 동안 오류가 발생했습니다. 다시 시도해 주세요.");
        });
    }
    const handleOptionSelect = (option: string) => {
        console.log(`Selected option for conversation ${conversation.conversationId}: ${option}`);
        handleSubmit(option);
    }
    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col text-center gap-2 rounded-lg bg-base-100 min-w-64 p-3">
                <div className="flex flex-col">
                    <p className="">{conversation.topic}</p>
                    <p className="text-xl font-bold">{conversation.question.replace(/\[.*?\]/g, "___")}</p>
                    <p className="text-sm opacity-70">{isCorrect ? `정답: ${correctAnswer?.join(", ")}` : `남은 기회: ${attemptsLeft}`}</p>
                    {explanation && (
                        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                            <p className="font-bold">Explanation:</p>
                            <p>{explanation}</p>
                        </div>
                    )}
                </div>
                {(attemptsLeft > 0 && !isCorrect) && <div>
                    {LevelSwitcher(conversation.level, conversation.options, handleOptionSelect)}
                </div>}
            </div>
        </div>
    );
}

function LevelSwitcher(level: string, options: string[] | null, onOptionSelect: (option: string) => void) {
    switch (level.toUpperCase()) {
        case "BEGINNER":
            return <BeginnerAnswer options={options} onOptionSelect={onOptionSelect} />;
        case "INTERMEDIATE":
            return <IntermediateAnswer options={options} onOptionSelect={onOptionSelect} />;
        case "ADVANCED":
            return <AdvancedAnswer onOptionSelect={onOptionSelect} />;
        default:
            return null;
    }
}
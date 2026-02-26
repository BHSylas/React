import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import type { Conversation } from "../../types/conversation";

export default function AnswerBox({ conversation }: { conversation: Conversation; }) {
    const [answer, setAnswer] = useState<string>("");
    const [explanation, setExplanation] = useState<string | null>(conversation.explanation);
    const [attemptsLeft, setAttemptsLeft] = useState<number>(Math.max(0, 3 - conversation.attempts));
    const [isCorrect, setIsCorrect] = useState<boolean>(conversation.correct);
    const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
    useEffect(() => {
        api.get(`user/npc/conversation/${conversation.conversationId}`).then(res => {
            const data = res.data;
            setExplanation(data.explanation);
            setAttemptsLeft(Math.max(0, 3 - data.attempts));
            setIsCorrect(data.correct);
            setCorrectAnswer(data.correctAnswer);
            console.log("Fetched conversation details:", data);
        }).catch(err => {
            console.error("Failed to fetch conversation details:", err);
        });
    }, []);
    const handleSubmit = () => {
        console.log(`Submitted answer for conversation ${conversation.conversationId}: ${answer}`);
        api.post(`/user/answer/${conversation.conversationId}`,
            {
                userAnswer: answer,
            }
        ).then(res => {
            console.log("Answer submission response:", res.data);
            if(res.data.correct) {
                alert("Correct answer!");
                setIsCorrect(true);
            }
            else if(res.data.locked) {
                setExplanation(res.data.explanation);
                alert("No more attempts allowed for this question... Better luck next time!");
            }
            else {
                setAttemptsLeft(Math.max(0, 3 - res.data.attempts));
                alert("Wrong answer. Try again!");
            }
        }).catch(err => {
            console.error("Failed to submit answer:", err);
            alert("An error occurred while submitting your answer. Please try again.");
        });
    }
    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col text-center gap-2 rounded-lg bg-base-100 min-w-64 p-3">
                <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-center">Answer Box</h3>
                    <p className="text-3xl font-bold">{conversation.question}?</p>
                    <p className="">{conversation.topic}</p>
                    <p className="text-sm opacity-70">{isCorrect ? `정답: ${correctAnswer?.join(", ")}` : `남은 기회: ${attemptsLeft}`}</p>
                    {explanation && (
                        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                            <p className="font-bold">Explanation:</p>
                            <p>{explanation}</p>
                        </div>
                    )}
                </div>
                {(attemptsLeft > 0 && !isCorrect) && <div>
                    <input 
                    type="text" 
                    placeholder="Enter your answer" 
                    className="text-sm input input-bordered w-full max-w-xs" 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    />
                    <button className="btn btn-primary mt-2" onClick={() => handleSubmit()}>Submit</button>
                </div>}
            </div>
        </div>
    );
}
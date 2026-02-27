import { useState } from "react";

export default function AdvancedAnswer({ onOptionSelect }: { onOptionSelect: (option: string) => void; }) {
    const [answer, setAnswer] = useState<string>("");
        return (
            <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="flex gap-4">
                    <input type="text" placeholder="Enter your answer" className="input input-bordered w-full max-w-xs" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                </div>
                <button className="px-4 py-2 font-bold text-green-800 rounded hover:scale-105 transition" onClick={() => onOptionSelect(answer)}>
                    Submit
                </button>
            </div>
        );
}
import { useState } from "react";

export default function IntermediateAnswer({ options, onOptionSelect }: { options: string[] | null, onOptionSelect: (option: string) => void }) {
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

    const handleOptionToggle = (index: number) => {
        setSelectedIndexes((prev) => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    if (!options) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-lg font-bold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <p className="text-blue-500 font-medium italic">"순서대로 선택하여 문장을 만드세요."</p>

            {/* 선택 순서 미리보기 */}
            {selectedIndexes.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-center">
                    {selectedIndexes.map((idx, order) => (
                        <span key={order} className="px-3 py-1 bg-green-100 text-green-800 rounded font-bold text-sm">
                            {order + 1}. {options[idx]}
                        </span>
                    ))}
                </div>
            )}

            {/* 보기 목록 */}
            <div className="flex gap-4 flex-wrap justify-center">
                {options.map((option, index) => {
                    const orderIndex = selectedIndexes.indexOf(index);
                    const isSelected = orderIndex !== -1;

                    return (
                        <div key={index} className="relative">
                            <button
                                className={`px-4 py-2 rounded transition ${isSelected
                                    ? 'bg-green-600 text-white'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                onClick={() => handleOptionToggle(index)}
                            >
                                {option}
                            </button>
                            {isSelected && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    {orderIndex + 1}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                className="px-4 py-2 font-bold text-green-800 border border-green-600 rounded hover:scale-105 transition disabled:opacity-40"
                disabled={selectedIndexes.length === 0}
                onClick={() => onOptionSelect(selectedIndexes.map(i => options[i]).join(" "))}
            >
                Submit
            </button>
        </div>
    );
}
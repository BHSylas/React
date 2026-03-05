import React, { useState, type KeyboardEvent, type ChangeEvent } from "react";

interface TestAnswerProps {
    onAnswersChange?: (newList: string[]) => void;
    savedOptions?: string[];
}

const TestAnswer: React.FC<TestAnswerProps> = ({ onAnswersChange, savedOptions = [] }) => {
    const [inputValue, setInputValue] = useState<string>(''); // 입력중인 단어

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }; // 타이핑할 때 마다 상태 업데이트

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const newValue = inputValue.trim();
            if (savedOptions.includes(newValue)) {
                alert("이미 등록된 단어입니다.");
                return;
            }
            onAnswersChange?.([...savedOptions, newValue]);
            setInputValue('');
        }
    }; // 엔터를 치면 단어 목록으로 만듬(공백은 제외) 이후 입력창 비움

    const handleDelete = (indexToDelete: number) => {
        onAnswersChange?.(savedOptions.filter((_, index) => index !== indexToDelete));
    };

    const handleReset = () => {
        if (savedOptions.length > 0 && window.confirm('전체 목록을 삭제하시겠습니까?')) {
            onAnswersChange?.([]);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="단어 입력 후 엔터를 누르세요"
                        className="w-full h-[50px] px-5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium shadow-sm placeholder:text-gray-300"
                    />
                </div>
                <button
                    onClick={handleReset}
                    className="h-[50px] px-6 rounded-xl bg-white text-red-500 border border-red-100 font-bold text-sm hover:bg-red-50 transition-all active:scale-95"
                >
                    전체 초기화
                </button>
            </div>

            <div className="min-h-[80px] p-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
                {savedOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {savedOptions.map((word, index) => (
                            <div key={`${word}-${index}`} className="flex items-center gap-2 pl-4 pr-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <span className="text-sm font-bold text-gray-700">{word}</span>
                                <button onClick={() => handleDelete(index)} className="w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-300 text-center py-4">등록된 단어가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default TestAnswer;
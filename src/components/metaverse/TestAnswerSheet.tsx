import React, { useState, type KeyboardEvent, type ChangeEvent, useEffect } from "react";

interface TestAnswerProps {
    onAnswersChange? : (newList: string[]) => void;
    savedOptions? : string[];
}

const TestAnswer: React.FC<TestAnswerProps> = ({onAnswersChange, savedOptions}) => {
    const [inputValue, setInputValue] = useState<string>(''); // 입력중인 단어
    const [wordList, setWordList] = useState<string[]>(savedOptions || []); // 등록된 단어

    useEffect(() => {
        if(savedOptions) {
            setWordList(savedOptions);
        }
    }, [savedOptions]);
    
    useEffect(() => {
        onAnswersChange?.(wordList);
    }, [wordList, onAnswersChange]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }; // 타이핑할 때 마다 상태 업데이트

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            if(wordList.includes(inputValue.trim())) {
                alert("이미 등록된 단어입니다.");
                return;
            }
            setWordList([...wordList, inputValue.trim()]);
            setInputValue('');
        }
    }; // 엔터를 치면 단어 목록으로 만듬(공백은 제외) 이후 입력창 비움

    const handleDelete = (indexToDelete: number) => {
        setWordList(wordList.filter((_, index) => index !== indexToDelete));
    };

    const handleReset = () => {
        if (wordList.length > 0 && window.confirm('전체 목록을 삭제하시겠습니까?')) {
            setWordList([]);
        }
    };

    return (
        <div>
            <div className="flex items-center mb-3">
                <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="단어 입력 후 엔터" className="w-[1130px] h-[40px] pr-3 pl-3 font-lg rounded-md border border-solid border-gray-500"/>
                <button onClick={handleReset} className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700  ml-5">전체 초기화</button>
            </div>

            {wordList.length > 0 ? (
                <ol> {wordList.map((word, index) => (
                    <li key={`${word}-${index}`}>
                        {word}
                        <button onClick={() => handleDelete(index)} className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700 ml-5 mb-5">삭제</button>
                    </li>
                ))}
                </ol>
            ) : (
                <p>목록이 비어있습니다.</p>
            )}
        </div>
    );
};

export default TestAnswer;
import { useState } from "react";
import { MAX_ATTEMPS } from "./testConstants";

export function useTestLogic(data: any) {
    const [userChoice, setUserChoice] = useState<string | string[]> (
        data?.level === 'INTERMEDIATE' ? [] : ''
    );
    const [attempts, setAttempts] = useState(0); // 문제 풀기 시도 횟수
    const [showResult, setShowResult] = useState(false); // 정답 해설 표시
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // 답을 맞췄는지 오답인지

    const handleSubmit = () => {
        let correct = false;

        if(data.level === 'INTERMEDIATE' && Array.isArray(data.answers)) { //중급 & 다중 선택지일 경우
            const choiceArray = userChoice as string[];
            
            correct = data.answers.length === choiceArray.length && 
            choiceArray.every(val => data.answers.includes(val)); // 답 개수 확인, 선택한 답이 실제 답에 포함되었는지 체크
        } else if(data.level === 'ADVANCED') {
            const processedUserAnswer = (userChoice as string).trim().replace(/\s+/g, ' ');
            const processedCorrectAnswer = (data.answers as string).trim().replace(/\s+/g, '');

            correct = processedUserAnswer === processedCorrectAnswer;
        }
        else {
            correct = data.answers === userChoice; // 초급, 중급 다중 선택이 아닐 경우
        }

        if(correct) {
            setIsCorrect(true);
            setShowResult(true);
            alert("정답 확인");
        }
        else {
            const nextAttempts = attempts +1;
            setAttempts(nextAttempts);

            if (nextAttempts >= MAX_ATTEMPS) {
                setIsCorrect(false);
                setShowResult(true);
                alert(`${MAX_ATTEMPS}번 기회 다 사용, 이 경우 오답처리 됩니다.`);
            }
            else {
                alert(`오답 확인 (남은 기회: ${MAX_ATTEMPS - nextAttempts} / ${MAX_ATTEMPS}번)`)
            }
        }
    };

    return {
        userChoice,
        setUserChoice,
        attempts,
        showResult,
        isCorrect,
        handleSubmit,
        maxAttempts: MAX_ATTEMPS,
        remainingAttempts: MAX_ATTEMPS - attempts
    };
}
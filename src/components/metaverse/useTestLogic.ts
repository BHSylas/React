import { useEffect, useState } from "react";
import { MAX_ATTEMPS } from "./testConstants";

export function useTestLogic(data: any) {
    const [userChoice, setUserChoice] = useState<string | string[]>([]);
    const [attempts, setAttempts] = useState(0); // 문제 풀기 시도 횟수
    const [showResult, setShowResult] = useState(false); // 정답 해설 표시
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // 답을 맞췄는지 오답인지

    useEffect(() => {
        if (data) {
            console.log(data);
            setUserChoice(data.level === 'INTERMEDIATE' ? [] : '');
        }
    }, [data]);

    const handleSubmit = () => {
        if (!data) return;
        let correct = false;

        if (data.level === 'INTERMEDIATE' && Array.isArray(data.answers)) { //중급 & 다중 선택지일 경우
            const choiceArray = userChoice as string[];

            correct = data.answers.length === choiceArray.length &&
                data.answers.every((val: string, idx: number) => val === choiceArray[idx]);
        } else if (data.level === 'ADVANCED') {
            // 1. 사용자 입력: 양 끝 공백만 제거 (문장 안의 공백은 유지)
            const processedUserAnswer = (userChoice as string).trim();

            // 2. 실제 정답: 데이터베이스의 정답도 양 끝 공백만 제거하여 비교 대상 일치
            const correctAnswer = Array.isArray(data.answers) ? data.answers[0] : data.answers;
            const processedCorrectAnswer = (correctAnswer as string).trim();

            // 중간 공백이 있을 경우 공백이 있어야 정답처리
            correct = processedUserAnswer === processedCorrectAnswer;
        }
        else {
            const correctAnswer = Array.isArray(data.answers) ? data.answers[0] : data.answers;
            correct = String(correctAnswer) === String(userChoice); // 초급, 중급 다중 선택이 아닐 경우
        }

        if (correct) {
            setIsCorrect(true);
            setShowResult(true);
            alert("정답 확인");
        }
        else {
            const nextAttempts = attempts + 1;
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
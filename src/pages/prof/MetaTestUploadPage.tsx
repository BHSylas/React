import TestAnswer from '../../components/metaverse/TestAnswerSheet';
import NpcInput from '../../components/metaverse/NpcInput';
import NpcPreview from '../../components/metaverse/NpcPreview';
import { type ChangeEvent, useCallback, useState } from 'react';
import UserInput from '../../components/metaverse/UserInput';
import UserPreview from '../../components/metaverse/UserPreview';

export function MetaTestUpload() {
    // // NPC 대사 출력
    // const [npcDialogue, setNpcDialogue] = useState<string>('');
    // const handleDialogueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //     setNpcDialogue(e.target.value);
    // };
    // // 캐릭터 대사 출력(정답이 아닌 칸, 고급에 경우 안 써도 괜찮도록)
    // const [charaText, setCharaText] = useState<string>('');
    // const handleCharaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //     setCharaText(e.target.value);
    // };

    // const [answers, setAnswers] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        lectureId: 1, // 강의 id 임의 값
        country: 'USA',
        place: 'CONVENIENCE_STORE',
        level: 'BEGINNER',
        npcScript: '',
        question: '',
        answers: '',
        options: [] as string[],
        explanation: '',
        nextConversationId: null,
        topic: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'level' ? { answers: '' } : {})
        }));
    };

    const handleOptionsChange = useCallback((newList: string[]) => {
        setFormData(prev => {
            if (JSON.stringify(prev.options) === JSON.stringify(newList)) {
                return prev;
            }
            return { ...prev, options: newList }
        });
    }, []);

    const handleSave = async () => {

        let finalAnswers: string[] = [];

        if(Array.isArray(formData.answers)) {
            finalAnswers = formData.answers;
        }
        else if(typeof formData.answers === 'string' && formData.answers.trim() !== '') {
            finalAnswers = formData.answers.split(',').map(a => a.trim()).filter(a => a !== '');
        }

        const payload = {
            lectureId: formData.lectureId,
            country: formData.country,
            place: formData.place,
            level: formData.level,
            npcScript: formData.npcScript,
            question: formData.question,
            answers: finalAnswers,
            options: formData.options,
            explanation: formData.explanation,
            topic: formData.topic,
            nextConversationId: formData.nextConversationId
        };

        const token = localStorage.getItem("token");

        console.log("전송될 DTO 데이터: ", payload);
        try {
            const response = await fetch('/api/professor/npc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) alert("업로드 성공!");
        } catch (error) {
            console.error("업로드 중 오류: ", error);
        }
    };


    return (
        <main>
            <div className="w-full grid-cols-1 justify-start items-center m-auto">
                <div className='w-full mb-8 mt-5'>
                    <h3 className='text-2xl font-bold text-blue-800 mb-5'>강의 명</h3>
                    <input className='w-full h-[35px] border border-solid border-neutral-800 rounded-md outline-none' readOnly></input>
                </div>
                <div className='w-full mb-8'>
                    <h3 className='text-2xl font-bold mb-5'>테스트 정보</h3>
                    <div className="w-full h-auto flex justify-evenly items-center border-y-2 border-neutral-800 flex justify-start items-center pt-5 pb-5 pl-3 pr-3">
                        {/* <div>
                            <label className='font-bold'>교수 성함</label>
                            <input className='outline-none text-center' readOnly placeholder='성함'></input>
                        </div> */}
                        {/* <div>
                            <label className='font-bold mr-3'>분야</label>
                            <select className="text-center border border-gray-500 rounded-md pl-1 pr-1">
                                <option value="en">영어</option>
                                <option value="jp">일본어</option>
                                <option value="cn">중국어</option>
                                <option value="de">독일어</option>
                                <option value="it">이탈리아어</option>
                            </select>
                        </div> */}
                        <div>
                            <label className='font-bold mr-3'>국가</label>
                            <select name='country' value={formData.country} onChange={handleInputChange} className="text-center border border-gray-500 rounded-md pl-1 pr-1">
                                <option value="USA">미국</option>
                                <option value="JAPAN">일본</option>
                                <option value="CHINA">중국</option>
                                <option value="GERMANY">독일</option>
                                <option value="ITALY">이탈리아</option>
                            </select>
                        </div>
                        <div>
                            <label className='font-bold mr-3'>장소</label>
                            <select name="place" value={formData.place} onChange={handleInputChange} className="text-center border border-gray-500 rounded-md pl-1 pr-1">
                                <option value="CONVENIENCE_STORE">편의점</option>
                                <option value="CAPE">카페</option>
                                <option value="TRAIN_STATION">대중교통</option>
                                <option value="AIRPORT">공항</option>
                                <option value="HOTEL">호텔</option>
                                <option value="MARKET">시장</option>
                                <option value="RESTAURANT">레스토랑</option>
                                <option value="SCHOOL">학교</option>
                            </select>
                        </div>
                        <div>
                            <label className='font-bold mr-3'>난이도</label>
                            <select name="level" value={formData.level} onChange={handleInputChange} className="text-center border border-gray-500 rounded-md pl-1 pr-1">
                                <option value="BEGINNER">초급</option>
                                <option value="INTERMEDIATE">중급</option>
                                <option value="ADVANCED">고급</option>
                            </select>
                        </div>
                        <div>
                            <label className='font-bold mr-3'>주제</label>
                            <input name='topic' value={formData.topic} onChange={handleInputChange}
                                placeholder='예: 음식 주문하기' className='border border-gray-500 rounded-md pl-2 pr-2 h-[30px]' />
                        </div>
                    </div>
                </div>
                <NpcPreview text={formData.npcScript} />
                <UserPreview text={formData.question} />
                <div>
                    <NpcInput
                        name="npcScript"
                        value={formData.npcScript}
                        onChange={handleInputChange}
                    />
                    <UserInput
                        name="question"
                        value={formData.question}
                        onChange={handleInputChange}
                    />
                    <div className='w-full mb-8'>
                        <h3 className='text-2xl font-bold mb-5'>답 목록</h3>
                        <div className="w-full h-auto border-y-2 border-neutral-800 flex justify-start items-center pt-5 pb-5 pl-3 pr-3">
                            <TestAnswer onAnswersChange={handleOptionsChange} />
                        </div>
                    </div>
                    <div className='w-full mb-8'>
                        <h3 className='text-2xl font-bold mb-5'>정답</h3>
                        {formData.level === 'BEGINNER' && (
                            <div className='flex flex-wrap gap-4 p-4 border rounded-md'>
                                {formData.options.length > 0 ? (
                                    formData.options.map((opt, idx) => (
                                        <label key={idx} className='flex items-center gap-2 cursor-pointer'>
                                            <input type='radio' name='answers' value={opt}
                                                checked={formData.answers === opt} onChange={handleInputChange} />
                                            <span>{opt}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className='text-gray-500'>답 목록을 추가해주세요.</p>
                                )}
                            </div>
                        )}
                        {formData.level === 'INTERMEDIATE' && (
                            <div className="flex flex-wrap gap-4 p-4 border rounded-md">
                                {formData.options.map((opt, idx) => (
                                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.answers.split(',').includes(opt)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setFormData(prev => {
                                                    const currentAnswers = prev.answers ? prev.answers.split(',') : [];
                                                    const newAnswers = isChecked
                                                        ? [...currentAnswers, opt]
                                                        : currentAnswers.filter(a => a !== opt);
                                                    return { ...prev, answers: newAnswers.join(',') };
                                                });
                                            }}
                                        />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {formData.level === 'ADVANCED' && (
                            <textarea
                                name="answers"
                                value={formData.answers}
                                onChange={handleInputChange}
                                placeholder="직접 정답을 입력하세요 (고급 난이도)"
                                className="w-full min-h-[100px] box-border border border-black rounded-md p-3 resize-none leading-[1.5] [field-sizing:content]"
                            />
                        )}
                    </div>
                    <div className='w-full mb-8'>
                        <h3 className='text-2xl font-bold mb-5'>해설</h3>
                        <textarea
                            name="explanation"
                            value={formData.explanation}
                            onChange={handleInputChange}
                            className="w-full min-h-[100px] box-border border border-black rounded-md p-3 resize-none leading-[1.5] [field-sizing:content]"></textarea>
                    </div>
                </div>
                <div className='w-full mb-8 flex justify-end'>
                    <button onClick={handleSave} className="rounded-md bg-blue-800 p-2 text-white hover:bg-blue-900">업로드</button>
                    <button className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700  ml-5">취소</button>
                </div>
            </div>
        </main >
    )
}
import TestAnswer from '../../components/metaverse/TestAnswerSheet';
import NpcInput from '../../components/metaverse/NpcInput';
import NpcPreview from '../../components/metaverse/NpcPreview';
import { type ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import UserInput from '../../components/metaverse/UserInput';
import UserPreview from '../../components/metaverse/UserPreview';
import { useLocation, useNavigate } from 'react-router';
import { useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const INITIAL_FORM = {
    lectureId: 1, // 강의 id 임의 값
    country: 'USA',
    place: 'CONVENIENCE_STORE',
    level: 'BEGINNER',
    npcScript: '',
    question: '',
    answers: [] as string[],
    options: [] as string[],
    explanation: '',
    nextConversationId: null as number | null,
    topic: '',
};

export function MetaTestUpload() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [candidateList, setCandidateList] = useState<any[]>([]); // 연결 가능한 문제 업로드 목록
    const [currentSavedId, setCurrentSavedId] = useState<number | null>(null); // 연결하는 문제 ID

    const { id } = useParams<{ id: string }>(); //url에서 id추출
    const location = useLocation();
    const navigate = useNavigate();

    const role = useContext(AuthContext).role;
        if(role === '0') {
            alert("No exception!");
            navigate('/');
        }

    // 수정모드 여부 확인
    const editData = location.state?.editData;
    const isEdit = !!id;

    const token = localStorage.getItem('token');

    // 수정 시 데이터 채워넣기
    useEffect(() => {
        if (isEdit && id) {
            const numbericId = Number(id);
            setCurrentSavedId(numbericId)
            if (editData) {
                setFormData({
                    ...INITIAL_FORM,
                    ...editData,
                    answers: Array.isArray(editData.answers)
                        ? editData.answers              // 배열이면 그대로 사용
                        : [editData.answers].filter(Boolean) // 문자열이면 배열로 감싸고, null/undefined 제거
                });
                setCurrentSavedId(Number(id));
                fetchCandidates(Number(id));
            } else {
                axios.get(`/api/professor/npc/list/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    const data = res.data;
                    setFormData({
                        ...INITIAL_FORM,
                        ...data,
                        answers: Array.isArray(data.answers)
                            ? data.answers
                            : [data.answers].filter(Boolean)
                    });
                    setCurrentSavedId(Number(id));
                    fetchCandidates(Number(id));
                }).catch(err => console.error("데이터 로드 실패:", err));
            }
        }
    }, [id, isEdit, editData]);

    const fetchCandidates = (id: number) => {
        axios.get(`/api/professor/npc/next-candidates/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (!res) throw new Error("문제 목록 업로드 실패");
            if (res.data) {
                setCandidateList(res.data || []);
                console.log("불러온 목록: ", res.data);
            }
        }).catch(err => console.error("문제 목록 로드 실패: ", err))
    };

    const handleConnectNext = (targetNextId: string) => {
        if (!currentSavedId) return alert("연결한 문제가 없습니다");

        const nextId = targetNextId === "" ? null : Number(targetNextId);

        axios.put(`/api/professor/npc/next/${currentSavedId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { nextConversationId: nextId }
        }).then(() => {
            alert("문제 연결이 완료되었습니다.");
            setFormData(prev => ({ ...prev, nextConversationId: nextId }));
        }).catch(err => {
            console.log("연결 실패: ", err);
            alert("연결 중 오류가 발생했습니다.");
        });

        setFormData(prev => ({
            ...prev,
            nextConversationId: nextId
        }));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'level' ? { answers: [] } : {})
        }));
    };

    const handleOptionsChange = useCallback((newList: string[]) => {
        setFormData(prev => ({
            ...prev, options: newList
        }));
    }, []);

    const handleSave = async () => {
        if (!formData.npcScript && !formData.question) {
            return alert("NPC 대사 또는 질문을 입력해주세요.");
        }

        try {
            let processedAnswers = Array.isArray(formData.answers) ? formData.answers.filter(a => a.trim() !== "") : [];

            // INTERMEDIATE 난이도인 경우 공백으로 구분된 문자열 추가
            if (formData.level === 'INTERMEDIATE' && processedAnswers.length > 0) {
                processedAnswers = [...processedAnswers, processedAnswers.join(" ")];
            }

            const payload = {
                ...formData,
                lectureId: Number(formData.lectureId),
                options: Array.isArray(formData.options) ? formData.options.filter(a => a.trim() !== "") : [],
                answers: processedAnswers,
                nextConversationId: formData.nextConversationId,
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }, withCredentials: true
            };

            console.log("서버로 보내는 최종 데이터:", payload);

            if (isEdit) {
                await axios.put(`/api/professor/npc/update/${id}`, payload, config);
                alert("수정되었습니다.");
                navigate(-1); // 전페이지
                return;
            }
            else {
                const res = await axios.post('/api/professor/npc', payload, config);

                if (res && res.data) {
                    const newId = res.data.id;
                    setCurrentSavedId(newId);
                    alert("업로드 되었습니다.");
                    setFormData(INITIAL_FORM);
                    fetchCandidates(newId);
                }
            }
        } catch (error: any) {
            if (error.response) {
                console.log("에러 상태: ", error.response.status);
                console.log("에러 데이터: ", error.response.data);
            }
            console.error("업로드 중 오류: ", error);
            alert("업로드 중 오류가 발생했습니다.");
        }
    };

    return (
        <main>
            <div className="w-full grid-cols-1 justify-start items-center m-auto">
                <div className='w-full mb-8'>
                    <h3 className='text-2xl font-bold mb-5'>테스트 정보</h3>
                    <div className="w-full h-auto flex justify-evenly items-center border-y-2 border-neutral-800 flex justify-start items-center pt-5 pb-5 pl-3 pr-3">
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
                            <TestAnswer
                                onAnswersChange={handleOptionsChange}
                                savedOptions={formData.options} />
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
                                                checked={formData.answers[0] === opt}
                                                onChange={() => setFormData(prev => ({ ...prev, answers: [opt] }))} />
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
                                            checked={formData.answers.includes(opt)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setFormData(prev => {
                                                    const currentAnswers = Array.isArray(formData.answers)
                                                        ? prev.answers : [];
                                                    const newAnswers = isChecked
                                                        ? [...currentAnswers, opt]
                                                        : currentAnswers.filter(a => a !== opt);
                                                    return { ...prev, answers: newAnswers };
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
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData(prev => ({ ...prev, answers: [val] }));
                                }}
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
                    <div className="flex gap-4 items-center w-full mb-8">
                        <div className={`w-full mb-8 p-5 border-2 rounded-md ${currentSavedId ? 'border-blue-500' : 'border-gray-300'}`}>
                            <h3 className='text-xl font-bold mb-4'>
                                다음 문제 연결 {currentSavedId && <span className='text-sm font-normal'>(현재 문제 ID: {currentSavedId})</span>}
                            </h3>

                            <div className="flex gap-4 items-center">
                                <select
                                    disabled={!currentSavedId}
                                    className="border p-2 rounded-md flex-1"
                                    onChange={(e) => handleConnectNext(e.target.value)}
                                    value={formData.nextConversationId ?? ""}
                                >
                                    <option value="">연결할 문제 선택 (없음)</option>
                                    {Array.isArray(candidateList) && candidateList.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.topic || '주제 없음'} - {item.npcScript?.substring(0, 20)}...
                                        </option>
                                    ))}
                                </select>
                                {!currentSavedId && <p className='text-red-500 text-sm'>먼저 문제를 업로드해야 연결이 가능합니다.</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mb-8 flex justify-end gap-4'>
                    <button
                        onClick={handleSave}
                        className="bg-blue-800 px-5 py-2 rounded-md text-white font-bold hover:bg-blue-900">
                        업로드
                    </button>
                    <button onClick={() => { if (confirm("초기화하시겠습니까?")) setFormData(INITIAL_FORM); }}
                        className="bg-red-500 px-5 py-2 rounded-md text-white font-bold hover:bg-red-600">
                        초기화
                    </button>
                </div>
            </div>
        </main >
    )
}
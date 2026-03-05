import { type ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import axios from 'axios';

import TestAnswer from '../../components/metaverse/TestAnswerSheet';
import NpcInput from '../../components/metaverse/NpcInput';
// import NpcPreview from '../../components/metaverse/NpcPreview';
import UserInput from '../../components/metaverse/UserInput';
// import UserPreview from '../../components/metaverse/UserPreview';
import { AuthContext } from '../../context/AuthContext';

interface Lecture {
    lectureId: number;
    title: string;
}

const INITIAL_FORM = {
    lectureId: '' as string | number,
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
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [candidateList, setCandidateList] = useState<any[]>([]);
    const [currentSavedId, setCurrentSavedId] = useState<number | null>(null);

    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { role } = useContext(AuthContext);

    const token = localStorage.getItem('token');
    const editData = location.state?.editData;
    const isEdit = !!id;

    useEffect(() => {
        if (role === '0') {
            alert("접근 권한이 없습니다.");
            navigate('/');
        }
    }, [role, navigate]);

    // 강의 목록 로드
    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const res = await axios.get('/api/instructor/lectures', { // 경로 통일 제안
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: 0, size: 100, status: 'ALL' }
                });
                setLectures(res.data);

                if (res.data && res.data.content) {
                    setLectures(res.data.content);

                    // 등록 모드일 때 첫 번째 강의를 기본값으로 설정
                    if (!id && res.data.content.length > 0) {
                        setFormData(prev => ({ ...prev, lectureId: res.data.content[0].lectureId }));

                    }
                } else if (Array.isArray(res.data)) {
                    // 혹시라도 나중에 배열로 바뀔 경우를 대비한 방어 코드
                    setLectures(res.data);
                }
            } catch (err) {
                console.error("강의 목록 로드 실패:", err);
            }
        };

        if (token && role !== '0') fetchLectures();
    }, [token, id, role]);

    // 수정 모드 데이터 로드 로직
    useEffect(() => {
        if (isEdit && id) {
            const numericId = Number(id);
            setCurrentSavedId(numericId);

            if (editData) {
                setFormData({
                    ...INITIAL_FORM,
                    ...editData,
                    answers: Array.isArray(editData.answers)
                        ? editData.answers
                        : [editData.answers].filter(Boolean)
                });
                fetchCandidates(numericId);
            } else {
                axios.get(`/api/professor/npc/list/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => {
                    const data = res.data;
                    setFormData({
                        ...INITIAL_FORM,
                        ...data,
                        answers: Array.isArray(data.answers)
                            ? data.answers
                            : [data.answers].filter(Boolean)
                    });
                    fetchCandidates(numericId);
                }).catch(err => console.error("데이터 로드 실패:", err));
            }
        }
    }, [id, isEdit, editData, token]);

    // 강의 연결 목록
    const fetchCandidates = (targetId: number) => {
        axios.get(`/api/professor/npc/next-candidates/${targetId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            if (res.data) {
                setCandidateList(res.data);
            }
        }).catch(err => console.error("연결 후보 로드 실패: ", err));
    };

    // 문제 저장
    const handleConnectNext = (targetNextId: string) => {
        if (!currentSavedId) return alert("저장된 문제가 없습니다.");

        const nextId = targetNextId === "" ? null : Number(targetNextId);

        axios.put(`/api/professor/npc/next/${currentSavedId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            params: { nextConversationId: nextId }
        }).then(() => {
            alert("문제 연결이 완료되었습니다.");
            setFormData(prev => ({ ...prev, nextConversationId: nextId }));
        }).catch(err => {
            console.error("연결 실패: ", err);
            alert("연결 중 오류가 발생했습니다.");
        });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // 난이도 변경 시 정답 초기화
            ...(name === 'level' ? { answers: [] } : {})
        }));
    };

    const handleOptionsChange = useCallback((newList: string[]) => {
        setFormData(prev => ({ ...prev, options: newList }));
    }, []);

    const handleSave = async () => {

        if (!formData.npcScript && !formData.question) {
            return alert("NPC 대사 또는 질문을 입력해주세요.");
        }

        try {
            let processedAnswers: string[] = [];

            if (formData.level === 'BEGINNER') {
                processedAnswers = formData.answers;
            } else if (formData.level === 'INTERMEDIATE') {
                if (formData.answers.length > 0) {
                    processedAnswers = formData.answers.filter(a => a && String(a).trim() !== "");
                }
            } else if (formData.level === 'ADVANCED') {
                processedAnswers = formData.answers
                    .map(a => String(a).trim()) // 앞뒤 공백만 제거 (문장 안의 공백은 유지됨)
                    .filter(a => a !== ""); // 빈 입력 방지
            }

            // 서버 전송 전 최종 체크
            if (processedAnswers.length === 0) {
                return alert("정답을 입력하거나 선택해주세요. (고급은 문장 입력 필수)");
            }

            const payload = {
                ...formData,
                lectureId: Number(formData.lectureId),
                options: Array.isArray(formData.options) ? formData.options.filter(a => a.trim() !== "") : [],
                answers: processedAnswers,
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            };

            if (isEdit) {
                await axios.put(`/api/professor/npc/update/${id}`, payload, config);
                alert("수정되었습니다.");
                navigate(-1);
            } else {
                const res = await axios.post('/api/professor/npc', payload, config);
                // 기본 null 상태
                let newSavedId = null;

                if (typeof res.data === 'number') {
                    newSavedId = res.data; // 서버 응답이 number인 경우
                } else if (res.data && (res.data.lectureId || res.data.id)) {
                    newSavedId = res.data.lectureId || res.data.id; // 서버 응답이 string인 경우
                }

                // DB 저장이 성공했을 때 실행
                if (newSavedId) {
                    setCurrentSavedId(newSavedId);
                    alert("업로드가 완료되었습니다.");
                    fetchCandidates(newSavedId); // 다음 문제 연결 목록 불러오기
                } else {
                    // 혹시라도 ID를 못 받았더라도 저장은 되었을 수 있으므로
                    alert("업로드가 완료되었습니다.");
                }
            }
        } catch (error) {
            console.error("저장 중 오류: ", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    // 권한 없는 사용자의 렌더링 방지
    if (role === '0') return null;

    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            {/* Header 섹션 */}
            <header className="mb-10 ml-2">
                <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Metaverse Editor</p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">메타버스 테스트 {isEdit ? "수정" : "등록"}</h1>
            </header>

            <section className="bg-white border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="space-y-10">

                    {/* 테스트 기본 정보 섹션 */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest">Basic Information</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-gray-500 ml-1">대상 강의</span>
                                <select
                                    name='lectureId'
                                    value={formData.lectureId}
                                    onChange={handleInputChange}
                                    className="w-full pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                                >
                                    <option value="">강의를 선택해주세요</option>
                                    {lectures.map(lec => (
                                        <option key={lec.lectureId} value={lec.lectureId}>{lec.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-gray-500 ml-1">국가 / 장소</span>
                                <div className="flex gap-2">
                                    <select name='country' value={formData.country} onChange={handleInputChange} className="flex-1 pl-3 pr-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm">
                                        <option value="USA">미국</option>
                                        <option value="JAPAN">일본</option>
                                        <option value="CHINA">중국</option>
                                        <option value="GERMANY">독일</option>
                                        <option value="ITALY">이탈리아</option>
                                    </select>
                                    <select name="place" value={formData.place} onChange={handleInputChange} className="flex-1 pl-3 pr-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm">
                                        <option value="CONVENIENCE_STORE">편의점</option>
                                        <option value="CAFE">카페</option>
                                        <option value="TRAIN_STATION">대중교통</option>
                                        <option value="AIRPORT">공항</option>
                                        <option value="HOTEL">호텔</option>
                                        <option value="MARKET">시장</option>
                                        <option value="RESTAURANT">레스토랑</option>
                                        <option value="SCHOOL">학교</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-gray-500 ml-1">난이도</span>
                                <select name="level" value={formData.level} onChange={handleInputChange} className="w-full pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm">
                                    <option value="BEGINNER">초급</option>
                                    <option value="INTERMEDIATE">중급</option>
                                    <option value="ADVANCED">고급</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-gray-500 ml-1">주제</span>
                                <input
                                    name='topic'
                                    value={formData.topic}
                                    onChange={handleInputChange}
                                    placeholder='예: 음식 주문하기'
                                    className='w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm placeholder:text-gray-300'
                                />
                            </div>
                        </div>
                    </div>

                    {/* 스크립트 입력 섹션 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <NpcInput name="npcScript" value={formData.npcScript} onChange={handleInputChange} />
                            {/* <NpcPreview text={formData.npcScript} /> */}
                        </div>
                        <div className="space-y-4">
                            <UserInput name="question" value={formData.question} onChange={handleInputChange} />
                            {/* <UserPreview text={formData.question} /> */}
                        </div>
                    </div>

                    {/* 정답 설정 섹션 */}
                    <div className="space-y-6">
                        {formData.level !== 'ADVANCED' && (
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest">Answer Options</label>
                                <div className="bg-gray-50/30 border border-gray-100 rounded-2xl p-6">
                                    <TestAnswer onAnswersChange={handleOptionsChange} savedOptions={formData.options} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest">Correct Answer Selection</label>
                            <div className="p-6 bg-white border border-blue-100 rounded-2xl shadow-sm">
                                {formData.level === 'BEGINNER' && (
                                    <div className='flex flex-wrap gap-3'>
                                        {formData.options.length > 0 ? formData.options.map((opt, idx) => (
                                            <label key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${formData.answers[0] === opt ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                                                <input type='radio' name='answers' value={opt} className='hidden'
                                                    checked={formData.answers[0] === opt}
                                                    onChange={() => setFormData(prev => ({ ...prev, answers: [opt] }))} />
                                                <span className="text-sm font-bold">{opt}</span>
                                            </label>
                                        )) : <p className='text-sm text-gray-400 italic'>먼저 답 목록을 추가해주세요.</p>}
                                    </div>
                                )}
                                {formData.level === 'INTERMEDIATE' && (
                                    <div className="flex flex-wrap gap-3">
                                        {formData.options.map((opt, idx) => (
                                            <label key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${formData.answers.includes(opt) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                                                <input type="checkbox" className="hidden" checked={formData.answers.includes(opt)}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            answers: isChecked ? [...prev.answers, opt] : prev.answers.filter(a => a !== opt)
                                                        }));
                                                    }}
                                                />
                                                <span className="text-sm font-bold">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {formData.level === 'ADVANCED' && (
                                    <div className="w-full space-y-3">
                                        <input
                                            type="text"
                                            value={formData.answers[0] || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    answers: val ? [val] : []
                                                }));
                                            }}
                                            placeholder="사용자가 입력해야 할 정확한 정답 문장을 입력하세요."
                                            className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-bold"
                                        />
                                        <p className="text-[11px] text-gray-400 ml-1 italic">* 고급 단계에서는 전체 문장 일치 여부를 판단합니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 해설 섹션 */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest">Explanation</label>
                        <textarea
                            name="explanation"
                            value={formData.explanation}
                            onChange={handleInputChange}
                            placeholder="문제에 대한 해설을 입력하세요..."
                            className="w-full min-h-[120px] p-6 text-[15px] leading-relaxed resize-none outline-none text-gray-700 bg-gray-50/30 rounded-2xl border border-gray-100 focus:bg-white focus:border-blue-200 transition-all"
                        />
                    </div>

                    {/* 다음 문제 연결 섹션 */}
                    <div className={`space-y-4 p-8 rounded-[2rem] border transition-all ${currentSavedId ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-blue-600 uppercase ml-1 tracking-widest">Next Connection</label>
                            {currentSavedId && <span className='text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold'>ID: {currentSavedId}</span>}
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <select
                                disabled={!currentSavedId}
                                className="w-full md:flex-1 pl-4 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                onChange={(e) => handleConnectNext(e.target.value)}
                                value={formData.nextConversationId ?? ""}
                            >
                                <option value="">연결할 문제 선택 (없음)</option>
                                {candidateList.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        [{item.id}] {item.topic || '주제없음'} - {item.npcScript?.substring(0, 20)}...
                                    </option>
                                ))}
                            </select>
                            {!currentSavedId && <p className='text-xs text-red-400 font-bold'>업로드 후에 문제 연결이 가능합니다.</p>}
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 섹션 */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleSave}
                            className="flex-1 md:flex-none px-10 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                        >
                            {isEdit ? "수정하기" : "업로드"}
                        </button>
                        <button
                            onClick={() => { if (confirm("초기화하시겠습니까?")) setFormData(INITIAL_FORM); }}
                            className="px-6 py-3.5 bg-white text-gray-400 text-sm font-bold rounded-xl border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                        >
                            초기화
                        </button>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full md:w-auto px-6 py-3.5 text-gray-400 text-sm font-bold hover:text-gray-900 transition-all"
                    >
                        취소 후 돌아가기
                    </button>
                </div>
            </section>
        </main>
    );
}
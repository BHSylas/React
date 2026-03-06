import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
// import { LABEL_MAP } from "../../components/metaverse/testConstants";
import { useTestLogic } from "../../components/metaverse/useTestLogic";
import { api } from "../../api/axiosInstance";

interface NPCDetail {
    id: number;
    npcScript: string;
    question: string;
    options: string[];
    answers: string | string[];
    explanation: string;
    place: string;
    country: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    topic: string;
    nextConversationId: null | number;
}

const MetaTestPage = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<NPCDetail | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            /*fetch(`/api/professor/npc/list/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })*/
            api.get(`/professor/npc/list/${id}`) //api는 axios 인스턴스, 토큰을 자동으로 포함하며 import가 필요합니다
                .then(res => {
                    if (!res) throw new Error(`서버 응답 오류`);
                    setData(res.data as NPCDetail);
                    //return res.data as Promise<NPCDetail>; // setData를 즉시 적용할 수 있기 때문에 Promise를 반환하지 않아도 됩니다
                })
                /*.then((data: any) => { // Promise를 반환하지 않기 때문에 이제 사용하지 않아도 됩니다
                    console.log("받은 데이터: ", data);
                    setData(data as NPCDetail);
                })*/
                .catch(err => { //catch는 그대로 둬도 됩니다
                    console.error("데이터 로드 실패: ", err);
                    setData(null);
                });
        }
    }, [id]);

    const logic = useTestLogic(data);

    const handleEdit = () => {
        navigate(`/metaverse/upload/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("문제를 삭제하시겠습니까?")) return;

        try {
            await api.delete(`/professor/npc/delete/${id}`);
            alert("삭제되었습니다.");
            navigate(`/`);
        } catch (error) {
            console.error("삭제 중 오류 발생", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    }

    if (!data) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-gray-400 font-medium">데이터를 불러오는 중입니다...</div>
        </div>
    );

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 bg-gray-50/30 min-h-screen">
            {/* 상단 헤더 섹션 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">시험 확인 테스트</h2>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">
                            {data.level}
                        </span>
                        <p className="text-sm text-gray-500 font-medium">대화 주제 : <span className="text-gray-900">{data.topic}</span></p>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={handleEdit}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:border-blue-300 transition-all active:scale-95">
                        수정하기
                    </button>
                    <button onClick={() => handleDelete(data.id)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all active:scale-95">
                        삭제
                    </button>
                </div>
            </div>

            {/* 메인 문제 카드 */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="p-6 md:p-10 space-y-10">

                    {/* 문제 영역 (지문) */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-4">
                            <h3 className="text-xl font-bold text-gray-800">지문 확인</h3>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 space-y-8 border border-gray-100 relative">
                            <div className="relative z-10 space-y-4">
                                <div>
                                    <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">NPC Script</h4>
                                    <p className="text-lg text-gray-700 leading-relaxed font-medium">“{data.npcScript}”</p>
                                </div>
                                <div className="pt-4 border-t border-gray-200/60">
                                    <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Character Question</h4>
                                    <p className="text-lg text-gray-800 font-bold leading-relaxed">
                                        {data.question?.split(/\[.*?\]/g).map((part, i, arr) => (
                                            <span key={i}>
                                                {part}
                                                {i < arr.length - 1 && (
                                                    <span className="inline-block mx-1 px-4 border-b-2 border-blue-400 bg-blue-50 text-transparent select-none">_____</span>
                                                )}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                            {/* 배경 데코레이션 */}
                            <div className="absolute top-4 right-6 text-6xl font-serif text-gray-200 opacity-50 select-none">“</div>
                        </div>
                    </section>

                    {/* 답변 입력 영역 */}
                    <section className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm italic">Q</span>
                            빈칸에 들어갈 알맞은 답을 선택하세요
                        </h4>

                        {!logic.showResult ? (
                            <div className="space-y-6">
                                {data.level === 'ADVANCED' ? (
                                    <textarea
                                        placeholder="정답 문장을 정확하게 입력해주세요..."
                                        value={logic.userChoice as string}
                                        onChange={(e) => logic.setUserChoice(e.target.value)}
                                        className="w-full min-h-[160px] p-5 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none shadow-inner placeholder:text-gray-300"
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(data.options || []).map((opt, index) => {
                                            const choiceArray = Array.isArray(logic.userChoice) ? logic.userChoice : [];
                                            const orderIndex = choiceArray.indexOf(opt);
                                            const isSelected = data.level === 'INTERMEDIATE' ? orderIndex > -1 : logic.userChoice === opt;
                                            const inputId = `option-${index}`;

                                            return (
                                                <label key={opt} htmlFor={inputId}
                                                    className={`group flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.98] ${isSelected ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-100' : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50'
                                                        }`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                                                            }`}>
                                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                                        </div>
                                                        <input id={inputId} type={data.level === 'INTERMEDIATE' ? "checkbox" : "radio"} className="hidden"
                                                            checked={isSelected} onChange={() => {
                                                                if (data.level === 'INTERMEDIATE') {
                                                                    const current = [...choiceArray];
                                                                    if (orderIndex > -1) current.splice(orderIndex, 1);
                                                                    else current.push(opt);
                                                                    logic.setUserChoice(current);
                                                                } else logic.setUserChoice(opt);
                                                            }}
                                                        />
                                                        <span className={`font-semibold ${isSelected ? 'text-blue-800' : 'text-gray-600'}`}>{opt}</span>
                                                    </div>
                                                    {data.level === 'INTERMEDIATE' && isSelected && (
                                                        <span className="bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-black tracking-tighter">
                                                            STEP {orderIndex + 1}
                                                        </span>
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                                <button onClick={logic.handleSubmit}
                                    className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-lg shadow-gray-200 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:transform active:scale-[0.99]">
                                    답안 제출하고 결과 확인
                                </button>
                            </div>
                        ) : (
                            <div className="p-10 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl text-center group">
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform cursor-default">✅</div>
                                <p className="font-bold text-emerald-800">제출이 완료되었습니다.</p>
                                <p className="text-sm text-emerald-600/70">아래 답안지에서 해설을 확인하세요.</p>
                            </div>
                        )}
                    </section>

                    {/* 연결된 문제 정보 */}
                    {data.nextConversationId !== null && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
                            <div className="bg-amber-100 p-2 rounded-xl">🔗</div>
                            <div>
                                <h3 className="text-sm font-bold text-amber-900">연결된 다음 대화가 있습니다.</h3>
                                <p className="text-xs text-amber-700/80">주제: {data.topic}</p>
                            </div>
                        </div>
                    )}

                    {/* 결과 및 해설 섹션 */}
                    <section className="pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-xl font-bold text-gray-800">답안지 및 해설</h3>
                        </div>

                        {logic.showResult ? (
                            <div className="grid gap-4 overflow-hidden rounded-2xl border border-gray-100">
                                <div className={`flex items-center p-4 ${logic.isCorrect ? 'bg-blue-50' : 'bg-red-50'}`}>
                                    <div className="w-24 text-sm font-black text-gray-500 uppercase">결과</div>
                                    <div className={`font-black text-lg ${logic.isCorrect ? 'text-blue-600' : 'text-red-600'}`}>
                                        {logic.isCorrect ? "● CORRECT" : "X INCORRECT"}
                                    </div>
                                </div>
                                <div className="flex items-start p-4 bg-white border-t border-gray-50">
                                    <div className="w-24 text-sm font-black text-gray-500 uppercase pt-1">정답</div>
                                    <div className="font-bold text-gray-800 text-lg italic">
                                        {data.level === 'ADVANCED' && Array.isArray(data.answers)
                                            ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {data.answers.map((ans, idx) => (
                                                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 text-sm">
                                                            {ans}
                                                        </span>
                                                    ))}
                                                    <span className="text-xs text-gray-400 font-normal self-center ml-1">(이 중 하나만 입력해도 정답)</span>
                                                </div>
                                            )
                                            : Array.isArray(data.answers)
                                                ? data.answers.join(' → ')
                                                : (data.answers || "정보 없음")
                                        }
                                    </div>
                                </div>
                                <div className="flex items-start p-4 bg-white border-t border-gray-50">
                                    <div className="w-24 text-sm font-black text-gray-500 uppercase pt-1">해설</div>
                                    <div className="text-gray-600 leading-relaxed font-medium">
                                        {data.explanation || "등록된 해설이 없습니다."}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <span className="text-gray-400 font-medium">정답을 제출하면 상세 해설이 나타납니다.</span>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default MetaTestPage;
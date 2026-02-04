import { useEffect, useState } from "react";
import { useParams } from "react-router";
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
}

const MetaTestPage = () => {
    const { id } = useParams<{ id: string }>();

    const [data, setData] = useState<NPCDetail | null>(null);

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

    if (!data) return <div>로딩 중...</div>;

    return (
        <main>
            <div className="flex justify-between items-end mt-5 mb-5">
                <div className="grid gap-3">
                    <h2 className="text-2xl font-bold">시험 확인 테스트</h2>
                    <p className="text-sm text-gray-500">대화 주제 : {data.topic}</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-blue-800 text-white font-bold rounded-md pt-1 pb-1 pr-3 pl-3 hover:bg-blue-900">수정</button>
                    <button className="bg-red-600 text-white font-bold rounded-md pt-1 pb-1 pr-3 pl-3 hover:bg-red-700">삭제</button>
                </div>
            </div>
            <div className="grid justify-start items-center gap-3 border border-gray-300 rounded-md w-full p-4">
                <section>
                    <h3 className="text-2xl font-bold mb-3">문제</h3>
                    <div className="grid justify-start items-center gap-3">
                        <div className="border-2 border-gray-300 rounded-md p-3 w-[1240px]">
                            <div>
                                <h4 className="font-bold">NPC</h4>
                                <p>{data.npcScript}</p>
                            </div>
                            <div>
                                <h4 className="font-bold">캐릭터</h4>
                                <p>{data.question?.replace(/\[.*?\]/g, '_____')}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">빈칸의 들어갈 답은?</h4>
                            {!logic.showResult ? (
                                <div className="grid gap-4">
                                    {data.level === 'ADVANCED' ? (
                                        <textarea
                                            placeholder="정답을 서술하세요"
                                            value={logic.userChoice as string}
                                            onChange={(e) => logic.setUserChoice(e.target.value)}
                                            className="border border-gray-500 w-[1240px] min-h-[100px] p-3 resize-none leading-[1.5]"
                                        />
                                    ) : (
                                        <div className="grid justify-start item-center gap-1">
                                            {(data.options || []).map((opt: string, index: number) => {
                                                const choiceArray = Array.isArray(logic.userChoice) ? logic.userChoice : [];
                                                const orderIndex = choiceArray.indexOf(opt);
                                                const isSelected = data.level === 'INTERMEDIATE'
                                                    ? orderIndex > -1 : logic.userChoice === opt;

                                                const inputId = `option-${index}`;

                                                return (
                                                    <label
                                                        key={opt}
                                                        htmlFor={inputId}
                                                        className={`flex items-center gap-3 p-2 border rounded-md cursor-pointer transition ${isSelected ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'
                                                            }`}>
                                                        <input
                                                            id={inputId}
                                                            type={data.level === 'INTERMEDIATE' ? "checkbox" : "radio"}
                                                            name="quiz-option"
                                                            checked={isSelected}
                                                            className="cursor-pointer w-4 h-4"
                                                            onChange={() => {
                                                                if (data.level === 'INTERMEDIATE') {
                                                                    const current = [...choiceArray];
                                                                    if (orderIndex > -1) current.splice(orderIndex, 1);
                                                                    else current.push(opt);
                                                                    logic.setUserChoice(current);
                                                                } else {
                                                                    logic.setUserChoice(opt);
                                                                }
                                                            }}
                                                        />

                                                        <span className="flex-1">{opt}</span>

                                                        {data.level === 'INTERMEDIATE' && isSelected && (
                                                            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-in fade-in zoom-in duration-200">
                                                                {orderIndex + 1}번
                                                            </span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <button
                                        onClick={logic.handleSubmit}
                                        className="bg-blue-800 p-2 rounded-md font-bold text-white hover:bg-blue-900"
                                    >
                                        정답 제출
                                    </button>
                                </div>
                            ) : (
                                <div className="p-5 bg-gray-100 rounded-md text-center border-2 border-dashed border-gray-300">
                                    <p className="font-bold text-gray-600">하단의 답안지를 확인하세요.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                <section className="border-t-2 border-gray-300 pt-3 mt-2">
                    <h3 className="font-bold">답안지 및 정보</h3>
                    {logic.showResult ? (
                        <table>
                            <tbody>
                                <tr><td className="py-1 px-3">결과</td>
                                <td>{logic.isCorrect ? "정답" : "오답"}</td></tr>
                                <tr><td className="py-1 px-3">정답</td>
                                <td>{Array.isArray(data.answers) ? data.answers.join(', ') : data.answers}</td></tr>
                                <tr><td className="py-1 px-3">해설</td>
                                <td>{data.explanation}</td></tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>정답을 제출하면 해설과 상세 정보가 공개됩니다.</p>
                    )}
                </section>
            </div>
        </main>
    );
};

export default MetaTestPage;
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../../../api/axiosInstance";
import { AnswerButtons } from "./AnswerButton";
import axios from "axios";

interface AnswerBlockProps {
    boardId: string; // 게시글 아이디
    boardType: string; // 게시글 타입
    lectureId: string; // 게시글이 속한 강의 ID
}

interface TokenPayload {
    sub: string; // 고유 아이디
    role: number; // 0: 학생, 1: 교수, 2: 관리자
}

export function AnswerBlock({ boardId, boardType, lectureId }: AnswerBlockProps) {
    const [answers, setAnswers] = useState<any[]>([]);
    const [newAnswer, setNewAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [ownerId, setOwnerId] = useState<string | null>(null); // 강의 정보를 저장해서 거기서 교수 아이디를 가져옴

    const token = localStorage.getItem("token");
    let currentUser: TokenPayload | null = null;
    if (token) {
        try {
            currentUser = jwtDecode<TokenPayload>(token);
        } catch (e) {
            console.error("토큰 디코딩 실패", e);
        }
    }   // 디코딩을 통해 token에서 sub(id) 가져옴

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");

    // const isAdmin = currentUser?.role === 2; // 관리자
    const isProfessor = currentUser?.role === 1; // 교수
    const isLectureOwner = isProfessor && ownerId !== null && currentUser?.sub === String(ownerId); // 아이디 비교

    const canWrite =
        // (boardType === "QNA" && isAdmin) || // QNA면서 관리자일 때
        (boardType === "LECTURE_QNA" && isLectureOwner); // 강의 QNA면서 교수 여야하고 고유 id가 같을 때

    const hasAnswer = answers.length > 0; // 답변이 없는 상황
    // 수정 권한이 있고 + 답변이 아직 없을 때
    const showWriteArea = canWrite && !hasAnswer;


    const fetchLectureInfo = async () => {
        if (boardType === "LECTURE_QNA" && lectureId) {
            try {
                const r = await api.get(`/lectures/${lectureId}`);
                if (r.data) {
                    const profId = r.data.professorId;

                    if (profId) {
                        setOwnerId(String(profId));
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const fetchAnswers = async () => {
        try {
            const res = await api.get(`/boards/qna/answers/list/${boardId}`);
            setAnswers(res.data);
        } catch (e) {
            console.error("답변 로드 실패", e);
        }
    } // 답변 로드용 api

    const handleReplySubmit = async () => {

        if (!newAnswer.trim()) {
            alert("답변 내용을 입력해주세요.");
            return;
        } // 답변 등록
        setIsLoading(true);
        try {
            await api.post(`/boards/qna/answers/create/${boardId}`, {
                content: newAnswer
            });
            setNewAnswer(""); // 입력창 초기화
            alert("답변이 등록되었습니다.");
            fetchAnswers(); // 새로고침
        } catch (e) {
            console.error("답변 등록 실패", e);
            alert("등록 중 오류가 발생하였습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (answerId: string) => {
        try {
            await axios.put(`/api/boards/qna/answers/update/${answerId}`, { content: editContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingId(null);
            fetchAnswers();
            alert("수정 성공!");
        } catch (e) { alert("수정 실패"); console.error("답변 수정 실패", e); }
    };

    const handleDelete = async (professorId: string, answerId: string) => {
        const isConfirmed = window.confirm("이 답변을 삭제하시겠습니까?");
        if (!isConfirmed) return;

        try {
            await axios.delete(`/api/boards/qna/answers/delete/${professorId}/${answerId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchAnswers();
            alert("삭제 성공!");

        } catch (e) { alert("삭제 실패"); console.error("답변 삭제 실패", e); }
    };

    useEffect(() => {
        if (boardId) fetchAnswers();
        if (lectureId) fetchLectureInfo();
    }, [boardId, lectureId]);

    return (
        <div className="space-y-6">
            {/* 1. 답변 리스트 영역 */}
            <div className="space-y-6">
                {answers.length > 0 ? (
                    answers.map((ans, idx) => (
                        <div key={ans.id || idx} className="bg-white border border-gray-100 rounded-md p-8 shadow-sm transition-all">
                            <div className="flex flex-col gap-4">
                                {/* 답변자 정보 헤더 */}
                                <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {boardType === "QNA" ? "AD" : "PF"}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 leading-tight">
                                                {boardType === "QNA" ? "관리자 답변" : `${ans.writerName} 교수님`}
                                            </span>
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                                Official Response · {new Date(ans.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 답변 내용 영역 */}
                                <div className="py-2">
                                    {editingId === ans.writerId ? (
                                        <textarea
                                            className="w-full border border-blue-200 rounded-2xl p-4 text-sm leading-relaxed focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={6}
                                        />
                                    ) : (
                                        <p className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap px-1">
                                            {ans.content}
                                        </p>
                                    )}
                                </div>

                                {/* 수정/삭제 버튼 (교수 권한 시) */}
                                {canWrite && (
                                    <div className="pt-4 border-t border-gray-50">
                                        <AnswerButtons
                                            isEditing={editingId === ans.writerId}
                                            onEditStart={() => {
                                                setEditingId(ans.writerId);
                                                setEditContent(ans.content);
                                            }}
                                            onEditCancel={() => setEditingId(null)}
                                            onEditSubmit={() => handleUpdate(ans.answerId)}
                                            onDelete={() => { handleDelete(String(ans.writerId), String(ans.answerId)); }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    /* 답변이 없을 때의 상태 */
                    <div className="py-5 text-center bg-gray-50/50 rounded-md border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium italic">아직 등록된 답변이 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 2. 답변 작성 영역 (권한이 있고 답변이 없을 때만) */}
            {showWriteArea && (
                <div className="bg-blue-50/30 border border-blue-100 rounded-[2rem] p-8 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Write Official Answer</span>
                    </div>
                    <textarea
                        className="w-full bg-white border border-blue-100 rounded-2xl p-5 text-sm leading-relaxed focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none resize-none transition-all placeholder:text-gray-300 shadow-inner"
                        placeholder="학생의 질문에 대한 답변을 입력해주세요."
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        disabled={isLoading}
                        rows={5}
                    />
                    <div className="flex justify-end">
                        <button
                            className="px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-95 disabled:bg-gray-300"
                            onClick={handleReplySubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "등록 중..." : "답변"}
                        </button>
                    </div>
                </div>
            )}

            {/* 3. 하단 안내 메시지 (답변 완료 혹은 권한 없음) */}
            {!showWriteArea && (
                <div className="px-6 py-4">
                    {hasAnswer ? (
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded">STATUS</span>
                            <p className="text-xs font-medium">답변이 완료된 게시글입니다.</p>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic">
                            {isProfessor && !isLectureOwner
                                ? "※ 본 강의의 담당 교수자만 공식 답변을 작성할 권한이 있습니다."
                                : "※ 답변 작성을 기다리고 있는 질문입니다."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
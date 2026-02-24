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
        <div className="border rounded-md p-6">
            <div className="flex-1 border-b-2 pb-3 mb-5">
                {answers.length > 0 ? (answers.map((ans, idx) => (
                    <div key={ans.id || idx}>
                        <div className="grid gap-1 mt-3">
                            <span className="font-bold ">
                                {boardType === "QNA" ? "관리자" : `교수 : ${ans.writerName}`} 답변
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(ans.createdAt).toLocaleDateString()}
                            </span>
                            <div className="mt-3">
                                {editingId === ans.writerId ? (
                                    <textarea
                                        className="w-full border rounded-md p-2 resize-none"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="py-2 whitespace-pre-wrap">
                                        {ans.content}
                                    </p>
                                )}
                            </div>
                        </div>
                        {canWrite && (
                            <div className="my-3 border-t-2">
                                <AnswerButtons
                                    isEditing={editingId === ans.writerId}
                                    onEditStart={() => {
                                        setEditingId(ans.writerId);
                                        setEditContent(ans.content);
                                    }}
                                    onEditCancel={() => setEditingId(null)}
                                    onEditSubmit={() => handleUpdate(ans.answerId)}
                                    onDelete={() => {handleDelete(String(ans.writerId), String(ans.answerId));}} />
                            </div>
                        )}
                    </div>
                ))) : (
                    <div className="text-sm text-gray-400">아직 등록된 답변이 없습니다. </div>
                )}
            </div>

            {showWriteArea ? (
                <div>
                    <div>
                        <textarea
                            className="w-full border rounded-lg p-2 resize-none"
                            value={newAnswer} // 들어가는 값이 답변 값으로
                            onChange={(e) => setNewAnswer(e.target.value)}
                            disabled={isLoading}></textarea>
                    </div>
                    <div className="flex ml-4 justify-end">
                        <button
                            className="hover:text-blue-800 hover:font-bold hover:scale-105 mr-3 mt-2"
                            onClick={handleReplySubmit}
                            disabled={isLoading}>
                            {isLoading ? "등록 중..." : "답변 게시"}</button>
                    </div>
                </div>
            ) : hasAnswer ? (
                <div>
                    <p className="text-sm text-gray-500">
                        답변이 등록되었습니다.
                    </p>
                </div>
            ) : (
                <div className="text-sm text-gray-400"> {isProfessor && !isLectureOwner
                    ? "공식 답변 권한이 없는 계정입니다."
                    : "이 강의의 담당 교수자만 답변을 작성할 수 있습니다."} </div>
            )
            }
        </div >
    )
}
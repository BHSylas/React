import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../../../api/axiosInstance";

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
    }

    const isAdmin = currentUser?.role === 2;
    const isProfessor = currentUser?.role === 1;
    const isLectureOwner = isProfessor && ownerId !== null && currentUser?.sub === String(ownerId);

    const canWrite =
        (boardType === "QNA" && isAdmin) || // QNA면서 관리자일 때
        (boardType === "LECTURE_QNA" && isLectureOwner); // 강의 QNA면서 교수 여야하고 고유 id가 같을 때

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
                            <p className="mt-5 py-2">
                                {ans.content}
                            </p>
                        </div>
                    </div>
                ))) : (
                    <div className="text-sm text-gray-400">아직 등록된 답변이 없습니다. </div>
                )}
            </div>

            {canWrite ? (
                <div>
                    <textarea
                        className="w-full border rounded-lg p-2 resize-none"
                        value={newAnswer} // 들어가는 값이 답변 값으로
                        onChange={(e) => setNewAnswer(e.target.value)}
                        disabled={isLoading}></textarea>
                    <div className="flex ml-4 justify-end">
                        <button
                            className="hover:text-blue-800 hover:font-bold hover:scale-105 mr-3 mt-2"
                            onClick={handleReplySubmit}
                            disabled={isLoading}>
                            {isLoading ? "등록 중..." : "답변 게시"}</button>
                    </div>
                </div>
            ) : (
                <div  className="text-sm text-gray-400"> {isProfessor && !isLectureOwner
                    ? "공식 답변 권한이 없는 계정입니다."
                    : "이 강의의 담당 교수자만 답변을 작성할 수 있습니다."}</div>
            )}
        </div>
    )
}
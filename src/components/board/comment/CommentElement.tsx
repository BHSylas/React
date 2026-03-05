import { useMemo, useRef, useState } from "react";
import { api } from "../../../api/axiosInstance";
import axios from "axios";

const getUserInfoFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = token.split(".")[1]; // 페이로드 부분 추출
        const decodePayload = JSON.parse(atob(payload));

        return {
            userId: decodePayload.sub || null, // ID
            role: decodePayload.role // 권한 (예: 2는 관리자)
        };

    } catch (error) {
        console.error("토큰 파싱 실패:", error);
        return null;
    }
}

export default function CommentElement({ comment }: { comment: Comment }) {
    const [edit, setEdit] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [content, setContent] = useState(comment.content);
    const originalContent = useRef(comment.content);

    // console.log(comment);
    // console.log(comment.writerId);

    const userInfo = useMemo(() => getUserInfoFromToken(), []);

    const isAuthor = useMemo(() => {
        if (!comment.writerId || !userInfo?.userId) return false; // 만약 아이디가 다르면 false
        return String(comment.writerId).trim() === String(userInfo.userId).trim(); // string으로 변환하고 문자열 확인  
    }, [comment.writerId, userInfo?.userId]);  // 다른 게시글 갈 때마다 업데이트

    const canDelete = useMemo(() => {
        const isAdmin = String(userInfo?.role) === "2"; // 권환 확인
        return isAuthor || isAdmin; // 위의 isAuthor과 동일로 두기(본인 혹은 관리자일 경우)
    }, [isAuthor, userInfo?.role]);

    const token = localStorage.getItem("token");

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleEdit = () => {
        if (edit) {
            setContent(originalContent.current);
        }
        setEdit(!edit);
    }
    const update = () => {
        api.put(`/boards/comments/update/${comment.commentId}`, {
            content: content,

        }).then(() => {
            setEdit(false);
            originalContent.current = content;
        }).catch((err: any) => {
            console.error(err);
            alert("NO");
            setEdit(false);
            setContent(originalContent.current);
        });
    }
    const remove = () => {
        alert("삭제하시겠습니까?");
        axios.delete(`/api/boards/comments/delete/${comment.commentId}`, config )
            .then((res) => {
                console.log(res.data);
                setDeleted(true);
            }).catch((err: any) => {
                console.error(err);
                alert("NO");
            });
    }
    if (deleted) {
        return null;
    }
    return (
        <div className="group relative flex flex-col py-4 border-b border-gray-100 last:border-0 transition-all">

            <div className="flex-1 min-w-0">
                {edit ? (
                    /* 수정 모드 UI: 본문 작성 도구와 동일한 둥근 스타일 */
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <textarea
                            className="w-full bg-gray-50 border border-blue-100 rounded-[1.5rem] p-5 text-[14px] leading-relaxed outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none shadow-inner"
                            rows={3}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-all"
                                onClick={handleEdit}
                            >
                                취소
                            </button>
                            <button
                                className="px-6 py-2 text-xs font-black bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                                onClick={update}
                            >
                                업데이트 저장
                            </button>
                        </div>
                    </div>
                ) : (
                    /* 일반 모드 UI: 텍스트 가독성 극대화 */
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-black text-gray-900 tracking-tight">
                                    {comment.writerName}
                                </span>
                            </div>
                            <p className="text-[16px] text-gray-700 leading-relaxed break-words pr-10">
                                {content}
                            </p>
                        </div>

                        {/* 오른쪽 상단: 액션 버튼 (호버 시에만 깔끔하게 노출) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                            {isAuthor && (
                                <button
                                    className="px-2 py-1 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-all uppercase tracking-widest"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                            )}
                            <span className="text-gray-100 text-[8px]">|</span>
                            {canDelete && (
                                <button
                                    className="px-2 py-1 text-[10px] font-black text-gray-400 hover:text-red-500 transition-all uppercase tracking-widest"
                                    onClick={remove}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
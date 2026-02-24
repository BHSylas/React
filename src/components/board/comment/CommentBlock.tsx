import { useEffect, useState, useContext } from "react";
import CommentForm from "./CommentForm";
import { api } from "../../../api/axiosInstance";
import CommentList from "./CommentList";
import { AuthContext } from "../../../context/AuthContext";

export function CommentBlock({ postId, boardType }: { postId: string, boardType: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [requireRenewal, setRequireRenewal] = useState(true);

  const role = useContext(AuthContext).role;
  const canWriteComment = boardType === "FREE" || (boardType === "QNA" && role === "2");

  useEffect(() => {
    api.get(`/boards/comments/list/${postId}?size=50`).then((res) => {
      setComments(res.data.content);
    }).finally(() => {
      setRequireRenewal(false);
    });
  }, [postId, requireRenewal]);
  return (
    <section className="border rounded-lg p-6 text-sm">
      <CommentList comments={comments} />
      {canWriteComment ? (
        <CommentForm postId={postId} onSubmit={() => { setRequireRenewal(true) }} />
      ) : (
        <div className="mt-4 p-4 bg-gray-50 rounded text-center text-gray-500">Q&A 답변은 관리자만 작성할 수 있습니다.</div>
      )}
    </section>
  );
}
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import { api } from "../../../api/axiosInstance";
import CommentList from "./CommentList";

export function CommentBlock( {postId} : {postId: string} ) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [requireRenewal, setRequireRenewal] = useState(true);
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
      <CommentForm postId={postId} onSubmit={() => {setRequireRenewal(true)}} />
    </section>
  );
}
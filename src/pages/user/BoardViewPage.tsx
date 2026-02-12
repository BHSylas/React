import { useEffect, useState } from "react";
import { CommentBlock } from "../../components/board/comment/CommentBlock";
import { BoardActionBar } from "../../components/board/desc/BoardActionBar";
import { BoardPostPanel } from "../../components/board/desc/BoardPostPanel";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import type { Board } from "../../types/Board";

export function BoardViewPage() {
    const postId = useParams().postId;
    const navigate = useNavigate();
    const [post, setPost] = useState<Board>();
    useEffect(() => {
      api.get(`/boards/list/${postId}`).then((res) => {
        setPost(res.data);
      });
    }, []);

  return (
    <main className="mx-auto px-6 py-8 space-y-6">
        <div className="p-6 border rounded-lg shadow-sm space-y-4">
        <BoardPostPanel post={post} />
        <div className="divider" />
        <BoardActionBar
        onBack={() => {navigate(-1);}}
        onWrite={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        />
        </div>

      <CommentBlock />
    </main>
  );
}

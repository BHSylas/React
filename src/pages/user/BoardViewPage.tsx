import { useEffect, useState } from "react";
import { CommentBlock } from "../../components/board/comment/CommentBlock";
import { BoardActionBar } from "../../components/board/desc/BoardActionBar";
import { BoardPostPanel, type BoardPostPanelProps } from "../../components/board/desc/BoardPostPanel";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const token = localStorage.getItem("token");

export function BoardViewPage() {
    const postId = useParams().postId;
    const navigate = useNavigate();
    const [post, setPost] = useState<Board>();
    useEffect(() => {
      api.get(`/boards/list/${postId}`).then((res) => {
        setPost(res.data);
      });
    }, [postId]);

  return (
    <main className="mx-auto px-6 py-8 space-y-6">
      <div className="p-6 border rounded-lg shadow-sm space-y-4">
        <BoardPostPanel {...post} />
        <div className="divider" />
        <BoardActionBar
          onBack={() => { navigate(-1); }}
          onWrite={() => { navigate('/board/upload') }}
          onEdit={() => {}}
          onDelete={handleDelete}
        />
      </div>

      <section id="comments">
        <CommentBlock postId={postId || "0"} />
      </section>
    </main>
  );
}

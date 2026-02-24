import { useEffect, useState } from "react";
import { CommentBlock } from "../../components/board/comment/CommentBlock";
import { BoardActionBar } from "../../components/board/desc/BoardActionBar";
import { BoardPostPanel, type BoardPostPanelProps } from "../../components/board/desc/BoardPostPanel";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import { AnswerBlock } from "../../components/board/Answer/AnswerBlock";


export function BoardViewPage() {
  const postId = useParams().postId;
  const navigate = useNavigate();
  const [post, setPost] = useState<BoardPostPanelProps>({
    title: "",
    writerName: "",
    boardType: "",
    createdAt: "",
    content: "",
    lectureId: "",
  }); //default value required

  const handleDelete = () => {
    if (!postId || !confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    api.delete(`/boards/delete/${postId}`).then(() => {
      alert("게시글이 삭제되었습니다.");
      navigate("/board");
    }).catch((err) => {
      console.error("게시글 삭제 실패: ", err);
    });
  }

  useEffect(() => {
    api.get(`/boards/list/${postId}`).then((res) => {
      setPost(res.data);
    }).catch((err) => {
      console.error("데이터 로드 실패: ", err);
      alert("게시글 로드 중 오류가 발생했습니다.");
      navigate("/board");
    });
  }, [postId]);

  return (
    <main className="mx-auto px-6 py-8 space-y-6">
      <div className="p-6 border rounded-lg shadow-sm space-y-4">
        <BoardPostPanel {...post} />
        <div className="divider" />
        <BoardActionBar
          boardType={post.boardType}
          onBack={() => { navigate(-1); }}
          onWrite={() => { navigate('/board/upload') }}
          onEdit={() => { navigate(`/board/edit/${postId}`) }}
          onDelete={() => { handleDelete(); }}
        />
      </div>
      {post.boardType === "FREE" && (
        <section id="comments">
          <CommentBlock postId={postId || "0"} />
        </section>
      )}

      {(post.boardType === "QNA" || post.boardType === "LECTURE_QNA") && (
        <section id="answers">
          <AnswerBlock
            boardId={postId || "0"}
            boardType={post.boardType}
            lectureId={post.lectureId} />
        </section>
      )}
    </main>
  );
}

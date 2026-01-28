import { CommentBlock } from "../../components/board/comment/CommentBlock";
import { BoardActionBar } from "../../components/board/desc/BoardActionBar";
import { BoardPostPanel } from "../../components/board/desc/BoardPostPanel";
import { useNavigate, useParams } from "react-router-dom";

export function BoardViewPage() {
    const postId = useParams().postId;
    const navigate = useNavigate();
    console.log(postId);
  // TODO: 게시글 API 연동
  const post = {
    title: "게시글 제목 예시입니다",
    author: "홍길동",
    category: "자유게시판",
    createdAt: "2024-01-05",
    content: `이곳은 게시글 본문입니다.\n\n여러 줄의 텍스트도 자연스럽게 표시됩니다.`,
  };

  return (
    <main className="mx-auto px-6 py-8 space-y-6">
        <div className="p-6 border rounded-lg shadow-sm space-y-4">
        <BoardPostPanel {...post} />
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

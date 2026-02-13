import { useEffect, useState } from "react";
import { CommentBlock } from "../../components/board/comment/CommentBlock";
import { BoardActionBar } from "../../components/board/desc/BoardActionBar";
import { BoardPostPanel, type BoardPostPanelProps } from "../../components/board/desc/BoardPostPanel";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const token = localStorage.getItem("token");

export function BoardViewPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<BoardPostPanelProps | null>(null);
  const [loading, setLoading] = useState(true);

  const boardId = Number(postId);

  const fetchBoardView = () => {
    if (isNaN(boardId)) {
      alert("유효하지 않은 접근입니다.");
      navigate(-1);
      return;
    }

    setLoading(true);
    axios.get(`/api/board/list/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}` // 토큰 전달
      }
    }).then(res => {
      if (res) setPost(res.data)
    }).catch(err => {
      console.error("데이터 로드 실패: ", err);
      alert("서버 내부 오류가 발생하였습니다.");
    }).finally(() => {
      setLoading(false); // 로딩 종료
    });
  }

  useEffect(() => {
    fetchBoardView();
  }, [boardId]);

  const handleDelete = () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      axios.delete(`/api/board/${boardId}`);
      alert("삭제되었습니다.");
      navigate("/board"); // 삭제 후 목록으로 이동
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  // TODO: 게시글 API 연동
  // const post = {
  //   title: "게시글 제목 예시입니다",
  //   writerName: "홍길동",
  //   boardType: "자유게시판",
  //   createdAt: "2024-01-05",
  //   content: `이곳은 게시글 본문입니다.\n\n여러 줄의 텍스트도 자연스럽게 표시됩니다.`,
  // };

  if (loading) return <div className="p-10 text-center text-gray-400">데이터를 읽어오는 중...</div>;
  if (!post) return <div className="p-10 text-center">게시글이 존재하지 않습니다.</div>;

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

      <CommentBlock postId={postId || "0"} />
    </main>
  );
}

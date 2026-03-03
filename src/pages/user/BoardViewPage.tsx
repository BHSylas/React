import { useEffect, useState, useRef } from "react";
import { CommentBlock } from "../../components/board/comment/CommentBlock";
import { BoardActionBar } from "../../components/board/desc/BoardActionBar";
import { BoardPostPanel, type BoardPostPanelProps } from "../../components/board/desc/BoardPostPanel";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import { AnswerBlock } from "../../components/board/Answer/AnswerBlock";


export function BoardViewPage() {
  const isFetched = useRef(false);
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
    if (isFetched.current) return;
    isFetched.current = true;

    api.get(`/boards/list/${postId}`).then((res) => {
      setPost(res.data);
    }).catch((err) => {
      console.error("데이터 로드 실패: ", err);
      alert("게시글 로드 중 오류가 발생했습니다.");
      navigate("/board");
    });
  }, [postId]);

  return (
    <main className="max-w-6xl mx-auto px-6 pb-12 space-y-12">
      <section className="flex flex-col transition-all">
        
        <div className="p-8 pt-12 px-10 flex-1 flex flex-col">
          <BoardPostPanel {...post} />
          
          <div className="flex-1" />
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 mt-auto">
          <BoardActionBar
            boardType={post.boardType}
            onBack={() => { navigate(-1); }}
            onWrite={() => { navigate('/board/upload') }}
            onEdit={() => { navigate(`/board/edit/${postId}`) }}
            onDelete={() => { handleDelete(); }}
          />
        </div>
      </section>

      <div className="space-y-6">
        {/* [자유게시판/Q&A] 댓글 섹션 */}
        {(post.boardType === "FREE" || post.boardType === "QNA") && (
          <section id="comments" className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 px-4 mb-6">
               <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
               <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Comments</h3>
            </div>
            <CommentBlock postId={postId || "0"} boardType={post.boardType} />
          </section>
        )}

        {/* [강의 Q&A] 답변 섹션 */}
        {post.boardType === "LECTURE_QNA" && (
          <section id="answers" className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 px-4 mb-6">
               <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
               <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Answers</h3>
            </div>
            <AnswerBlock
              boardId={postId || "0"}
              boardType={post.boardType}
              lectureId={post.lectureId} 
            />
          </section>
        )}
      </div>
    </main>
  );
}

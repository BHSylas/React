import { useEffect, useState, useRef, useMemo } from "react";
import { CommentBlock } from "../../components/board/comment/CommentBlock";
import { BoardActionBar } from "../../components/board/desc/BoardActionBar";
import { BoardPostPanel, type BoardPostPanelProps } from "../../components/board/desc/BoardPostPanel";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import { AnswerBlock } from "../../components/board/Answer/AnswerBlock";

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

export function BoardViewPage() {
  const isFetched = useRef(false);
  const postId = useParams().postId;
  const navigate = useNavigate();
  const [post, setPost] = useState<BoardPostPanelProps & { writer?: string }>({
    title: "",
    writerName: "",
    boardType: "",
    createdAt: "",
    content: "",
    lectureId: "",
    writer: ""
  }); //default value required

  // 토큰 및 권한 정보 계산
  const userInfo = useMemo(() => getUserInfoFromToken(), []);

  //본인 및 관리자 확인 post.writer가 API를 통해 업데이트되면 이 값들이 자동으로 true로 변합니다.
  const isAuthor = useMemo(() => {
    if (!post.writer || !userInfo?.userId) return false; // 만약 아이디가 다르면 false
    return String(post.writer).trim() === String(userInfo.userId).trim(); // string으로 변환하고 문자열 확인  
  }, [post.writer, userInfo?.userId]);  // 다른 게시글 갈 때마다 업데이트

  const canDelete = useMemo(() => {
    const isAdmin = String(userInfo?.role) === "2"; // 권환 확인
    return isAuthor || isAdmin; // 위의 isAuthor과 동일로 두기(본인 혹은 관리자일 경우)
  }, [isAuthor, userInfo?.role]);

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
      console.log("전체 응답 데이터:", res.data); // 여기서 작성자 식별자가 무엇인지 확인!
    }).catch((err) => {
      console.error("데이터 로드 실패: ", err);
      alert("게시글 로드 중 오류가 발생했습니다.");
      navigate("/board");
    });
  }, [postId, navigate]);

  return (
    <main className="max-w-6xl mx-auto px-6 pb-12 space-y-12">
      <section className="flex flex-col transition-all">

        <div className="p-8 pt-12 px-10 flex-1 flex flex-col">
          <BoardPostPanel {...post} />

          <div className="flex-1" />
        </div>

        <div>
          <BoardActionBar
            boardType={post.boardType}
            isAuthor={isAuthor}
            canDelete={canDelete}
            onBack={() => { navigate(-1); }}
            onWrite={() => {
              if (post.boardType === "LECTURE_QNA" && post.lectureId) {
                navigate(`/class/qna/upload/${post.lectureId}`);
              } else {
                navigate('/board/upload');
              }
            }}
            onEdit={() => { navigate(`/board/edit/${postId}`) }}
            onDelete={() => { handleDelete(); }}
          />
        </div>
      </section>

      <div className="space-y-6">
        {/* [자유게시판/Q&A] 댓글 섹션 */}
        {(post.boardType === "FREE" || post.boardType === "QNA" || post.boardType === "NOTICE") && (
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

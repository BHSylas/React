import { useState, useEffect } from "react";
import { BoardListBlock } from "../../components/board/list/BoardListBlock";
import { BoardSearchFilter } from "../../components/board/list/BoardSearchFilter";
import type { Board } from "../../types/Board";
import { BoardPagination } from "../../components/board/list/BoardPagination";
import { api } from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

export function LectureQnaListPage() {
  // const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true); //로딩중 상태
  const activeTab = "LECTURE_QNA";
  const lectureId = useParams().lectureId ?? null;
  const [allBoards, setAllBoard] = useState<Board[]>([]); // 전체 보드
  const [searchBoard, setSerarchBoard] = useState({ keyword: "", category: "title" }); // 서치
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(0);
  const postsPerPage = 10; // 한 페이지에 보여줄 게시글 수

  const token = localStorage.getItem("token");

  const getUserRole = () => {
    if (!token) {
      return 0;
    }

    try {
      const base64Payload = token.split(".")[1]; // 토큰의 payload 부분 추출
      const payload = JSON.parse(atob(base64Payload)); // base64 디코딩 후 JSON 파싱
      return payload.role;
    } catch (e) {
      console.error("Token decode error:", e);
      return 0;
    }
  }

  const userRole = getUserRole();

  const fetchBoards = () => {
    setLoading(true);
    api.get('/boards/searchBoard', {
      params: {
        boardType: activeTab, // 항상 LECTURE_QNA 탭
        lectureId: lectureId,
        page: currentPage - 1,
        size: postsPerPage,
        title: searchBoard.category === "title" ? searchBoard.keyword : "",
        writer: searchBoard.category === "writerName" ? searchBoard.keyword : ""
      }
    }).then(res => {
      // res.data가 아닌 안쪽에 res.data.content를 가져와야함
      if (res.data && Array.isArray(res.data.content)) {
        setAllBoard(res.data.content);
        setTotalPage(res.data.totalPages);
      }
      setLoading(false);
    }).catch(err => {
      console.error("데이터 로드 실패: ", err);
      setAllBoard([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    setCurrentPage(1);
    setSerarchBoard({ keyword: "", category: "title" });
  }, [activeTab]); // 탭 바뀌면 검색 초기화

  useEffect(() => {
    setCurrentPage(1);
  }, [searchBoard.keyword]);

  useEffect(() => {
    fetchBoards();
  }, [activeTab, currentPage, searchBoard.keyword, searchBoard.category]);
  return (
    <section className="mx-auto px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">강의 Q&A</h1>
      {/* 목록 */}
      {loading ? (
        <div className="p-5 text-center">로딩 중...</div>
      ) : (
        <BoardListBlock boards={allBoards} />
      )}
      <QnaWriteBar lectureId={lectureId} userRole={userRole} />
      <BoardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage} />
      <BoardSearchFilter
        onSearch={(params) => {
          setSerarchBoard(params)
        }}
      />
    </section>
  );
}

function QnaWriteBar({ lectureId, userRole }: { lectureId?: string | null; userRole: any }) {
  const navigate = useNavigate();

  if (!lectureId) return null;

  const allowedRoles = ["0", "ROLE_USER", "USER"];

  if (!allowedRoles.includes(userRole)) {
    return null;
  }
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => navigate(`/class/qna/upload/${lectureId}`)}
        className="group relative flex items-center gap-2 px-6 py-2.5 
                   bg-blue-600 text-white text-sm font-bold rounded-full
                   hover:bg-blue-700 hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]
                   transition-all duration-300 active:scale-95"
      >
        글쓰기
      </button>
    </div>
  );
}
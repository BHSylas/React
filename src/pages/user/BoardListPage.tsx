import { useState, useEffect } from "react";
import { BoardListBlock } from "../../components/board/list/BoardListBlock";
import { BoardSearchFilter } from "../../components/board/list/BoardSearchFilter";
import { BoardWriteBar } from "../../components/board/list/BoardWriteBar";
import type { Board } from "../../types/Board";
import TagManu from "./BoardTag";
import type { CategoryValue } from "./BoardTag";
import { BoardPagination } from "../../components/board/list/BoardPagination";
import { api } from "../../api/axiosInstance";

export function BoardListPage() {
  // const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true); //로딩중 상태
  const [activeTab, setActiveTab] = useState<CategoryValue>(() => {
    const savedCategory = sessionStorage.getItem("recentCategory");
    if (savedCategory) {
      sessionStorage.removeItem("recentCategory");
      return savedCategory as CategoryValue;
    }
    return "NOTICE";
  });

  const [allBoards, setAllBoard] = useState<Board[]>([]); // 전체 보드
  const [searchBoard, setSerarchBoard] = useState({ keyword: "", category: "title" }); // 서치
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(0);
  const postsPerPage = 10; // 한 페이지에 보여줄 게시글 수

  const fetchBoards = () => {
    setLoading(true);
    api.get('/boards/searchBoard', {
      params: {
        boardType: activeTab, // 현재 탭에 맞는 데이터만 서버에서 가져옴
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
  }, [activeTab, currentPage, searchBoard]);

  const handleChangeTab = (tab: CategoryValue) => {
    sessionStorage.setItem("recentCategory", tab);
    setActiveTab(tab);
  }
  return (
    <section className="mx-auto px-6 py-8 space-y-6">
      {/* <div className="text-7xl text-center font-bold text-blue-800">상단이 너무 심심해 보임</div> */}
      <TagManu activeTab={activeTab} onTabChange={handleChangeTab} />
      {/* 목록 */}
      {loading ? (
        <div className="p-5 text-center">로딩 중...</div>
      ) : (
        <BoardListBlock boards={allBoards} />
      )}
      {/* 상단 액션 */}
      <BoardWriteBar />
      {/* Pagination (placeholder) */}
      {/* <div className="flex justify-center text-sm text-gray-400">
        Pagination 영역 (구현 예정) */}
      {/* <BoardSearchFilter onSearch={() => { }} /> */}
      {/* </div> */}
      <BoardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage} />
      {/* 검색 */}
      <BoardSearchFilter
        onSearch={(params) => {
          setSerarchBoard(params)
        }}
      />
    </section>
  );
}

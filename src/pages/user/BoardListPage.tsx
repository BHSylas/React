import { useState } from "react";
import { BoardListBlock } from "../../components/board/list/BoardListBlock";
import { BoardSearchFilter } from "../../components/board/list/BoardSearchFilter";
import { BoardWriteBar } from "../../components/board/list/BoardWriteBar";
import type { Board } from "../../types/Board";
import TagManu from "./BoardTag";
import type { Category } from "./BoardTag";

const MOCK_BOARDS: Board[] = [
  {
    id: 1,
    title: "첫 번째 게시글입니다",
    author: "관리자",
    createdAt: "2024-01-01",
    viewCount: 12,
    category: "공지사항",
  },
  {
    id: 2,
    title: "React 질문 있습니다",
    author: "홍길동",
    createdAt: "2024-01-02",
    viewCount: 5,
    category: "Q&A",
  },
];


export function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>(MOCK_BOARDS);
  if (boards.length === 0) {
    setBoards(MOCK_BOARDS);
    return null;
  }

  const [activeTab, setActiveTab] = useState<Category>('공지사항');
  const [allBoards] = useState<Board[]>(MOCK_BOARDS);
  const filteredBoards = allBoards.filter(board => board.category === activeTab);

  return (
    <section className="mx-auto px-6 py-8 space-y-6">
      {/* <div className="text-7xl text-center font-bold text-blue-800">상단이 너무 심심해 보임</div> */}
      <TagManu activeTab={activeTab} onTabChange={setActiveTab} />
      {/* 목록 */}
      <BoardListBlock boards={filteredBoards} />
      {/* 상단 액션 */}
      <BoardWriteBar />
      {/* Pagination (placeholder) */}
      <div className="flex justify-center text-sm text-gray-400">
        Pagination 영역 (구현 예정)
        {/* <BoardSearchFilter onSearch={() => { }} /> */}
      </div>
      {/* 검색 */}
      <BoardSearchFilter
        onSearch={() => {
          // TODO: 검색 API 연결
        }}
      />
    </section>
  );
}

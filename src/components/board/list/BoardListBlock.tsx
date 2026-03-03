import { useNavigate } from "react-router-dom";
import type { Board } from "../../../types/Board";

const CATEGORY_MAP: Record<string, string> = {
  NOTICE: '공지사항',
  FREE: '자유게시판',
  FAQ: 'FAQ',
  QNA: 'Q&A',
  LECTURE_QNA: '강의 Q&A',
  MANUAL: '매뉴얼'
};

interface BoardListBlockProps {
  boards: Board[];
}

export function BoardListBlock({ boards }: BoardListBlockProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* 헤더: 구분선 강화 (border-y) */}
      <div className="grid grid-cols-[1fr_100px_120px_100px_130px] gap-4 px-6 py-4 text-[13px] font-semibold text-gray-500 border-y border-gray-100 bg-gray-50/30">
        <span className="pl-2">제목</span>
        <span className="text-center">작성자</span>
        <span className="text-center">카테고리</span>
        <span className="text-center">날짜</span>
        <span className="text-right pr-2">조회</span>
      </div>

      <div className="flex flex-col">
        {boards.map((board, idx) => (
          <div key={`board-group-${board.boardId}-${idx}`} className="group">
            {/* 게시글 본체: 하단에만 얇은 구분선 (border-b) */}
            <div
              className={`grid grid-cols-[1fr_100px_120px_100px_130px] gap-4 px-6 py-[18px] transition-all cursor-pointer items-center border-b border-gray-100
                ${board.pinned ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'hover:bg-gray-50'}`}
              onClick={() => navigate(`/board/${board.boardId}`)}
            >
              {/* 제목 영역 */}
              <div className="flex items-center gap-3 overflow-hidden">
                {board.pinned && (
                  <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-600">
                    공지
                  </span>
                )}
                <span className={`truncate text-[15px] ${board.pinned ? 'font-semibold text-gray-900' : 'text-gray-700 font-medium'}`}>
                  {board.title || "제목없음"}
                </span>
                {board.commentCount > 0 && (
                  <span className="text-xs font-bold text-blue-500">[{board.commentCount}]</span>
                )}
              </div>

              {/* 작성자 */}
              <div className="text-center text-gray-500 text-sm italic">{board.writerName}</div>

              {/* 카테고리 배지: 톤다운된 스타일 */}
              <div className="flex justify-center">
                <span className="px-2.5 py-1 text-[11px] font-medium text-gray-400 bg-white border border-gray-200 rounded">
                  {CATEGORY_MAP[board.boardType]}
                </span>
              </div>

              {/* 날짜 */}
              <div className="text-center text-gray-400 text-xs tracking-tighter">
                {board.createdAt.split('T')[0]}
              </div>

              {/* 정보 (조회수/댓글 요약) */}
              <div className="text-right pr-2 text-xs font-medium text-gray-400">
                <span className="group-hover:text-gray-700 transition-colors uppercase"></span>{board.viewCount || 0}
              </div>
            </div>

            {/* 답변 (Reply): 구분선 안쪽으로 포함되는 느낌 */}
            {board.answered && (
              <div
                onClick={() => navigate(`/board/${board.boardId}`)}
                className="flex items-center w-full px-6 py-4 bg-blue-50/30 hover:bg-blue-50/60 transition-colors cursor-pointer border-b border-gray-100"
              >
                <div className="ml-6 mr-4 flex items-center text-gray-300">
                  <span className="text-lg">└</span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Answer</span>
                  <span className="truncate text-[14px] font-semibold">
                    {board.title} 에 대한 답변입니다.
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
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
    <div className="border-t">
      {boards.map((board) => (
        <div
          key={board.boardId}
          className={`grid grid-cols-[1fr_120px_120px_120px_70px]
                     gap-4 px-3 py-3 border-b text-sm cursor-pointer
                    ${board.pinned ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}
          onClick={() => {
            navigate(`/board/${board.boardId}`);
          }}
        >
          <div className="truncate font-medium">
            {board.title || "제목없음"}
          </div>
          <div>{board.writerName}</div>
          <div>{CATEGORY_MAP[board.boardType]}</div>
          <div>{board.createdAt.split('T')[0]}</div>
          <div className="flex justify-around">
            <div className="text-center">조회 {board.viewCount || "0"}</div>
            <div className="text-center">댓글 {board.commentCount || "0"}</div>
          </div>
          
        </div>
      ))}
    </div>
  );
}

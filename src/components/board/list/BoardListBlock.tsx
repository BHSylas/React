import type { Board } from "../../../types/Board";

interface BoardListBlockProps {
  boards: Board[];
}

export function BoardListBlock({ boards }: BoardListBlockProps) {
  return (
    <div className="border-t">
      {boards.map((board) => (
        <div
          key={board.id}
          className="grid grid-cols-[1fr_120px_120px_80px]
                     gap-4 px-3 py-3 border-b text-sm"
        >
          <div className="truncate font-medium">
            {board.title}
          </div>
          <div>{board.author}</div>
          <div>{board.createdAt}</div>
          <div className="text-right">{board.viewCount}</div>
        </div>
      ))}
    </div>
  );
}

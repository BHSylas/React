interface BoardActionBarProps {
  boardType?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  onWrite?: () => void;
}

export function BoardActionBar({
  boardType,
  onEdit,
  onDelete,
  onBack,
  onWrite,
}: BoardActionBarProps) {

  const showEditButton = boardType !== "LECTURE_QNA";

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        {showEditButton && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-1 text-sm hover:text-blue-800 hover:font-bold hover:scale-105 transition-all"
          >
            수정
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-1 text-sm hover:text-red-800 hover:font-bold hover:scale-105 transition-all"
        >
          삭제
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1 text-sm hover:text-blue-800 hover:font-bold hover:scale-105 transition-all"
        >
          목록
        </button>
        <button
          type="button"
          onClick={onWrite}
          className="px-3 py-1 text-sm hover:text-blue-800 hover:font-bold hover:scale-105 transition-all"
        >
          글쓰기
        </button>
      </div>
    </div>
  );
}

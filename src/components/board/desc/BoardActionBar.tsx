interface BoardActionBarProps {
  boardType?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  onWrite?: () => void;
  isAuthor: boolean; // 본인 확인 여부
  canDelete: boolean; // 삭제 여부가 가능한지(작성 유저인지 관리자인지)
}

export function BoardActionBar({
  boardType,
  onEdit,
  onDelete,
  onBack,
  // onWrite,
  isAuthor,
  canDelete,
}: BoardActionBarProps) {

  const showEditButton = boardType !== "LECTURE_QNA" && boardType !== "QNA";

  const baseBtnStyle = "px-5 py-2.5 text-[13px] font-black transition-all duration-200 rounded-xl active:scale-95 flex items-center justify-center";

  return (
    <div className="flex justify-between items-center py-8 border-t border-gray-100 mt-10">
      {/* 왼쪽 그룹: 수정 및 삭제 */}
      <div className="flex gap-2">
        {isAuthor && showEditButton && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className={`${baseBtnStyle} bg-blue-50 text-blue-700 border border-blue-500 hover:bg-blue-100 border border-blue-100/50`}
          >
            수정하기
          </button>
        )}
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className={`${baseBtnStyle} bg-red-50 text-red-600 border border-red-500 hover:bg-red-100 border border-red-100/50`}
          >
            삭제
          </button>
        )}
      </div>

      {/* 오른쪽 그룹: 목록 및 글쓰기*/}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onBack}
          className={`${baseBtnStyle} bg-white border border-black hover:bg-gray-100`}
        >
          목록
        </button>
        {/* <button
          type="button"
          onClick={onWrite}
          className={`${baseBtnStyle} bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200`}
        >
          글쓰기
        </button> */}
      </div>
    </div>
  );
}

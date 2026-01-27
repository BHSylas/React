interface BoardWriteBarProps {
  onWrite?: () => void;
}

export function BoardWriteBar({ onWrite }: BoardWriteBarProps) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onWrite}
        className="btn px-4 py-2 text-sm font-medium rounded-md
                   bg-blue-800 text-white hover:bg-blue-900 transition-colors"
      >
        글쓰기
      </button>
    </div>
  );
}

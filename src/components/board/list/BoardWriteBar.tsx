import { useNavigate } from "react-router";

interface BoardWriteBarProps {
  onWrite?: () => void;
}

export function BoardWriteBar({ onWrite }: BoardWriteBarProps) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => navigate('/board/upload')}
        className="group relative flex items-center gap-2 px-6 py-2.5 
                   bg-blue-600 text-white text-sm font-bold rounded-full
                   hover:bg-blue-700 hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]
                   transition-all duration-300 active:scale-95"
      >
        <span>새 글 작성</span>
      </button>
    </div>
  );
}

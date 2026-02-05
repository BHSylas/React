// Sidebar.tsx
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0
          w-96 h-screen
          bg-base-100 text-base-content
          shadow-xl
          z-50
          flex flex-col
          border border-gray-300
          transform
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="px-3 py-4 text-left text-2xl font-bold">메뉴</div>
        <button
          className="px-3 py-4 text-left transition-all hover:bg-blue-50 hover:text-blue-800 text-lg font-bold"
          onClick={() => handleNavigate("/")}
        >
          홈
        </button>

        <button
          className="px-3 py-4 text-left transition-all hover:bg-blue-50 hover:text-blue-800 text-lg font-bold"
          onClick={() => handleNavigate("/class")}
        >
          강좌 목록
        </button>

        <button
          className="px-3 py-4 text-left transition-all hover:bg-blue-50 hover:text-blue-800 text-lg font-bold"
          onClick={() => handleNavigate("/board")}
        >
          게시판
        </button>
      </aside>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
//import DetailDropdown from "./DetailDropdown";

interface DropdownProps {
  isOpen?: boolean;
  close?: () => void;
}

export function MenuDropdown({ isOpen, close }: DropdownProps) {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
    close?.(); // 모바일에서만 닫힘
  };
    return(
      <div
        className={`
          fixed left-0 z-50 flex-col shadow-xl w-60 h-screen
          bg-base-100 text-base-content rounded-xl
          ${isOpen ? "flex" : "hidden"}
        `}
      >
          <button
            className="px-3 py-4 text-left rounded-t-xl transition-all hover:bg-blue-50 hover:text-blue-800 text-lg font-bold"
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
            className="px-3 py-4 text-left rounded-b-xl transition-all hover:bg-blue-50 hover:text-blue-800 text-lg font-bold flex"
            onClick={() => handleNavigate("/board")}
          >
            게시판
          </button>
        </div>)
}
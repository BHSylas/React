import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { textLimiter } from "../../utils/textLimiter";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthModalContext } from "../../context/AuthModalContext";
import "../../global.css";
import { requestLogout } from "../../types/authService";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { isLoggedIn, logout, nickname } = useAuth();
  const { openLogin } = useContext(AuthModalContext);
  const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await requestLogout();
        } catch (e) {
            console.error("서버 로그아웃 실패:", e);
        }
        alert("로그아웃 되었습니다.");
        logout();
    };

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current + 25 && currentY > 50) {
        setVisible(false); // 아래로 스크롤
      } else if (currentY < lastScrollY.current) {
        setVisible(true); // 위로 스크롤
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll);
    if (localStorage.getItem("requireLogin") === "yes") {
      openLogin();
      localStorage.removeItem("requireLogin");
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        h-[66px] bg-white border-b border-gray-100
        transition-transform duration-300 ease-in-out shadow-sm
        flex items-center justify-between px-4 md:px-8 
        ${visible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* 왼쪽 영역 */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-xl"
          onClick={onMenuClick}
        >
          <span className="text-gray-900">☰</span>
        </button>
        <span
          className="text-xl pr-2 font-black text-blue-800 tracking-tighter cursor-pointer flex items-center gap-1"
          onClick={() => navigate("/")}
        >
          LMS
        </span>
        <span className="text-gray-200 font-light">|</span>
        <button
          onClick={() => navigate("/class")}
          className="px-2 py-1.5 font-bold text-[17px] text-black hover:text-blue-600 transition-colors"
        >
          강좌 목록
        </button>
        <span className="text-gray-200 font-light">|</span>
        <button
          onClick={() => navigate("/board")}
          className="px-2 py-1.5 font-bold text-[17px] text-black hover:text-blue-600 transition-colors"
        >
          게시판
        </button>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center text-[17px] font-bold">
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <div className="px-1 text-gray-500">
              <span className="text-gray-900 text-[15px]">{nickname !== null ? textLimiter(nickname, 15) : "사용자"}</span>
              <span className="text-[15px] text-gray-700 font-normal">님 환영합니다.</span>
            </div>
            <span className="text-gray-200 font-light">|</span>
            <button
              onClick={() => navigate("/my")}
              className="px-3 py-1.5 text-gray-700 hover:text-blue-600 transition-colors"
            >
              My Page
            </button>
            <span className="text-gray-200 font-light">|</span>
            <button
              onClick={handleLogout}
              className="px-2 py-1.5 text-blue-800 hover:text-blue-600 transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={openLogin}
              className="px-3 py-1.5 text-gray-700 hover:text-gray-900"
            >
              로그인
            </button>
            <span className="text-gray-200 font-light">|</span>
            <button
              onClick={() => navigate("/register")}
              className="px-2 py-1.5 text-blue-800 hover:text-blue-600 transition-colors"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

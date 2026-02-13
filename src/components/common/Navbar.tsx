import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { textLimiter } from "../../utils/textLimiter";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthModalContext } from "../../context/AuthModalContext";
import "../../global.css";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({onMenuClick} : NavbarProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { isLoggedIn, nickname: nickname, logout } = useAuth();
  const { openLogin } = useContext(AuthModalContext);
  const navigate = useNavigate();

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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <div
      className={`
        navbar shadow fixed z-20
        transition bg-base-100
        duration-300
        fixed-padding-adjust
        ${visible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* Hover 메뉴 그룹 */}
      <div className="flex flex-1">
        <div className="flex items-center">
          <div className="mx-4 relative flex md:gap-2 lg:gap-4 rounded-md bg-transparent">
            <div className="group flex-row lg:flex-none">
              {/* 모바일: 클릭 */}
              <button
                className="my-2 mx-1 text-xl"
                onClick={onMenuClick}
              >
                ☰
              </button>
              {/* 데스크톱: hover */}
            </div>
            <span
                className="my-2 lg:text-xl font-bold cursor-pointer text-blue-800"
                onClick={() => navigate("/")}
              >
                LMS
            </span>
          </div>
        </div>
      </div>

      {/* 로그인 / 로그아웃 영역 */}
      <div className="flex-none gap-3"> 
        <span className="font-semibold flex flex-row">
          <div className="flex flex-col">
            {isLoggedIn ? 
            <div className="flex gap-2 p-2">
              <div className="text-xl cursor-pointer" onClick={() => {navigate("/my")}}>{nickname !== null ? textLimiter(nickname, 20) + "님" : "사용자"}</div>
              <div>|</div> 
              <div className="text-lg cursor-pointer text-blue-800" onClick={logout}>로그아웃</div> 
            </div>
            :
            <div className="flex gap-2 p-2">
              <div className="text-lg cursor-pointer" onClick={openLogin}>로그인</div>
              <div>|</div> 
              <div className="text-lg text-blue-800 cursor-pointer" onClick={() => {navigate("/register")}}>회원가입</div> 
            </div> }
          </div> 
        </span>
      </div>
    </div>
  );
}

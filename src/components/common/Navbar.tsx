import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MenuDropdown } from "./MenuDropdown";
import { SettingDropdown } from "./SettingDropdown";
import home from "../../assets/home.svg";
import { textLimiter } from "../../utils/textLimiter";
import { useEffect, useRef, useState } from "react";
import AnchorBar from "../Home/Anchor";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { isLoggedIn, username, point } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setMenuOpen(false);
      setSettingOpen(false);
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 50) {
        setVisible(false); // 아래로 스크롤
      } else {
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
        navbar shadow fixed gradation z-50
        bg-gradient-to-l from-blue-950 bg-blue-800
        transition-transform duration-300
        ${visible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* Hover 메뉴 그룹 */}
      <div className="flex flex-1">
        <div className="flex items-center ">
          <div className="mx-4 relative flex md:gap-2 lg:gap-4 rounded-md bg-transparent">
            <div className="group flex-row lg:flex-none">
              {/* 모바일: 클릭 */}
              <button
                className="my-2 mx-1 text-xl lg:hidden"
                onClick={() => {setSettingOpen(false); setMenuOpen(v => !v)}}
              >
                ☰
              </button>
              {/* 데스크톱: hover */}
              <span className="my-2 lg:mx-2 text-xl hidden lg:inline">☰</span>
              <span
                className="my-2 lg:text-xl font-bold"
                onClick={() => navigate("/")}
              >
                Paralympic Studio
              </span>
              <MenuDropdown
                isOpen={menuOpen}
                close={() => setMenuOpen(false)}
              />
            </div>
            <div className="flex items-center">
              <img src={home} alt="profile" className="w-6 h-6 mt-1 cursor-pointer" onClick={() => {setMenuOpen(false); setSettingOpen(false); navigate("/")}}/>
            </div>
        </div>
        {/* Hover Dropdown */}
        </div>
        <div className="hidden lg:flex flex-1">
          <AnchorBar transparency={true}/>
        </div>
      </div>

      {/* 로그인 / 로그아웃 영역 */}
      <div className="flex-none gap-3 group">
        {isLoggedIn && 
        <span className="font-semibold flex flex-row">
          <div className="flex flex-col">
            <div className="text-xl lg:hidden">{username !== null ? textLimiter(username?.split('@')[0], 5) + "님" : "로그인"}</div>
            <div className="text-xl hidden lg:block">{username !== null ? textLimiter(username?.split('@')[0], 20) + "님" : "로그인이 필요합니다."}</div> 
            <div>({point !== null ? point : 0} 포인트)</div>
          </div> 
          <button
                className="my-2 mx-1 text-xl"
                onClick={() => {setMenuOpen(false); setSettingOpen(v => !v)}}
              >
                ☰
              </button>
        </span>
        }
        <SettingDropdown isOpen={settingOpen} close={() => setSettingOpen(false)} />
      </div>
    </div>
  );
}

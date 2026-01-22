import { useNavigate } from "react-router-dom";
import home from "../../assets/home.svg";
import { useEffect, useRef, useState } from "react";


export function LoginNavbar() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
      const onScroll = () => {
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
      <div className="flex-1">
        <div className="flex">
          <div className="mx-4 relative flex gap-2 lg:gap-4 rounded-md">
          {/* Anchor 역할 */}
          <h1
            className="font-bold text-xl"
          >
            Paralympic Studio
          </h1>
        </div>
        <div className="flex items-center">
              <img src={home} alt="profile" className="w-6 h-6 mt-1 cursor-pointer" onClick={() => {navigate("/feed")}}/>
            </div>
        </div>
      </div>

      {/* 로그인 / 로그아웃 영역 */}
      <div className="flex-none gap-3 group">
        <span className="font-semibold flex flex-row cursor-pointer" onClick={() => navigate('/login')}>
          로그인하세요
        </span>
      </div>
    </div>
  );
}

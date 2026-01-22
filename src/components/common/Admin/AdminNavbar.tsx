import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { SettingDropdown } from "../SettingDropdown";
import { AdminMenu } from "./AdminMenu";
import home from "../../../assets/home.svg";

export function AdminNavbar() {
  const { isLoggedIn, username } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-200 shadow relative">
      {/* Hover 메뉴 그룹 */}
      <div className="flex-1">
        <div className="inline-block">
          <div className="mx-4 relative flex md:gap-2 lg:gap-4 rounded-md bg-base-300">
            <div className="group">
              <a className="m-2 lg:my-0 text-xl cursor-pointer group">☰</a>
              <a
                className="font-bold text-xl cursor-pointer"
                onClick={() => navigate("/")}
              >
                Paralympic Studio
              </a>
              <AdminMenu />
            </div>
          <img src={home} alt="profile" className="w-6 h-6 mt-1 cursor-pointer" onClick={() => {navigate("/")}}/>
        </div>
        {/* Hover Dropdown */}
        </div>
      </div>

      {/* 로그인 / 로그아웃 영역 */}
      <div className="flex-none gap-3 group">
        {isLoggedIn && <span className="font-semibold">관리자: {username?.split('@')[0]} <a className="m-2 lg:my-0 text-xl cursor-pointer">☰</a> </span>}
        <SettingDropdown />
      </div>
    </div>
  );
}

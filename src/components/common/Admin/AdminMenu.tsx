import { useNavigate } from "react-router-dom";

export function AdminMenu() {
    const navigate = useNavigate();
    return(<div
          className="absolute left-0 z-50 flex-col hidden border shadow-xl group-hover:flex w-72 bg-base-100 text-base-content rounded-xl border-base-300"
        >
          <div className="flex flex-row">
          <button className="flex-1 px-4 py-3 text-left hover:bg-base-200" onClick={() => navigate("/players")}>선수 목록</button>
          <button className="px-4 py-3 text-left hover:bg-base-200" onClick={() => navigate("/admin/players")}>관리자: 선수 관리</button>
          </div>
          <div className="flex flex-row">
          <button className="flex-1 px-4 py-3 text-left hover:bg-base-200" onClick={() => navigate("/predictions")}>승부예측</button>
          <button className="px-4 py-3 text-left hover:bg-base-200" onClick={() => navigate("/admin/predictions")}>관리자: 매치 관리</button>
          </div>
          <div className="flex flex-row">
          <button className="flex-1 px-4 py-3 text-left hover:bg-base-200" onClick={() => navigate("/posts")}>게시판</button>
          <button className="px-4 py-3 text-left hover:bg-base-200 " onClick={() => navigate("/admin/posts")}>관리자: 게시판 관리</button>
          </div>
          <div className="flex flex-row">
          <button className="flex-1 px-4 py-3 text-left hover:bg-base-200" onClick={() => navigate("/videos")}>동영상</button>
          <button className="px-4 py-3 text-left hover:bg-base-200 " onClick={() => navigate("/admin/videos")}>관리자: 동영상 관리</button>
          </div>
          <div className="flex flex-row">
          <button className="flex-1 px-4 py-3 text-left hover:bg-base-200" onClick={() => navigate("/live")}>생중계</button>
          </div>
          <div className="flex flex-row">
          <button className="flex-1 px-4 py-3 text-left hover:bg-base-200" onClick={() => navigate("/news")}>뉴스</button>
          </div>
        </div>)
}
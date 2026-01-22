import { useNavigate } from "react-router-dom";
import live from "../../assets/live.svg";
import video from "../../assets/video.svg";
import news from "../../assets/news.svg";
import profile from "../../assets/profile.svg";
import prediction from "../../assets/prediction.svg";
import post from "../../assets/post.svg";

export default function AnchorBar({transparency = false}: {transparency?: boolean}) {
    const navigate = useNavigate();
    return(
        <div className={`w-full bg-transparent flex flex-col items-center justify-center`}>
            <div className={`grid grid-cols-3 md:grid-cols-6 ${transparency ? "divide-x divide-slate-50/70" : "gap-2"}`}>
                <button className={`p-2 ${transparency ? "flex justify-center items-center hover:text-blue-300" : "btn bg-base-100 hover:btn-primary hover:scale-105"}  transition-all`} onClick={() => navigate("/players")}>
                    <img src={profile} alt="profile" className="w-6 h-6"/>
                    <h1>선수 목록</h1>
                </button>
                <button className={`p-2 ${transparency ? "flex justify-center items-center hover:text-blue-300" : "btn bg-base-100 hover:btn-primary hover:scale-105"} transition-all`} onClick={() => navigate("/predictions")}>
                    <img src={prediction} alt="prediction" className="w-6 h-6"/>
                    <h1>승부 예측</h1>
                </button>
                <button className={`p-2 ${transparency ? "flex justify-center items-center hover:text-blue-300" : "btn bg-base-100 hover:btn-primary hover:scale-105"} transition-all`} onClick={() => navigate("/posts")}>
                    <img src={post} alt="post" className="w-6 h-6"/>
                    <h1>게시판</h1>
                </button>
                <button className={`p-2 ${transparency ? "flex justify-center items-center hover:text-blue-300" : "btn bg-base-100 hover:btn-primary hover:scale-105"} transition-all`} onClick={() => navigate("/videos")}>
                    <img src={video} alt="video" className="w-6 h-6"/>
                    <h1>동영상</h1>
                </button>
                <button className={`p-2 ${transparency ? "flex justify-center items-center hover:text-blue-300" : "btn bg-base-100 hover:btn-primary hover:scale-105"} transition-all`} onClick={() => navigate("/live")}>
                    <img src={live} alt="live" className="w-6 h-6"/>
                    <h1>라이브</h1>
                </button>
                <button className={`p-2 ${transparency ? "flex justify-center items-center hover:text-blue-300" : "btn bg-base-100 hover:btn-primary hover:scale-105"} transition-all`} onClick={() => navigate("/news")}>
                    <img src={news} alt="news" className="w-6 h-6"/>
                    <h1>뉴스</h1>
                </button>
            </div>
        </div>
    )
}
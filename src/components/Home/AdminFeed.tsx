import { useNavigate } from "react-router-dom";
import type { FeedDto } from "../../types/FeedDto";
import type { MatchDto } from "../../types/MatchDto";
import PredictionCard from "../predictions/PredictionCard";
import YtPlayer from "../Youtube/YtPlayer";
import { smartInterleave } from "../../utils/interleaveFeed";
import { pickPostImageFromItem } from "../../utils/pickPostImageFromItem";
import getName from "../../utils/getName";
import live from "../../assets/live.svg";
import video from "../../assets/video.svg";
import prediction from "../../assets/prediction.svg";
import post from "../../assets/post.svg";
import { textLimiter } from "../../utils/textLimiter";

export default function AdminFeed({feedItems} : {feedItems : FeedDto[]}) {
    const navigate = useNavigate();
    const renderFeedItem = (item: FeedDto) => {
        switch(item.itemType) {
            case "MATCH":
                {
                    const match : MatchDto = {
                        id: 0,
                        teamA: item.title.split(" vs. ")[0] || "Team A",
                        teamB: item.title.split(" vs. ")[1] || "Team B",
                        homeAmount: parseInt(item.metadata.split(" : ")[0]) || 100,
                        awayAmount: parseInt(item.metadata.split(" : ")[1]) || 0,
                        yourPrevBet: 0,
                        matchDate: item.published,
                        description: "",
                        predictionOpen: true,
                        alreadyPredicted: false,
                        yourPrevResult: "NONE",
                    }
                    return (
                        <div className="w-full cursor-pointer bg-base-300 p-2 rounded-xl group" key={item.order} onClick={() => {navigate('/predictions')}}>
                            <div className="flex m-4 justify-center">
                                <img src={prediction} alt="Prediction Icon" className="w-8 h-8 mr-2"/>
                                <p className="font-bold text-2xl text-center">최신 매치 정보</p>
                            </div>
                            <div className="p-3 group-hover:p-2 transition-all bg-base-300">
                                <PredictionCard key={item.order} match={match} interactive={false}/>
                            </div>
                            <p className="font-bold text-sm text-center">눌러서 예측 페이지로</p>
                        </div>
                    );
                }
            case "LIVE":
                {   
                return(
                    <div className="w-full cursor-pointer bg-base-300 p-2 rounded-xl" key={item.order} onClick={() => {navigate('/videos')}}>
                        <div className="flex m-4 justify-center">
                            <img src={live} alt="Live Icon" className="w-8 h-8 mr-2"/>
                            <h2 className="font-bold text-2xl text-center">생중계 진행 중: {item.title}</h2>
                        </div>
                            <div className="p-4 bg-base-300">
                                <YtPlayer videoId={item.metadata} auto={true} />
                            </div>
                        </div>
                ) 
            }
            case "VIDEO":
                {
                    return (
                        <div className="w-full cursor-pointer bg-base-300 p-2 rounded-xl" key={item.order} onClick={() => {navigate('/videos')}}>
                            <div className="flex m-4 justify-center">
                                <img src={video} alt="Video Icon" className="w-8 h-8 mr-2"/>
                                <h2 className="font-bold text-2xl text-center">최신 동영상: {textLimiter(item.title, 12)}</h2>
                            </div>
                            <div className="p-4 bg-base-300">
                                <YtPlayer videoId={item.metadata} auto={false} />
                            </div>
                        </div>
                    );
                }
            case "POST":
                {
                    return (
                        <div className="w-full cursor-pointer bg-base-300 p-2 rounded-xl group" key={item.order} onClick={() => {navigate(`/posts/${item.metadata.split("{")[1]}`)}}>
                            <div className="flex m-4 justify-center">
                                <img src={post} alt="Prediction Icon" className="w-8 h-8 mr-2"/>
                                <h2 className="font-bold text-2xl text-center">{item.metadata.length != 0 ? getName(item.metadata.split("{")[0]) + "님의" : "최신"} 게시글: {item.title}</h2>
                            </div>
                            <div className="w-full h-64 bg-base-100 rounded-xl overflow-hidden">
                                <img
                                    src={pickPostImageFromItem(item)}
                                    alt={`Post Cover ${pickPostImageFromItem(item)}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    loading="lazy"
                                />
                            </div>
                            <p className="font-bold text-sm text-center m-1">눌러서 게시판 페이지로</p>
                        </div>
                    );
            }
            default:
                return <div key={item.order}>알 수 없는 피드 항목</div>;
        }
    };
    const liveItems = feedItems.filter(i => i.itemType === "LIVE");
const normalItems = feedItems.filter(i => i.itemType !== "LIVE");

const arrangedNormal = smartInterleave(normalItems);
const mixedFeedItems = [...liveItems, ...arrangedNormal];

    return (
        <div className="space-y-4">
            {mixedFeedItems.map(renderFeedItem)}
        </div>
    );
}
import { useNavigate } from "react-router-dom";
import { type ClassItem } from "../../../types/ClassItem";
import { api } from "../../../api/axiosInstance";
import { useEffect, useState } from "react";

interface ClassListProps {
  classList: ClassItem[];
  dimmed?: boolean;
  viewType?: "list" | "card";
}

const SERVER_URL = "http://localhost:8080";

const COUNTRY_NAMES: Record<string, string> = {
  USA: "미국",
  JAPAN: "일본",
  CHINA: "중국",
  GERMANY: "독일",
  ITALY: "이탈리아",
};

export default function ClassList({ classList, dimmed, viewType = "list" }: ClassListProps) {

  return (
    <div
      className={`transition-opacity ${dimmed ? "opacity-40 pointer-events-none" : "opacity-100"
        } ${viewType === "card" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"} `}
    >
      {classList.map((item) => (
        <div className="block cursor-pointer" key={item.lectureId}>
          {viewType === "list" ? (<ClassListItem key={item.lectureId} item={item} />) :
            (<ClassCardItem key={item.lectureId} item={item} />)}
        </div>
      ))}
    </div>
  );
}

function ClassListItem({ item }: { item: ClassItem }) {
  const navigate = useNavigate();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    api.get(`/lectures/${item.lectureId}/video`).then((res) => {
      const data = res.data;
      if (!data) return;

      if (data?.sourceType === "YOUTUBE" && data.youtubeVideoId) {
        setThumbnailUrl(`https://img.youtube.com/vi/${data.youtubeVideoId}/0.jpg`);
      } else if (data.thumbnailUrl) {
        const fullPath = data.thumbnailUrl.startsWith('http')
          ? data.thumbnailUrl : `${SERVER_URL}${data.thumbnailUrl}`;
        setThumbnailUrl(fullPath);
      } else {
        setThumbnailUrl(undefined);
      }
    }).catch((e) => console.error("썸네일 정보 가져오기 실패", e));
  }, [item.lectureId]);

  return (
    <div
      className="group flex gap-6 p-4 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-blue-200 hover:shadow-[0_10px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
      onClick={() => { navigate(`/class/${item.lectureId}`) }}
    >
      {/* 썸네일 영역: 살짝 더 둥글게 처리 */}
      <div className="w-44 h-28 bg-gray-50 rounded-[1rem] overflow-hidden flex-shrink-0 border border-gray-50">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
            No Image
          </div>
        )}
      </div>

      {/* 텍스트 영역: 위계 질서 강화 */}
      <div className="flex flex-col justify-center min-w-0 py-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-tighter">
            {COUNTRY_NAMES[item.country]}
          </span>
          <span className="text-[11px] font-bold text-gray-400">{item.professorNickname}</span>
        </div>
        <h3 className="text-lg font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm mt-1.5 text-gray-500 line-clamp-1 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function ClassCardItem({ item }: { item: ClassItem }) {
  const navigate = useNavigate();

  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    api.get(`/lectures/${item.lectureId}/video`).then((res) => {
      const data = res.data;

      if (!data) return;

      if (data?.sourceType === "YOUTUBE" && data.youtubeVideoId) {
        setThumbnailUrl(`https://img.youtube.com/vi/${data.youtubeVideoId}/0.jpg`);
      } else if (data.thumbnailUrl) {
        const fullPath = data.thumbnailUrl.startsWith('http')
          ? data.thumbnailUrl : `${SERVER_URL}${data.thumbnailUrl}`;
        setThumbnailUrl(fullPath);
      } else {
        setThumbnailUrl(undefined);
      }
    }).catch((e) => console.error("썸네일 정보 가져오기 실패", e));
  }, [item.lectureId]);

  return (
    <div 
      className="group flex flex-col bg-white border border-gray-100 rounded-[1rem] overflow-hidden cursor-pointer transition-all duration-500 isolate hover:border-blue-400 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 transform-gpu" 
      onClick={() => { navigate(`/class/${item.lectureId}`) }}
    >
      {/* 썸네일 영역 */}
      <div className="relative w-full h-48 bg-gray-50 overflow-hidden rounded-t-[1rem]">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-t-[1rem]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
            No Image
          </div>
        )}
      </div>

      {/* 카드 텍스트 내용 */}
      <div className="p-6 space-y-2 bg-white">
        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">{item.professorNickname}</p>
        <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed pt-1">
          {item.description}
        </p>
      </div>
    </div>
  );
}
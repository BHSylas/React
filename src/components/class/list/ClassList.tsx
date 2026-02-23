import { useNavigate } from "react-router-dom";
import { type ClassItem } from "../../../types/ClassItem";
import { api } from "../../../api/axiosInstance";
import { useState } from "react";


interface ClassListProps {
  classList: ClassItem[];
  dimmed?: boolean;
  viewType?: "list" | "card";
}

export default function ClassList({ classList, dimmed, viewType = "list" }: ClassListProps) {
  
  return (
    <div
      className={`space-y-4 transition-opacity ${
        dimmed ? "opacity-40 pointer-events-none" : "opacity-100"
      } ${viewType === "card" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"} `}
    >
      {classList.map((item) => (
        <div className="block" key={item.lectureId}>
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
  api.get(`/lectures/${item.lectureId}/video`).then((res) => {
          const data = res.data;
          if(data.sourceType === "YOUTUBE" && data.youtubeVideoId) {
            setThumbnailUrl(`https://img.youtube.com/vi/${data.youtubeVideoId}/0.jpg`);
          }
        });
  return (
    <div className="flex gap-4 p-3 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {navigate(`/class/${item.lectureId}`)}}>
      <div className="w-40 h-24 bg-gray-300 rounded">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            섬네일 없음
          </div>
        )}
      </div>
      <div>
        <h3 className="font-bold">{item.title}</h3>
        <p className="text-sm text-gray-600">
          {item.professorNickname} · {item.country}
        </p>
        <p className="text-sm mt-2 text-gray-700">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function ClassCardItem({ item }: {item:ClassItem}) {
  const navigate = useNavigate();
  return(
        <div className="flex flex-col border rounded-xl overflow-hidden cursur-pointer hover:-translate-y-1 transition-all" onClick={() => {navigate(`/class/${item.lectureId}`)}}>
      <div className="w-full h-48 bg-gray-300" />
      <div>
        <h3 className="font-bold">{item.title}</h3>
        <p className="text-sm text-gray-600">
          {item.professorNickname} · {item.country}
        </p>
        <p className="text-sm mt-2 text-gray-700">
          {item.description}
        </p>
      </div>
    </div>
  )
}
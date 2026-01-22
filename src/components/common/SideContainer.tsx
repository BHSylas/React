// src/components/Side/SideContainer.tsx

import { useState, useEffect } from "react";
import { api } from "../../api/axiosInstance";
import type { NewsDto } from "../../types/NewsDto";
import SideNews from "../sideElements/SideNews";

//import SideElement from "../sideElements/SideElement"
export default function SideContainer({ onPreview }: { onPreview: (nw: NewsDto) => void }) {
  const [news, setNews] = useState<NewsDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/news/olympic")
      .then((res) => setNews(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">불러오는 중...</div>;
  }
  return (
    <aside className="hidden lg:flex bg-base-200 flex-col w-80 space-y-4 rounded-xl m-6">
      <div className="h-min-40 flex flex-col items-center justify-center mx-4 mt-4">
        {news.length === 0 && (
          <p className="bg-base-100 shadow rounded-xl p-4 h-20 flex items-center justify-center text-base-content/60 mx-2 my-2">
            뉴스를 받아올 수 없었습니다.
          </p>
        )}

        {news.map((nw) => (
          <SideNews key={nw.id} news={nw} onPreview={() => onPreview(nw)} />
        ))}
      </div>
    </aside>
  );
}

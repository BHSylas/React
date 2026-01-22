import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import {type NewsDto} from "../../types/NewsDto";
import NewsBlock from "../../components/news/NewsBlock";

export default function NewsListPage() {
  const [news, setNews] = useState<NewsDto[]>([]);
  const [desc, setDesc] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/news/olympic")
      .then((res) => setNews([...res.data.items].slice(0, 12)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">불러오는 중...</div>;
  return (
    <div className="w-full bg-base-200 max-w-5xl mx-auto p-4 space-y-4 rounded-xl">
      <div className="flex flex-row">
        <h1 className="mx-2 text-2xl font-bold mb-4 flex flex-1">뉴스</h1>
        <h1 className="btn mx-2 text-2xl font-bold mb-4" onClick={() => {
          setDesc(desc !== true)
          setNews(prev => [...prev].reverse());
        }}>{desc === true ? "보는 중: 최신" : "보는 중: 이전"}</h1>
      </div>
      {news.length === 0 && (
        <p className="text-base-content/60">뉴스를 받아올 수 없었습니다.</p>
      )}
      {/* TODO: Add news blocks(Side & Main) */}
      {news.map((nw) => (
        <div>
          <NewsBlock key={nw.id} news={nw}/>
        </div>
      ))}
    </div>
  );
}

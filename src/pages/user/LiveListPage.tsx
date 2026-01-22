import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import type { LiveDto } from "../../types/LiveDto";
import YtCard from "../../components/Youtube/LiveCard";

export default function LiveListPage() {
  const [onLive, setOnLive] = useState(false);
  const [videos, setVideos] = useState<LiveDto[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/live-status")
      .then((res) => {
        setOnLive(res.data.isLive);
        setVideos(res.data.videos ?? null);
        })
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="p-6">불러오는 중...</div>;

  return (
    <div className="w-full bg-base-200 max-w-5xl mx-auto p-4 space-y-4 rounded-xl">
      <h1 className="mx-2 text-2xl font-bold mb-4">라이브스트리밍</h1>
      {!onLive && (
        <p className="text-base-content/60">현재 진행 중인 생중계가 없습니다.</p>
      )}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
        {videos != undefined && videos.map(video => (
          <YtCard key={video.videoId} video={video} auto={true} interactive={true} />
        ))}
      </div>
    </div>
  );
}
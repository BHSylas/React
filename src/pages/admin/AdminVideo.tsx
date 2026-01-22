import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import type { VideoResponseDto } from "../../types/VideoResponseDto";
import AdminVideoCard from "../../components/video/AdminVideoCard";
import VideoUploadModal from "../../components/video/VideoUploadModal";
import VideoEditModal from "../../components/video/VideoEditModal";

export default function AdminVideo() {
  const [videos, setVideos] = useState<VideoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoResponseDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchVideos = () => {
    setLoading(true);
    api
      .get("/videos/list")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };
  // 삭제 처리
  const handDelete = (id: number) => {
    if (!window.confirm("정말 이 영상을 삭제하시겠습니까?")) return;

    api.delete("/videos/admin/" + id)
    .then(() => {
      alert("삭제되었습니다.");
      fetchVideos();
    })
    .catch((err) => alert("삭제 실패:" + err.message));
  };
  // 수정 모달 열기
  const handleEditClick = (video: VideoResponseDto) => {
    setSelectedVideo(video);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading && videos.length === 0)
    return <div className="p-6">불러오는 중...</div>;

  return (
    <div className="w-full bg-base-200 max-w-5xl mx-auto p-4 space-y-4 rounded-xl">
      <div className="flex flex-row items-center">
        <h1 className="mx-2 text-2xl font-bold mb-6 flex flex-1">동영상 목록</h1>
        {/* 버튼 클릭 시 모달 열기 */}
        <button
          className="btn btn-primary btn-outline"
          onClick={() => setIsUploadModalOpen(true)}
        >
          + 새 영상 업로드
        </button>
      </div>

      {videos.length === 0 && (
        <p className="p-2 text-base-content/60">등록된 동영상이 없습니다.</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <AdminVideoCard key={video.videoId} video={video}
          onEdit={() => handleEditClick(video)}
          onDelete={() => handDelete(video.id)} />
        ))}
      </div>

      {/* 업로드 모달 연결 */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchVideos}
      />
      {/* 수정 모달 연결 */}
      {selectedVideo && (
        <VideoEditModal
        isOpen={isEditModalOpen}
        video={selectedVideo}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVideo(null);
        }}
        onSuccess={fetchVideos}
        />
      )}
    </div>
  );
}

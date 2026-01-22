import type { VideoResponseDto } from "../../types/VideoResponseDto";

interface AdminVideoCardProps {
  video: VideoResponseDto;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AdminVideoCard({ video, onEdit, onDelete }: AdminVideoCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-base-100 border-base-300">
      {/* 썸네일 영역 */}
      <div className="mb-3 overflow-hidden rounded-md aspect-video bg-base-300">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* 제목 영역 */}
      <h3 className="font-bold line-clamp-1 text-base-content">
        {video.title}
      </h3>

      {/* 관리자 도구 버튼 영역 */}
      <div className="flex justify-end mt-4 space-x-2">
        <button className="p-4 btn btn-xs btn-primary btn-outline"
        onClick={onEdit}>수정</button>
        <button className="p-4 ml-4 btn btn-xs btn-error btn-outline"
        onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  );
}

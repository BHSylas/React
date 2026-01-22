import { type VideoResponseDto } from "../../types/VideoResponseDto";
import { textLimiter } from "../../utils/textLimiter";

interface VideoPlayerModalProps {
  video: VideoResponseDto | null;
  onClose: () => void;
}

export default function VideoPlayerModal({
  video,
  onClose,
}: VideoPlayerModalProps) {
  if (!video) return null;

  return (
    <div className="modal modal-open">
      <div className="relative w-11/12 max-w-5xl">
        <button
          className="absolute z-50 text-white border-none btn btn-sm btn-circle -right-0 md:-right-8 -top-10 bg-black/40 hover:bg-black"
          onClick={onClose}
        >
          X
        </button>
        <div className="relative w-full p-0 overflow-hidden shadow-2xl max-w-none modal-box bg-base-100 rounded-2xl">
          
          {/* 유튜브 플레이어 영역 */}
          <div className="w-full h-full aspect-video">
            <iframe
              className="w-full h-full"
              src={
                "https://www.youtube.com/embed/" + video.videoId + "?autoplay=1"
              }
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* 하단 정보 영역 */}
          <div className="p-6 text-left">
            <h2 className="text-2xl font-bold">{textLimiter(video.title, 100)}</h2>
            <div className="flex items-center gap-2 mt-4">
              {video.keyword && (
                <span className="badge badge-outline opacity-70">
                  # {video.keyword}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

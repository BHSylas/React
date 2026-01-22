import type { VideoResponseDto } from "../../types/VideoResponseDto";
import NotInteractiveVideo from "../video/NotInteractiveVideo";

interface LiveBlockListProps {
  items: VideoResponseDto[];
  onSelect: (match: any) => void;
}

export default function LiveBlockList({items, onSelect,}: LiveBlockListProps) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-base-content/60">
        선택 가능한 동영상이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex gap-4 pb-2">
      {items.map((video) => (
        <div
          key={video.videoId}
          className="
            shrink-0
            cursor-pointer
            transition-transform
            hover:scale-[1.02]
          "
          onClick={() => onSelect(video)}
        >
          <NotInteractiveVideo
            video={video}
          />
        </div>
      ))}
    </div>
  );
}

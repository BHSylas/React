import type { LiveDto } from "../../types/LiveDto";
import LiveCard from "../Youtube/LiveCard";

interface LiveBlockListProps {
  items: LiveDto[];
  onSelect: (match: any) => void;
}

export default function LiveBlockList({items, onSelect,}: LiveBlockListProps) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-base-content/60">
        선택 가능한 라이브가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex gap-4 pb-2">
      {items.map((live) => (
        <div
          key={live.videoId}
          className="
            shrink-0
            cursor-pointer
            transition-transform
            hover:scale-[1.02]
          "
          onClick={() => onSelect(live)}
        >
          <LiveCard
            video={live}
            auto={false}
            interactive={false}
          />
        </div>
      ))}
    </div>
  );
}

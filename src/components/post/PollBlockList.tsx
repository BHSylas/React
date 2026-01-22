import PredictionCard from "../predictions/PredictionCard";
import { type MatchDto } from "../../types/MatchDto";

interface PollBlockListProps {
  items: MatchDto[];
  onSelect: (match: any) => void;
}

export default function PollBlockList({items, onSelect,}: PollBlockListProps) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-base-content/60">
        선택 가능한 매치가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex gap-4 pb-2">
      {items.map((match) => (
        <div
          key={match.id}
          className="
            shrink-0
            cursor-pointer
            transition-transform
            hover:scale-[1.02]
          "
          onClick={() => onSelect(match)}
        >
          <PredictionCard
            match={match}
            interactive={false}
          />
        </div>
      ))}
    </div>
  );
}

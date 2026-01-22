import { useEffect, useState, type JSX } from "react";
import { api } from "../../api/axiosInstance";
import type { MatchDto } from "../../types/MatchDto";
import PollBlockList from "./PollBlockList";

type BlockPickerPanelProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (type: any) => void;
};

export default function BlockPickerPanel({
  open,
  onClose,
  onSelect,
}: BlockPickerPanelProps) {
    const [predictionMap, setPredictionMap] = useState<Record<number, MatchDto>>({});
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState<"live" | "poll" | "video" | "image">("live");
    useEffect(() => {
  if (!open) return;
  setLoading(true);
  api.get("/predictions/matches")
    .then(res => {
      const map: Record<number, MatchDto> = {};
      res.data.forEach((match : MatchDto) => {
        map[match.id] = match;
      });
      setPredictionMap(map);
    })
    .finally(() => setLoading(false));
}, [open]);

function LiveBlockList() {
  return <div>라이브 블록 선택 UI</div>;
}

function VideoBlockList() {
  return <div>영상 블록 선택 UI</div>;
}

function ImageBlockList() {
  return <div>이미지 블록 선택 UI</div>;
}

const listMap: Record<typeof opened, JSX.Element> = {
  live: <LiveBlockList />,
  poll: <PollBlockList items={Object.values(predictionMap)} onSelect={onSelect} />,
  video: <VideoBlockList />,
  image: <ImageBlockList />,
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* panel */}
      <div className="
        relative w-full bg-base-100 rounded-t-xl p-4
        sm:overflow-x-auto sm:flex sm:gap-4
        md:overflow-y-auto md:block
      ">
        <h2 className="font-semibold mb-3">블록 추가</h2>

        <div className="
          flex justify-around
        ">
          <button
            className="btn btn-primary p-2 px-4"
            onClick={() => {
                setOpened("live");
            }}
          >
            라이브
          </button>

          <button
            className="btn btn-primary p-2 px-4"
            onClick={() => {
                setOpened("poll");
            }}
          >
            투표
          </button>
          <button
            className="btn btn-primary p-2 px-4"
            onClick={() => {
                setOpened("video");
            }}
          >
            영상
          </button>
        </div>
        {loading ? <div>로딩 중...</div> : listMap[opened]}
      </div>
    </div>
  );
}

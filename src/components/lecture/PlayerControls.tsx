import { formatTime } from "../../utils/time";

type Props = {
  currentSec: number;
  maxWatchedSec: number;
  durationSec: number;
  isPlaying: boolean;
  playbackRate: number;

  onTogglePlay: () => void;
  onSeek: (nextSec: number) => void;
  onChangeRate: (rate: number) => void;
};

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function PlayerControls({
  currentSec,
  maxWatchedSec,
  durationSec,
  isPlaying,
  playbackRate,
  onTogglePlay,
  onSeek,
  onChangeRate,
}: Props) {
  const safeDuration = Number.isFinite(durationSec) && durationSec > 0 ? durationSec : 0;
  const seekMax = Math.min(maxWatchedSec, safeDuration || maxWatchedSec);

  return (
    <div className="w-full rounded-2xl bg-base-200 p-4 shadow">
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={onTogglePlay}>
          {isPlaying ? "일시정지" : "재생"}
        </button>

        <div className="flex items-center gap-2 text-sm opacity-90">
          <span className="font-mono">{formatTime(currentSec)}</span>
          <span className="opacity-60">/</span>
          <span className="font-mono">{formatTime(safeDuration)}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="block">
            <span className="text-sm opacity-70">⏩</span>
          </div>
          <select
            className="select select-bordered select-sm"
            value={playbackRate}
            onChange={(e) => onChangeRate(Number(e.target.value))}
          >
            {RATES.map((r) => (
              <option key={r} value={r}>
                {r}x
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <input
          type="range"
          className="range range-sm range-primary w-full"
          min={0}
          max={Math.max(0, safeDuration)}
          step={1}
          value={Math.max(0, Math.min(currentSec, safeDuration))}
          onChange={(e) => onSeek(Number(e.target.value))}
        />
        <div className="mt-2 flex justify-between text-xs opacity-70">
          <span>0:00</span>
          <span>최대 이동 가능: {formatTime(seekMax)}</span>
          <span>{formatTime(safeDuration)}</span>
        </div>
      </div>
    </div>
  );
}

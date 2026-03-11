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
    <div className="w-full rounded-[1.5rem] bg-gray-50 p-6 shadow-sm border-2 border-black text-black">

      {/* 상단: 시간 표시 및 배속 설정 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-black shadow-sm">
          <span className="text-[15px] font-black font-mono text-blue-600">
            {formatTime(currentSec)}
          </span>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-[15px] font-bold font-mono">
            {formatTime(safeDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-black uppercase tracking-wider">Speed</span>
          <select
            className="bg-white text-gray-700 text-sm font-bold rounded-lg px-2 py-1.5 border border-black cursor-pointer transition-all"
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

      {/* 중앙: 프로그레스 바 영역 */}
      <div className="px-1">
        <input
          type="range"
          className="w-full h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          min={0}
          max={Math.max(0, safeDuration)}
          step={1}
          value={Math.max(0, Math.min(currentSec, safeDuration))}
          onChange={(e) => onSeek(Number(e.target.value))}
        />
        <div className="mt-3 flex justify-between text-[13px] font-bold tracking-tight px-0.5">
          <span className="text-gray-600">0:00</span>
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 text-[15px]">
            최대 이동: {formatTime(seekMax)}
          </span>
          <span className="text-gray-600">{formatTime(safeDuration)}</span>
        </div>
      </div>

      {/* 하단: 메인 컨트롤 버튼 */}
      <div className="flex justify-center items-center gap-10 mt-8">
        {/* 뒤로 가기 */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-600 rounded-full border border-black shadow-sm transition-all active:scale-90"
            onClick={() => onSeek(currentSec - 5 * playbackRate)}
          >
            <span className="text-lg text-black">↺</span>
          </button>
          <p className="text-[12px] font-black text-black">-{5 * playbackRate}s</p>
        </div>

        {/* 재생/일시정지 메인 버튼 */}
        <button
          className="w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          onClick={onTogglePlay}
        >
          <span className="text-xl ml-0.5">{isPlaying ? "❙❙" : "▶"}</span>
        </button>

        {/* 앞으로 가기 */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-600 rounded-full border border-black shadow-sm transition-all active:scale-90"
            onClick={() => onSeek(currentSec + 5 * playbackRate)}
          >
            <span className="text-lg text-black">↻</span>
          </button>
          <p className="text-[12px] font-black text-black">+{5 * playbackRate}s</p>
        </div>
      </div>
    </div>
  );
}

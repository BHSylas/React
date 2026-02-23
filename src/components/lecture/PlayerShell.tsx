import { useRef, useState } from "react";
import type { LecturePlaybackInit } from "../../types/lecture";
import type { PlayerHandle } from "../../types/player";
import LocalVideoPlayer from "./LocalVideoPlayer";
import YoutubePlayer from "./YoutubePlayer";
import PlayerControls from "./PlayerControls";
import { useInterval } from "../../hooks/useInterval";

export default function PlayerShell({ init }: { init: LecturePlaybackInit }) {
  const playerRef = useRef<PlayerHandle>(null);

  // UI 갱신용 snapshot (엔진은 내부 단일 소스)
  const [snapshot, setSnapshot] = useState(
    playerRef.current?.getSnapshot()
  );

  // UI 갱신 루프 (250ms 정도면 충분)
  useInterval(() => {
    const snap = playerRef.current?.getSnapshot();
    if (snap) setSnapshot(snap);
  }, 250);

  // 5초마다 진행률 저장 (placeholder)
  useInterval(() => {
    const snap = playerRef.current?.getSnapshot();
    if (!snap) return;

    //console.log("progress snapshot:", snap);
  }, 5000);

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-4">
      {init.source.type === "LOCAL" ? (
        <LocalVideoPlayer
          ref={playerRef}
          src={init.source.localPath}
          startAtSec={init.lastWatchedTimeSec}
        />
      ) : (
        <YoutubePlayer
          ref={playerRef}
          videoId={init.source.videoId}
          startAtSec={init.lastWatchedTimeSec}
        />
      )}

      {snapshot && (
        <PlayerControls
          currentSec={snapshot.currentSec}
          maxWatchedSec={snapshot.maxWatchedSec}
          durationSec={snapshot.durationSec}
          isPlaying={snapshot.isPlaying}
          playbackRate={snapshot.playbackRate}
          onTogglePlay={() => {
            if (snapshot.isPlaying) {
              playerRef.current?.pause();
            } else {
              playerRef.current?.play();
            }
          }}
          onSeek={(sec) => playerRef.current?.seekTo(sec)}
          onChangeRate={(r) => playerRef.current?.setRate(r)}
        />
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import type { LecturePlaybackInit } from "../../types/lecture";
import type { PlayerHandle } from "../../types/player";
import LocalVideoPlayer from "./LocalVideoPlayer";
import YoutubePlayer from "./YoutubePlayer";
import PlayerControls from "./PlayerControls";
import { useInterval } from "../../hooks/useInterval";
import { api } from "../../api/axiosInstance";

type PlayUrlResponse = {
  url: string;
};

export default function PlayerShell({ init }: { init: LecturePlaybackInit }) {
  const playerRef = useRef<PlayerHandle>(null);

  const [snapshot, setSnapshot] = useState(
    playerRef.current?.getSnapshot()
  );

  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);

  // 🔥 로컬 영상일 경우 play-url 발급
  useEffect(() => {
    if (init.source.type !== "UPLOAD") return;

    const fetchPlayUrl = async () => {
      try {
        setLoadingUrl(true);
        // UPLOAD 타입의 source에서 localPath를 가져와서 play-url API 호출
        // 타입 단언으로 localPath 접근 (위에서 UPLOAD 검사를 실행하기에 작동하기는 하나, 실제 코드에서는 더 안전하게 처리 필요)
        const res = await api.get<PlayUrlResponse>(
          `/videos/${init.videoId}/play-url`
        );

        setSignedUrl(res.data.url);
        console.log("Fetched signed URL:", res.data.url);
      } catch (e) {
        console.error("Failed to fetch signed URL", e);
      } finally {
        setLoadingUrl(false);
      }
    };

    void fetchPlayUrl();
  }, [init]);

  // UI 갱신 루프
  useInterval(() => {
    const snap = playerRef.current?.getSnapshot();
    if (snap) setSnapshot(snap);
  }, 250);

  // 5초마다 진행 저장 (기존 로직 유지)
  useInterval(() => {
    const snap = playerRef.current?.getSnapshot();
    if (!snap) return;
    const dto = {
      progress: Math.round((snap.currentSec / snap.durationSec) * 100),
      lastWatchedTime: Math.round(snap.currentSec),
      totalDuration: Math.round(snap.durationSec),
    };
    api.put(`/me/enrollments/${init.lectureId}/progress`, dto,
    ).then(() => {
      // console.log("Progress saved:", dto);
      // 저장 성공 시 추가 처리를 여기서 실행 가능
    })
    .catch((err) => {
      console.error("Failed to save progress", err);
    });
  }, 5000);

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      {/* ===== Player 영역 ===== */}
      {init.source.type === "UPLOAD" ? (
        loadingUrl ? (
          <div className="p-4 text-center">영상 준비 중...</div>
        ) : signedUrl ? (
          <LocalVideoPlayer
            ref={playerRef}
            src={signedUrl}
            startAtSec={init.lastWatchedTimeSec}
          />
        ) : (
          <div className="p-4 text-error">영상 URL을 불러오지 못했습니다.</div>
        )
      ) : (
        <YoutubePlayer
          ref={playerRef}
          videoId={init.source.videoId}
          startAtSec={init.lastWatchedTimeSec}
        />
      )}

      {/* ===== Controls ===== */}
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

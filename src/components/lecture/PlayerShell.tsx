import { useEffect, useRef, useState } from "react";
import type { LecturePlaybackInit } from "../../types/lecture";
import type { PlayerHandle } from "../../types/player";
import LocalVideoPlayer from "./LocalVideoPlayer";
import YoutubePlayer from "./YoutubePlayer";
import PlayerControls from "./PlayerControls";
import { useInterval } from "../../hooks/useInterval";
import { api } from "../../api/axiosInstance";
import axios from "axios";

// type PlayUrlResponse = {
//   url: string;
// };

const token = localStorage.getItem("token");

export default function PlayerShell({ init }: { init: LecturePlaybackInit }) {
  const playerRef = useRef<PlayerHandle>(null);

  const [snapshot, setSnapshot] = useState(
    playerRef.current?.getSnapshot()
  );

  const getUserRole = () => {
    if (!token) {
      return 0;
    }

    try {
      const base64Payload = token.split(".")[1]; // 토큰의 payload 부분 추출
      const payload = JSON.parse(atob(base64Payload)); // base64 디코딩 후 JSON 파싱
      return payload.role;
    } catch (e) {
      console.error("Token decode error:", e);
      return 0;
    }
  }

  const userRole = getUserRole();

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
        const res = await axios.get(
          `/api/videos/${init.videoId}`, {
          headers: {
            Authorization: `Bearer ${token}` // 토큰 전달
          },
          responseType: 'blob'
        });

        const blobUrl = URL.createObjectURL(res.data);

        setSignedUrl(blobUrl);
        console.log("Fetched signed URL:", blobUrl);
      } catch (e) {
        console.error("Failed to fetch signed URL", e);
      } finally {
        setLoadingUrl(false);
      }
    };

    void fetchPlayUrl();
    return () => {
      if (signedUrl) URL.revokeObjectURL(signedUrl); // 컴포넌트가 사라질 때 메모리에서 URL 해제
    };
  }, [init.videoId, init.source.type]);

  // UI 갱신 루프
  useInterval(() => {
    const snap = playerRef.current?.getSnapshot();
    if (snap) setSnapshot(snap);
  }, 250);

  // 5초마다 진행 저장 (기존 로직 유지)
  useInterval(() => {
    if (userRole === '1' || userRole === "ROLE_PROFESSOR" || userRole === "PROFESSOR" || userRole === '2' || userRole === "USER_ADMIN" || userRole === "ADMIN") {
      return;
    }

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
            isAdmin={userRole === '1' || userRole === "ROLE_PROFESSOR" || userRole === "PROFESSOR" || userRole === '2' || userRole === "USER_ADMIN" || userRole === "ADMIN"}
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
          maxWatchedSec={(userRole === '1' || userRole === "ROLE_PROFESSOR" || userRole === "PROFESSOR" || userRole === '2' || userRole === "USER_ADMIN" || userRole === "ADMIN")
            ? snapshot.durationSec
            : snapshot.maxWatchedSec
          }
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
          onSeek={(sec) => {

            if (userRole === '1' || userRole === "ROLE_PROFESSOR" || userRole === "PROFESSOR" || userRole === '2' || userRole === "USER_ADMIN" || userRole === "ADMIN") {
              playerRef.current?.seekTo(sec);
              return;
            }

            if (userRole === "0" || userRole === "ROLE_USER" || userRole === "USER") {
              if (sec > snapshot.maxWatchedSec) {
                alert("아직 시청하지 않은 구간으로는 이동할 수 없습니다.");
                return;
              }
            }

            playerRef.current?.seekTo(sec);
          }}
          onChangeRate={(r) => playerRef.current?.setRate(r)}
        />
      )}
    </div>
  );
}

import { useCallback, useEffect, useRef } from "react";
import type { ProgressDTO } from "../types/lecture";
import { api } from "../api/axiosInstance";

type ReporterArgs = {
  lectureId: string;
  getSnapshot: () => {
    currentSec: number;
    maxWatchedSec: number; // 이번 프로토타입에서는 maxWatched = lastWatched로 사용
    durationSec: number;
    isPlaying: boolean;
  };
};

// TODO: 여기만 나중에 실제 axios instance로 교체하시면 됩니다.
async function sendProgressHTTP(_lectureId: string, _dto: ProgressDTO) {
  api.put(`/me/enrollments/${_lectureId}/progress`, _dto)
  .then(() => {
    console.log("inserted progress: ", _dto);
  })
  .catch(err => {
    console.error("error: ", err);
  });
}

function sendProgressBeacon(_lectureId: string, _dto: ProgressDTO) {
  api.put(`/me/enrollments/${_lectureId}/progress`, _dto)
  .then(() => {
    console.log("inserted progress: ", _dto);
  })
  .catch(err => {
    console.error("error: ", err);
  });
  return;
}

export function useProgressReporter({ lectureId, getSnapshot }: ReporterArgs) {
  const lastSentAtRef = useRef<number>(0);

  const buildDTO = useCallback((): ProgressDTO | null => {
    const snap = getSnapshot();
    if (!Number.isFinite(snap.durationSec) || snap.durationSec <= 0) return null;

    const progress = Math.max(
      0,
      Math.min(100, (snap.maxWatchedSec / snap.durationSec) * 100)
    );
    if(progress >= 99.5) {
      return {
        progress: 100,
        lastWatchedTime: Math.max(0, Math.floor(snap.maxWatchedSec)),
        totalDuration: Math.max(1, Math.floor(snap.durationSec)),
      }
    }
    else {
      return {
        progress: Math.round(progress * 10) / 10,
        lastWatchedTime: Math.max(0, Math.floor(snap.maxWatchedSec)),
        totalDuration: Math.max(1, Math.floor(snap.durationSec)),
      };
    }
  }, [getSnapshot]);

  const reportHTTP = useCallback(async () => {
    const now = Date.now();
    // 중복 폭주 방지(필요 시)
    if (now - lastSentAtRef.current < 1000) return;
    lastSentAtRef.current = now;

    const dto = buildDTO();
    if (!dto) return;

    try {
      await sendProgressHTTP(lectureId, dto);
    } catch {
      // 실패 시 재시도 없음(요구사항)
    }
  }, [lectureId, buildDTO]);

  const reportBeacon = useCallback(() => {
    const dto = buildDTO();
    if (!dto) return;
    try {
      sendProgressBeacon(lectureId, dto);
    } catch {
      // 무시
    }
  }, [lectureId, buildDTO]);

  // 탭 비활성/종료 시 마지막 저장(비콘)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") reportBeacon();
    };
    const onBeforeUnload = () => {
      reportBeacon();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [reportBeacon]);

  return { reportHTTP, reportBeacon };
}

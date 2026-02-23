export type LectureSource =
  | { type: "UPLOAD"; localPath: string }
  | { type: "YOUTUBE"; videoId: string };

export type LecturePlaybackInit = {
  lectureId: string;
  source: LectureSource;

  // 재접속 시 시작 위치(초)
  lastWatchedTimeSec: number;
  totalDurationSec?: number;
  thumbnailUrl?: string;
};

export type ProgressDTO = {
  // 0~100
  progress: number;
  // 0~ (초 기반)
  lastWatchedTime: number;
  // 1~ (분 기반)
  totalDuration: number;
};

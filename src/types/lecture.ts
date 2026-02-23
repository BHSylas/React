export type LectureSource =
  | { type: "LOCAL"; localPath: string }
  | { type: "YOUTUBE"; videoId: string };

export type LecturePlaybackInit = {
  lectureId: string;
  source: LectureSource;

  // 재접속 시 시작 위치(초)
  lastWatchedTimeSec: number;

  // 서버에서 totalDuration이 "minute" 단위로 필요하다고 하셨으니,
  // 내부는 sec로 쓰고 전송 시 minute로 바꿉니다.
  // init에는 없어도 됨(YouTube는 준비 후 알 수 있음)
  totalDurationSec?: number;
};

export type ProgressDTO = {
  // 0~100
  progress: number;
  // 0~ (초 기반)
  lastWatchedTime: number;
  // 1~ (분 기반)
  totalDuration: number;
};

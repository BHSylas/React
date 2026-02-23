export type PlayerSnapshot = {
  currentSec: number;
  maxWatchedSec: number;
  durationSec: number;
  isPlaying: boolean;
  playbackRate: number;
};

export type PlayerHandle = {
  play: () => void;
  pause: () => void;
  seekTo: (sec: number) => void;
  setRate: (rate: number) => void;
  getSnapshot: () => PlayerSnapshot;
};

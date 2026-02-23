import PlayerShell from "../../components/lecture/PlayerShell";
import type { LecturePlaybackInit } from "../../types/lecture";


export default function LecturePlayerPage() {
  // ✅ 프로토타입: 서버에서 내려온 값이라고 가정
  // We are using a hardcoded init object here for demonstration purposes. In a real application, 
  // you would fetch this data from your server based on the lecture being accessed.
  const init: LecturePlaybackInit = {
    lectureId: "lecture-123",
    source: {
      // type: "LOCAL",
      // localPath: "https://www.w3schools.com/html/mov_bbb.mp4",

      type: "YOUTUBE",
      videoId: "twgC7JWKzYg",
    },
    lastWatchedTimeSec: 60 * 15, // 15분부터 시작
  };

  return <PlayerShell init={init} />;
}

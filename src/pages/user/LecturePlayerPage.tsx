import { useEffect, useState } from "react";
import PlayerShell from "../../components/lecture/PlayerShell";
import type { LecturePlaybackInit } from "../../types/lecture";
import { api } from "../../api/axiosInstance";
import { useParams } from "react-router-dom";


export default function LecturePlayerPage() {
  const lectureId = useParams<{ lectureId: string }>().lectureId;
  const [initial, setInitial] = useState<LecturePlaybackInit | null>(null);
  useEffect(() => {
    api.get(`/lectures/${lectureId}/video`).then(res => {
      const data = res.data;
      api.get(`/me/enrollments/${lectureId}`).then(progressRes => {
        setInitial({
          lectureId: lectureId!,
          source: {
            type: data.sourceType,
            localPath: data.localPath,
            videoId: data.youtubeVideoId,
          },
          lastWatchedTimeSec: progressRes.data.lastWatchedTime ?? 0,
          videoId: data.videoId,
        });
      }).catch(err => {
        console.error("Failed to fetch progress info:", err);
        // Fallback to init without progress if API call fails
        setInitial({
          lectureId: lectureId!,
          source: {
            type: data.sourceType,
            localPath: data.localPath,
            videoId: data.youtubeVideoId,
          },
          lastWatchedTimeSec: 0,
          videoId: 9999999999,
        });
      });
    }).catch(err => {
      console.error("Failed to fetch lecture video info:", err);
      // Fallback to a default init if API call fails
      setInitial({
        lectureId: lectureId!,
        source: {
          type: "YOUTUBE",
          videoId: "twgC7JWKzYg",
        },
        lastWatchedTimeSec: 60 * 15,
        videoId: 9999999999,
      });
    });
  }, [lectureId]);
  
  if(!initial) {
    return <div>Loading...</div>;
  }
  return <PlayerShell init={initial} />;
}

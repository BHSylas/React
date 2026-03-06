import { useEffect, useState } from "react";
import PlayerShell from "../../components/lecture/PlayerShell";
import type { LecturePlaybackInit } from "../../types/lecture";
// import { api } from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


export default function LecturePlayerPage() {
  const lectureId = useParams<{ lectureId: string }>().lectureId;
  const [initial, setInitial] = useState<LecturePlaybackInit | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const getUserRole = () => {
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // 토큰에서 페이로드 추출
      return Number(payload.role); // 0: 학생, 1: 교수, 2: 관리자
    } catch (e) {
      return 0;
    }
  };

  useEffect(() => {
    const fetchLectureData = async () => {
      try {

        const videoRes = await axios.get(`/api/lectures/${lectureId}/video`, {
          headers: {
            Authorization: `Bearer ${token}` // 토큰 전달
          }
        });
        const data = videoRes.data;

        if (!data || !data.sourceType) {
          alert("영상 정보를 불러오지 못했습니다.");
          navigate(`/class/${lectureId}`);
          return;
        }

        let lastWatchedTime = 0;
        const userRole = getUserRole();

        if (userRole === 0) {
          try {
            const progressRes = await axios.get(`/api/me/enrollments/${lectureId}`, {
              headers: {
                Authorization: `Bearer ${token}` // 토큰 전달
              }
            });

            lastWatchedTime = progressRes.data.lastWatchedTime ?? 0;

          } catch (e) {
            console.error("수강 정보 로드 실패 (403 가능성):", e);
          }
        }

        setInitial({
          lectureId: lectureId!,
          source: {
            type: data.sourceType,
            localPath: data.localPath,
            videoId: data.youtubeVideoId,
          },
          lastWatchedTimeSec: lastWatchedTime,
          videoId: data.videoId,
        });

      } catch (ve) {
        console.error("비디오 정보 로드 실패", ve);
        setInitial({
          lectureId: lectureId!,
          source: {
            type: "YOUTUBE",
            videoId: "twgC7JWKzYg",
          },
          lastWatchedTimeSec: 60 * 15,
          videoId: 9999999999,
        });
      }
    };

    if (lectureId && token) {
      fetchLectureData();
    }

  }, [lectureId, token, navigate]);

  if (!initial) {
    return <div>Loading...</div>;
  }
  return <PlayerShell init={initial} />;
}

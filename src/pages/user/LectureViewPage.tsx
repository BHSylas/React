import { useParams } from "react-router-dom";
import Overview from "../../components/class/desc/Overview";
import TopPanel from "../../components/class/desc/TopPanel";
import ReviewBlock from "../../components/class/review/ReviewBlock";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import type { ClassItem } from "../../types/ClassItem";

export default function LectureViewPage() { //현재 테스트 데이터 삽입 중
    const classId = useParams().classId;
    const [page, setPage] = useState<ClassItem | null>(null);
    const [enrolling, setEnrolling] = useState(true);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);
    useEffect(() => {
      api.get(`/lectures/${classId}`).then((res) => {
        setPage(res.data);
      });
      api.get(`/lectures/${classId}/video`).then((res) => {
        const data = res.data;
        if(data.sourceType === "YOUTUBE" && data.youtubeVideoId) {
          setThumbnailUrl(`https://img.youtube.com/vi/${data.youtubeVideoId}/0.jpg`);
        }
      });
      api.get(`/me/enrollments/${classId}`).catch(() => {
        setEnrolling(false);
      });
    }, []);
    if(page === null) {
    return <div>Loading...</div>;
    }
    if(classId === undefined) {
      return <div>Invalid class ID</div>;
    }
  return (
    <main>
      <TopPanel
        title={page.title}
        instructor={page.professorNickname}
        category={page.language.toUpperCase()}
        thumbnailUrl={thumbnailUrl}
        level={page.country}
        duration=""
        classId={classId}
        isEnrolling={enrolling}
      />
      <Overview
        description={page.description}
      />
      <ReviewBlock />
    </main>
  );
}

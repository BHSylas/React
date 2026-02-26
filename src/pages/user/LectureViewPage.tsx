import { useParams, useNavigate } from "react-router-dom";
import Overview from "../../components/class/desc/Overview";
import TopPanel from "../../components/class/desc/TopPanel";
// import ReviewBlock from "../../components/class/review/ReviewBlock";
import { useEffect, useState, useContext } from "react";
import { api } from "../../api/axiosInstance";
import type { ClassItem } from "../../types/ClassItem";
import { AuthContext } from "../../context/AuthContext";
import { getUserIdFromToken } from "../../types/decodeToken";
import OtherLecutres from "../../components/class/desc/OtherLectures";

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
        if(data === null) {
          setThumbnailUrl(undefined);
          return;
        }
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
  if (classId === undefined) {
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

      {isProfessor && isMyLecture && (
        <div>
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-end gap-5">
            <button
              onClick={() => navigate(`/class/${classId}/edit`)}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-all"
            >
              강의 정보 / 영상 수정
            </button>
            <button
              onClick={() => navigate(`/class/${classId}/manage`)}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700  transition-all shadow-sm"
            >
              수강생 통계 및 관리
            </button>
          </div>
        </div>
      )}
      {/* <ReviewBlock /> */}
      <OtherLecutres
        professorId={page.professorId}
        professorNickname={page.professorNickname}
        lectureId={page.lectureId} />

    </main>
  );
}

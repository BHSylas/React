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
  const [enrolling, setEnrolling] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const userId = getUserIdFromToken(authContext.token)!;
  const isProfessor = authContext.role === '1';
  const isMyLecture = isProfessor && page?.professorId === userId;
  useEffect(() => {
    api.get(`/lectures/${classId}`).then((res) => {
      setPage(res.data);
    });
    api.get(`/lectures/${classId}/video`).then((res) => {
      const data = res.data;
      if (data === null) {
        setThumbnailUrl(undefined);
        return;
      }
      if (data.sourceType === "YOUTUBE" && data.youtubeVideoId) {
        setThumbnailUrl(`https://img.youtube.com/vi/${data.youtubeVideoId}/0.jpg`);
      }
      else if (data.thumbnailUrl) {
        setThumbnailUrl(data.thumbnailUrl);
      }
    });
    api.get(`/me/enrollments/${classId}`).then(() => {
      setEnrolling(true);
    })
      .catch(() => {
        setEnrolling(false);
      });
  }, [classId]);
  if (page === null) {
    return <div>Loading...</div>;
  }
  if (classId === undefined) {
    return <div>Invalid class ID</div>;
  }
  return (
    <main className="pb-20 animate-in fade-in duration-700">
      {/* 상단 패널: 배경색이나 이미지가 가득 차는 영역 */}
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

      <div className="max-w-6xl mx-auto mt-10 space-y-20">
        <section className="prose prose-slate max-w-none">
          <div className="text-gray-700 leading-relaxed min-h-[200px]">
            <Overview description={page.description} />
          </div>
        </section>

        {isProfessor && isMyLecture && (
          <section className="bg-gray-50/80 rounded-[2rem] p-8 md:p-10 transition-all">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Instructor Only</p>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">강의 관리 및 수정</h2>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => navigate(`/class/${classId}/edit`)}
                  className="flex-1 md:flex-none px-6 py-3.5 bg-white border border-gray-200 text-gray-700 text-xs font-black rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all active:scale-95"
                >
                  내용 수정
                </button>
                <button
                  onClick={() => navigate(`/class/${classId}/manage`)}
                  className="flex-1 md:flex-none px-6 py-3.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-gray-200"
                >
                  수강생 관리
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. 연관 강의 섹션: 상단 선으로 구분 */}
        <section className="pt-16 border-t border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              <span className="text-blue-600">{page.professorNickname}</span> 교수님의 다른 강의
            </h3>
          </div>
          <OtherLecutres
            professorId={page.professorId}
            professorNickname={page.professorNickname}
            lectureId={page.lectureId}
          />
        </section>
      </div>
    </main>
  );
}

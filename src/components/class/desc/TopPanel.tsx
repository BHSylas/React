import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { decompileLanguageCode } from "../../../utils/decompileCountryCode";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

interface TopPanelProps {
  title: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  thumbnailUrl?: string;
  classId: string;
  isEnrolling?: boolean;
}

const COUNTRY_NAMES: Record<string, string> = {
  USA: "미국",
  JAPAN: "일본",
  CHINA: "중국",
  GERMANY: "독일",
  ITALY: "이탈리아",
};

export default function TopPanel({
  title,
  instructor,
  category,
  level,
  thumbnailUrl,
  classId,
  isEnrolling = false,
}: TopPanelProps) {
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(isEnrolling);

  useEffect(() => {
    setEnrollment(isEnrolling);
  }, [isEnrolling]); // 부모의 enrolling 상태가 바뀌면 여기도 바뀌게 함

  const { role } = useAuth();

  const finalThumbnail = thumbnailUrl?.startsWith('http')
    ? thumbnailUrl
    : thumbnailUrl
      ? `http://localhost:8080${thumbnailUrl}` // 서버 주소에 맞게 수정하세요
      : null;
  const enrolling = () => {
    api.post(`/me/enrollments/${classId}`)
      .then(() => {
        setEnrollment(true);
        alert("수강 신청이 완료되었습니다!");
      })
      .catch((err: any) => {
        console.error(err);
        if (role === '1' || role === "ROLE_PROFESSOR" || role === "PROFESSOR") {
          alert("강사는 수강할 수 없습니다.");
        }
        else {
          alert("수강 신청에 실패했습니다. 다시 시도해 주세요.");
        }
      });
  }
  const video = () => {
    navigate(`/class/${classId}/player`);
  }
  return (
    <section className="bg-slate-800 text-white py-10 md:py-14  rounded-md shadow-md">
      <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row gap-10 items-center">

        <div className="w-full md:w-[380px] aspect-video bg-slate-700 rounded-[1rem] flex-shrink-0 overflow-hidden shadow-xl">
          {finalThumbnail ? (
            <img
              src={finalThumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs font-bold text-slate-400 gap-2">
              섬네일 없음
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between py-1 text-center md:text-left">
          <div className="space-y-3">
            {/* 카테고리 정보 */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-[13px] font-medium text-slate-400">
              <span className="text-blue-400 font-bold tracking-wider uppercase">
                {decompileLanguageCode(category)}
              </span>
              <span className="opacity-30">|</span>
              <span>{COUNTRY_NAMES[level]}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              {title}
            </h1>

            <div className="text-[15px] font-medium text-slate-300">
              {instructor} <span className="text-slate-500 ml-1">강사</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
            {(enrollment || role === '1' || role === "ROLE_PROFESSOR" || role === "PROFESSOR" || role === '2' || role === "USER_ADMIN" || role === "ADMIN") && (
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                  onClick={video}
                >
                  {role === '1' || role === "ROLE_PROFESSOR" || role === "PROFESSOR" || role === '2' || role === "USER_ADMIN" || role === "ADMIN" ? "영상 확인하기" : "수강하기"}

                </button>
                <button
                  type="button"
                  className="px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                  onClick={() => navigate("/class/qna/" + classId)}
                >
                  Q&A 바로가기
                </button>
              </div>
            )}
            {!enrollment && (role !== '1' && role !== "ROLE_PROFESSOR" && role !== "PROFESSOR" ) && (role !== '2' && role !== "USER_ADMIN" && role !== "ADMIN") && (
              <button
                type="button"
                className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                onClick={enrolling}
              >
                수강 신청하기
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

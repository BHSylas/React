import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { decompileLanguageCode } from "../../../utils/decompileCountryCode";
import { useState } from "react";
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

export default function TopPanel({
  title,
  instructor,
  category,
  level,
  duration,
  thumbnailUrl,
  classId,
  isEnrolling = false,
}: TopPanelProps) {
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(isEnrolling);
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
        if (role === '1') {
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

        {/* Thumbnail: 기존 사이즈를 유지하되 모서리 곡률만 최적화 */}
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

        {/* Summary: 텍스트 간격과 버튼의 시각적 위계 조정 */}
        <div className="flex-1 flex flex-col justify-between py-1 text-center md:text-left">
          <div className="space-y-3">
            {/* 카테고리 정보 */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-[13px] font-medium text-slate-400">
              <span className="text-blue-400 font-bold tracking-wider uppercase">
                {decompileLanguageCode(category)}
              </span>
              <span className="opacity-30">|</span>
              <span>{level}{duration}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              {title}
            </h1>

            <div className="text-[15px] font-medium text-slate-300">
              {instructor} <span className="text-slate-500 ml-1">강사</span>
            </div>
          </div>

          {/* 버튼 영역: 둥근 모서리와 호버 효과 강화 */}
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
            {enrollment ? (
              <>
                <button
                  type="button"
                  className="px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                  onClick={video}
                >
                  수강하기
                </button>
                <button
                  type="button"
                  className="px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                  onClick={() => navigate("/class/qna/" + classId)}
                >
                  Q&A 바로가기
                </button>
              </>
            ) : (
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

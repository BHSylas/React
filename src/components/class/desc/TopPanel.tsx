import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { decompileCountryCode } from "../../../utils/decompileCountryCode";
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
  const {role} = useAuth();
  const enrolling = () => {
    api.post(`/me/enrollments/${classId}`)
    .then(() => {
      setEnrollment(true);
      alert("수강 신청이 완료되었습니다!");
    })
    .catch((err : any) => {
      console.error(err);
      if(role === '1') {
        alert("강사는 수강할 수 없습니다.");
      }
      else
      {
        alert("수강 신청에 실패했습니다. 다시 시도해 주세요.");
      }
    });
  }
  const video = () => {
    navigate(`/class/${classId}/player`);
  }
  return (
    <section className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Thumbnail */}
        <div className="w-[360px] h-[200px] bg-slate-600 rounded-lg flex-shrink-0 overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-slate-300">
              섬네일 없음
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-3">{title}</h1>

            <div className="text-sm text-slate-300 space-y-1">
              <div>{instructor} 강사</div>
              <div>
                {decompileCountryCode(category)} · {level}{duration}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {enrollment ?
            <div className="flex gap-3">
              <button
              type="button"
              className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-semibold"
              onClick={video}
            >
              수강하기
            </button>
              <button
              type="button"
              className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-semibold"
              onClick={() => {
                navigate("/class/qna/" + classId);
              }}
            >
              Q&A 바로가기
            </button>
            </div>
            : <button
              type="button"
              className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-semibold"
              onClick={enrolling}
            >
              수강 신청하기
            </button>}

          </div>
        </div>
      </div>
    </section>
  );
}

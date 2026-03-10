import { useNavigate } from "react-router-dom";
import { decompileLanguageCode } from "../../utils/decompileCountryCode";
import type { EnrollmentItem } from "../../types/EnrollmentItem";
import { useAuth } from "../../hooks/useAuth";

const COUNTRY_NAMES: Record<string, string> = {
  USA: "미국",
  JAPAN: "일본",
  CHINA: "중국",
  GERMANY: "독일",
  ITALY: "이탈리아",
};

export default function EnrollmentRenderer({ classes }: { classes: EnrollmentItem[] }) {
    const navigate = useNavigate();
    const { role } = useAuth();
    // 교수 권한일 때
    if (role === '1') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-500">
                <h1 className="text-xl font-black text-gray-400 mb-6 tracking-tight">강의 관리 권한이 확인되었습니다.</h1>
                <button
                    onClick={() => navigate('/class/prof')}
                    className="px-8 py-4 bg-gray-900 text-white text-[15px] font-black rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                    강의 관리 페이지로 이동
                </button>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="flex-1 py-24 text-center bg-gray-50 rounded-[2.5rem] border border-gray-500">
                <p className="text-gray-300 font-black tracking-tight uppercase text-sm">No Enrolled Classes Found</p>
                <p className="text-gray-400 mt-2 font-medium">수강 중인 강의가 없습니다.</p>
            </div>
        );
    }
    return (
        <div className="flex-1">
            {/* 헤더 섹션 */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-gray-900 mb-8">
                <h2 className="text-[24px] font-black text-gray-900 tracking-tight">수강 중인 강의</h2>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-white bg-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">
                        In Progress
                    </span>
                </div>
            </div>

            {/* 카드 리스트 */}
            <div className="grid grid-cols-1 gap-6">
                {classes.map((enrollment) => (
                    <div
                        key={enrollment.lectureId}
                        className="group relative bg-white border-2 border-gray-500 rounded-[2rem] p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:border-blue-100 hover:-translate-y-1"
                        onClick={() => navigate(`/class/${enrollment.lectureId}`)}
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Learning Course</p>
                                <h3 className="text-[22px] font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                    {enrollment.title}
                                </h3>
                                <div className="flex items-center gap-3 text-[13px] font-bold text-gray-400">
                                    <span className="text-gray-900 font-black underline underline-offset-4 decoration-gray-200">
                                        {enrollment.professorNickname} 강사
                                    </span>
                                    <span className="w-1.5 h-1.5 bg-gray-100 rounded-full"></span>
                                    <span className="text-black">{decompileLanguageCode(enrollment.language)} · {COUNTRY_NAMES[enrollment.country]}</span>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 bg-gray-50 px-4 py-2 rounded-2xl shrink-0">
                                <span className="text-3xl font-black text-gray-900">{enrollment.progressRate}</span>
                                <span className="text-2xl font-black uppercase">%</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                <span className="text-black">Progress Status</span>
                                <span className={enrollment.progressRate === 100 ? "text-green-500" : "text-blue-600"}>
                                    {enrollment.progressRate === 100 ? "Completed" : "On Going"}
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-[3px] border border-gray-50 shadow-inner">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 group-hover:bg-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                                    style={{ width: `${enrollment.progressRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
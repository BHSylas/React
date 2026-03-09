import { type ProfessorProfileResponse } from "../../../types/profProfile";

interface OverviewProps {
  description: string;
  objectives?: string[];
  // instructorBio?: string;
  profData?: ProfessorProfileResponse | null;
}

export default function Overview({
  description,
  objectives,
  // instructorBio,
  profData,
}: OverviewProps) {

  return (
    <section className="max-w-6xl mx-auto py-4 space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 border-t pt-10">

      {/* 1. 강의 소개 섹션 */}
      <div className="group">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full transition-transform group-hover:scale-y-125"></span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">강의 소개</h2>
        </div>
        <div className="text-[17px] text-gray-600 leading-[1.8] px-1 whitespace-pre-wrap break-keep">
          {description}
        </div>
      </div>

      {/* 2. 학습 목표 섹션 (데이터가 있을 때만) */}
      {objectives && objectives.length > 0 && (
        <div className="group">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-6 bg-gray-900 rounded-full transition-transform group-hover:scale-y-125"></span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">학습 목표</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
            {objectives.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-colors"
              >
                <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                <span className="text-[15px] font-medium text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profData && (
        <div className="group">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full transition-transform group-hover:scale-y-125"></span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">강사 상세 프로필</h2>
          </div>

          <div>
            <div className="p-10 border-b-2 border-gray-400">
              <div className="flex flex-col sm:flex-row items-center gap-8">

                <div className="flex-grow text-center sm:text-left space-y-3">
                  {/* 이름 (text-4xl) */}
                  <h3 className="text-2xl font-black text-black tracking-tight">
                    {profData.professorName} <span className="text-2xl font-black text-black tracking-tight">교수</span>
                  </h3>
                  {/* 닉네임 (text-xl) */}
                  <p className="font-medium text-gray-800 bg-white inline-block px-3 py-1 rounded-full border border-gray-200">
                    @{profData.professorNickname}
                  </p>

                  {/* 상세 정보 상세 - 글씨 크기 확대 (text-base), 간격 조정 */}
                  <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-bold w-24 shrink-0">전공분야</span>
                      <span className="text-gray-950 font-semibold">{profData.specialty}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-bold w-24 shrink-0">연구실</span>
                      <span className="text-gray-950 font-semibold">{profData.office}</span>
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <span className="text-gray-500 font-bold w-24 shrink-0">연락처</span>
                      <span className="text-blue-600 font-bold truncate">
                        {profData.contactEmail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-12">

              {profData.bio && (
                <div>
                  <h4 className="text-sm font-black text-blue-700 uppercase tracking-widest">Introduce</h4>
                  <p className="text-black p-5 text-lg text-lg">
                    {profData.bio}
                  </p>
                </div>
              )}

              {profData.career && (
                <div className="pt-5">
                  <h4 className="text-sm font-black text-blue-700 uppercase tracking-widest">Career</h4>
                  <div className="text-black p-5 text-lg">
                    {profData.career}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

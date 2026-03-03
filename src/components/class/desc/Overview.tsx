interface OverviewProps {
  description: string;
  objectives?: string[];
  instructorBio?: string;
}

export default function Overview({
  description,
  objectives,
  instructorBio,
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

      {/* 3. 강사 소개 섹션 (데이터가 있을 때만) */}
      {instructorBio && (
        <div className="group">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-6 bg-gray-400 rounded-full transition-transform group-hover:scale-y-125"></span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">강사 상세 프로필</h2>
          </div>
          <div className="relative p-8 bg-slate-50 rounded-[2rem] overflow-hidden">
            {/* 배경 데코레이션 코테이션 마크 */}
            <span className="absolute -top-4 -right-2 text-[120px] font-black text-slate-100 leading-none select-none">“</span>
            <p className="relative z-10 text-[16px] text-slate-600 leading-relaxed italic">
              {instructorBio}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

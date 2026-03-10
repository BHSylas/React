import { type ClassItem } from "../../../types/ClassItem"
import { useNavigate } from "react-router";

interface ClassListBlockPorps {
    classList: ClassItem[];
}

const LANGUAGE_MAP: Record<string, string> = {
    en: "영어",
    jp: "일본어",
    de: "독일어",
    cn: "중국어",
    it: "이탈리아어",
}

const LANGUAGE_COUNTRY: Record<string, string> = {
    USA: "미국",
    JAPAN: "일본",
    GERMANY: "독일",
    ITALY: "이탈리아",
    CHINA: "중국",
}

export function ClassListBlock({ classList }: ClassListBlockPorps) {
    const navigate = useNavigate();

return (
        <div className="w-full animate-in fade-in duration-700">
            {/* 상단 헤더: 굵은 선으로 섹션 구분 */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-900">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight text-[22px]">강의 목록</h2>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        Management
                    </span>
                </div>
            </div>

            {/* 리스트 본문 */}
            <div className="divide-y divide-gray-500">
                {classList.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="text-gray-300 font-medium tracking-tight">등록된 강의 데이터가 존재하지 않습니다.</p>
                    </div>
                ) : (
                    classList.map((list) => (
                        <div 
                            key={list.lectureId}
                            onClick={() => navigate(`/class/${list.lectureId}`)}
                            className="group grid grid-cols-[1.5fr_100px_100px_2fr] gap-8 items-center py-6 cursor-pointer transition-all hover:bg-gray-50/50 px-4"
                        >
                            <div className="text-[17px] font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">
                                {list.title || "제목없음"}
                            </div>

                            <div className="text-center">
                                <span className="text-[13px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                                    {LANGUAGE_COUNTRY[list.country] || list.country}
                                </span>
                            </div>

                            <div className="text-center">
                                <span className="text-[13px] font-extrabold text-blue-600/80">
                                    {LANGUAGE_MAP[list.language] || list.language}
                                </span>
                            </div>

                            <div className="text-[14px] text-gray-400 font-medium truncate leading-relaxed text-right pl-8">
                                {list.description || "상세 설명 생략됨"}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t border-gray-500 mt-2"></div>
        </div>
    );

}
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

export function ProfClassListBlock({ classList }: ClassListBlockPorps) {
    const navigate = useNavigate();

    return (
        <div>
            <div className="border-t">
                <div className="grid grid-cols-[1fr_120px_120px_120px_70px]
                     gap-4 px-3 py-3 border-b bg-gray-100 text-sm cursor-pointer">
                    <div className="truncate font-medium">강의 제목</div>
                    <div>국가</div>
                    <div>언어</div>
                    <div>강의 소개</div>
                </div>
                {classList.map((list) => (
                    <div key={list.lectureId}
                        className="grid grid-cols-[1fr_120px_120px_120px_70px]
                     gap-4 px-3 py-3 border-b text-sm cursor-pointer"
                        onClick={() => navigate(`/class/prof/${list.lectureId}/enrollments`)}>
                        <div className="truncate font-medium">
                            {list.title || "제목없음"}
                        </div>
                        <div>{list.country}</div>
                        <div>{LANGUAGE_MAP[list.language || list.language]}</div>
                        <div>{list.description}</div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end">
                <button onClick={() => navigate('/class/new')}
                    className="btn mt-3 px-4 py-2 text-sm font-medium rounded-md
                   bg-blue-800 text-white hover:bg-blue-900 transition-colors">강의 작성</button>
            </div>
        </div>
    );

}
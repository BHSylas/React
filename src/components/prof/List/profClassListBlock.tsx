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
        <div>
            <h2 className="text-lg font-bold mb-3 border-b-2 pb-2">강의 목록</h2>
            <div>
                {classList.map((list) => (
                    <div key={list.lectureId}
                        className="grid grid-cols-[1fr_120px_120px_120px_70px]
                     gap-4 px-3 py-3 border-b cursor-pointer text-gray-600"
                     onClick={() => {navigate(`/class/${list.lectureId}`)}}>
                        <div>
                            {list.title || "제목없음"}
                        </div>
                        <div>{LANGUAGE_COUNTRY [list.country || list.country]}</div>
                        <div>{LANGUAGE_MAP[list.language || list.language]}</div>
                        <div>{list.description}</div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end">
                <button onClick={() => navigate('/class/new')}
                    className="btn mt-5 px-4 py-2 text-sm font-medium rounded-md
                   bg-blue-800 text-white hover:bg-blue-900 transition-colors">강의 작성</button>
            </div>
        </div>
    );

}
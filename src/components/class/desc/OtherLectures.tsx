import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { type ClassItem } from "../../../types/ClassItem";
import { api } from "../../../api/axiosInstance";

interface OtherLecturesProps {
    professorId: number | string;
    professorNickname: string;
    lectureId: string;
}

export default function OtherLecutres({ professorId, professorNickname, lectureId }: OtherLecturesProps) {
    const [lectures, setLectures] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/lectures/cards?size=100`).then((res) => {
            const filtered = res.data.content.filter((item: any) =>
                Number(item.professorId) === Number(professorId) &&
                String(item.lectureId) !== String(lectureId))
                .slice(0, 3);
            setLectures(filtered);
        }).catch((e) => console.error("목록 로드 실패", e))
            .finally(() => setLoading(false));
    }, [professorId, lectureId]);

    if (loading) return <div className="max-w-7xl mx-auto px-6 py-10 text-center">추천 강의 불러오는 중...</div>;
    if (lectures.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 mt-16 mb-20">
            <hr className="mb-12 border-gray-100" />
            <h2 className="text-2xl font-bold mb-8">
                <span className="text-blue-600">{professorNickname}</span> 강사님의 다른 강의
            </h2>

            <div className="grid grid-cols-3 gap-4">
                {lectures.map((lecture: any) => (
                    <div
                        key={lecture.lectureId}
                        onClick={() => {
                            navigate(`/class/${lecture.lectureId}`);
                            window.scrollTo(0, 0);
                        }}
                        className="group cursor-pointer p-5 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                                    {lecture.language}
                                </span>
                                <span className="text-xs text-gray-400">{lecture.country}</span>
                            </div>

                            <h3 className="font-bold text-lg mt-1 group-hover:text-blue-600">
                                {lecture.title}
                            </h3>

                            <div className="mt-4 flex items-center text-blue-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                강의 보러가기 →
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
} 
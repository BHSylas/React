import { useEffect, useState } from "react";
import axios from "axios";

interface BoardLectureProps {
    selectedId: number | null;
    onSelect: (id: number) => void;
}

export function BoardLecture({ selectedId, onSelect }: BoardLectureProps) {
    const [lectures, setLectures] = useState<{ lectureId: number, title: string }[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchLectures = async () => {
            try {
                const res = await axios.get('/api/me/enrollments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const content = res.data.content || [];
                setLectures(content);
            } catch (err) {
                console.error("강의 목록 로드 실패", err);
            }
        };
        fetchLectures();
    }, []);

    // 목록이 로드된 후, selectedId가 없으면 첫 번째 강의를 선택
    useEffect(() => {
        if (lectures.length > 0 && !selectedId) {
            onSelect(lectures[0].lectureId);
        }
    }, [lectures, selectedId, onSelect]);
    // lectures가 로드 완료되었을 때 + selectedId가 없을 때만 작동

    return (
        <div>
            <select
                value={selectedId || ""}
                onChange={(e) => onSelect(Number(e.target.value))}
                className="pl-4 pr-8 py-2 bg-white border border-black rounded-xl text-sm font-bold text-gray-700 cursor-pointer appearance-none shadow-sm"
            >
                {lectures.length === 0 && <option value="">강의 로딩 중...</option>}

                {lectures.map((i) => (
                    <option key={i.lectureId} value={i.lectureId}>{i.title}</option>
                ))}
            </select>
        </div>
    );
}
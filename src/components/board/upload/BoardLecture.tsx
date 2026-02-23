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
        // 나중에 확인하여 백엔드로 호출함
        const fetchLectures = async () => {
            try {
                const res = await axios.get('/api/me/enrollments', {
                    headers: {
                        Authorization: `Bearer ${token}` // 토큰 규격에 맞춰 수정 필요
                    }
                });
                const content = res.data.content || [];

                setLectures(content);
                if (content.length > 0 && !selectedId) {
                    onSelect(content[0].lectureId);
                }

            } catch (err) {
                console.error("강의 목록 로드 실패", err);
            }
        };
        fetchLectures();
    }, []);

    return (
        <div className="flex">
            <p className="font-bold text-lg mr-3">강의 선택</p>
            <select value={selectedId || ""}
                onChange={(e) => onSelect(Number(e.target.value))}
                className="px-2 border border-gray-500 rounded-md"
            >
                {lectures && lectures.map((i) => (
                    <option key={i.lectureId} value={i.lectureId}>{i.title}</option>
                ))}
            </select>
        </div>
    )
}
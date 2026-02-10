import { useEffect, useState } from "react";

interface BoardLectureProps {
    selectedId: number | null;
    onSelect: (id: number) => void;
}

export function BoardLecture({selectedId, onSelect}: BoardLectureProps) {
    const [lectures, setLectures] = useState<{ id: number, title: string }[]>([]);

    useEffect(() => {
        // 나중에 확인하여 백엔드로 호출함
        const fetchLectures = async () => {
            try {
                // const res = await axios.get('/api/lectures');
                // setLectures(res.data);

                // 테스트용 가짜 데이터
                setLectures([
                    { id: 101, title: "React 초급" },
                    { id: 102, title: "Spring Boot 심화" }
                ]);
            } catch (err) {
                console.error("강의 목록 로드 실패", err);
            }
        };
        fetchLectures();
    }, []);

    return(
        <select value={selectedId || ""}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="px-2 border border-gray-500 rounded-md"
        >
            {lectures.map((i) => (
                <option key={i.id} value={i.id}>{i.title}</option>
            ))}
        </select>
    )
}
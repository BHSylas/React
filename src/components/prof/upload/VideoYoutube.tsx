import { useState } from "react";
import { api } from "../../../api/axiosInstance";

interface LectureYoutubeProps {
    lectureId: number;
    onSuccess: () => void;
    isEdit?: boolean;
}

export function VideoYoutube({ lectureId, onSuccess, isEdit = false }: LectureYoutubeProps) {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAttach = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!youtubeUrl) return;

        setLoading(true);
        try {
            const payload = { youtubeUrlOrId: youtubeUrl };
            const method = isEdit ? "put" : "post";
            const url = `/instructor/lectures/${lectureId}/video/youtube`;
            await api[method](url, payload);

            alert(isEdit ? "유튜브 링크가 교체되었습니다." : "유튜브 영상이 연결되었습니다.");
            onSuccess();
        } catch (err) {
            console.log(err);
            alert("유튜브 연결에 실패하였습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 p-6 border-2 border-dashed border-blue-200 rounded-md bg-gray-50">
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold">{isEdit ? "유튜브 링크 교체" : "유튜브 영상 연결"}</h2>
                <input type="text"
                    placeholder=" 예시: https://www.youtube.com/watch?..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md mb-4 outline-none focus:ring-2 focus:ring-black mt-2" />

                <button
                    onClick={handleAttach}
                    disabled={loading}
                    className={`w-full py-3 rounded-md font-bold text-white transition-colors
                ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? '연결 중...' : isEdit ? "이 유튜브로 교체하기" : "이 유튜브로 확정하기"}
                </button>
            </div>
        </div>
    )
}
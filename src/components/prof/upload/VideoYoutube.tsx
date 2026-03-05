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

            const response = await api[method](url, payload);
            const videoData = response.data; // 서버에서 반환한 LectureVideoResponseDTO

            console.log(response.data);

            if (!videoData.durationSec || videoData.durationSec === 0 || !videoData.thumbnailUrl) {
                // 데이터가 null로 들어왔다면 사용자에게 알리고 갱신 시도 제안
                alert("유튜브 정보를 불러오는 데 실패했습니다. 잠시 후 '메타 갱신'을 시도하거나 URL을 다시 확인해주세요.");
                // 실패했으므로 여기서 멈춤
                return;
            }
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
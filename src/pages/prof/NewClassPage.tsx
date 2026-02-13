import { useState } from "react";
import { api } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { VideoUpload } from "../../components/prof/upload/VideoUpload";
import { VideoYoutube } from "../../components/prof/upload/VideoYoutube";

type Language = "en" | "jp" | "de" | "it" | "cn";

export default function NewClassPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("USA");
    const [language, setLanguage] = useState<Language>("en");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [createdLectureId, setCreatedLectureId] = useState<number | null>(null);

    const [uploadMode, setUploadMode] = useState<"UPLOAD" | "YOUTUBE">("UPLOAD");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                title,
                description,
                country,
                language,
            };

            const res = await api.post("/instructor/lectures", payload);
            console.log("Create class success:", res.data);
            const lectureId = res.data.lectureId;
            setCreatedLectureId(lectureId);

            // 테스트 단계에서는 일단 alert / console 정도로 충분
            alert("Class created successfully");
            navigate("/class");
        } catch (err) {
            console.error(err);
            setError("Failed to create class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 flex justify-start items-center">
            <div className="w-full border-2 rounded-md px-3 py-3">
                <h1 className="text-2xl">New Class</h1>
                {!createdLectureId ? (
                    <form onSubmit={handleSubmit}
                        className="mt-3 border-t py-3 w-full grid">
                        <div className="mb-2">
                            <label className="text-xl font-bold">제목</label><br />
                            <input
                                className="w-full text-xl mt-2 p-1 box-border border-b-2 outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="강의 제목"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="text-xl font-bold">소개</label><br />
                            <textarea
                                className="w-full text-xl mt-2 p-1 box-border border-2 rounded-md outline-none min-h-[150px]
                            max-h-[600px] resize-none leading-[1.5] [field-sizing:content]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="강의 소개"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="font-bold">국가</label><br />
                            <select
                                className="mt-2 p-2 box-border border border-gray-400 rounded-md"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}>
                                <option value="USA">미국</option>
                                <option value="JAPAN">일본</option>
                                <option value="GERMANY">독일</option>
                                <option value="ITALY">이탈리아</option>
                                <option value="CHINA">중국</option>
                            </select>
                        </div>

                        <div className="mb-2">
                            <label className="font-bold">언어</label><br />
                            <select
                                className="mt-2 p-2 box-border border border-gray-400 rounded-md"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                            >
                                <option value="en">영어</option>
                                <option value="jp">일본어</option>
                                <option value="de">독일어</option>
                                <option value="it">이탈리아어</option>
                                <option value="cn">중국어</option>
                            </select>
                        </div>

                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <div className="flex justify-end px-3">
                            <button type="submit" disabled={loading}
                                className="btn mt-3 px-4 py-2 text-sm font-medium rounded-md
                            bg-blue-800 text-white hover:bg-blue-900 transition-colors">
                                {loading ? "저장 중..." : "다음 단계: 영상 업로드"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-3 border-t pt-5">
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6 flex justify-between items-center">
                            <span className="text-blue-800 font-medium">강의 정보가 등록되었습니다.</span>
                            <button
                                onClick={() => setCreatedLectureId(null)}
                                className="text-xs text-gray-500 underline"
                            >
                                정보 수정하기
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setUploadMode("UPLOAD")}
                                className={`px-4 py-2 rounded-md ${uploadMode === "UPLOAD" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                                직접 파일 업로드
                            </button>
                            <button
                                onClick={() => setUploadMode("YOUTUBE")}
                                className={`px-4 py-2 rounded-md ${uploadMode === "YOUTUBE" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                                유튜브 링크로 연결
                            </button>
                        </div>
                        {uploadMode === "UPLOAD" ? (
                            <VideoUpload
                                lectureId={createdLectureId}
                                onSuccess={() => {
                                    window.location.href = "/class/prof";
                                }}
                            />
                        ) : (
                            <VideoYoutube
                                lectureId={createdLectureId}
                                onSuccess={() => {
                                    window.location.href = "/class/prof";
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
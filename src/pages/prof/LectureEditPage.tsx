import { useEffect, useState } from "react";
import { VideoUpload } from "../../components/prof/upload/VideoUpload";
import { VideoYoutube } from "../../components/prof/upload/VideoYoutube";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

type Language = "en" | "jp" | "de" | "it" | "cn";

export default function LectureEditPage() {
    const { classId } = useParams<{ classId: string }>();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("USA");
    const [language, setLanguage] = useState<Language>("en");

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInfoUpdated, setIsInfoUpdated] = useState(false);
    const [uploadMode, setUploadMode] = useState<"UPLOAD" | "YOUTUBE">("UPLOAD");

    useEffect(() => {
        const fechLecture = async () => {
            try {
                const res = await axios.get(`/api/lectures/${classId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = res.data;
                setTitle(data.title);
                setDescription(data.description);
                setCountry(data.country || "USA");
                setLanguage(data.language || "en");

            } catch (e) {
                console.error("강의 정보 불러오기 실패", e);
                setError("강의 정보를 불러오는데 실패했습니다.");
            } finally {
                setFetching(false);
            }
        };
        if (classId) fechLecture();
    }, [classId]);

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = { title, description, country, language };
            await axios.patch(`/api/instructor/lectures/${classId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIsInfoUpdated(true);
            alert("강의 정보가 수정되었습니다. 영상 수정 단계로 넘어갑니다.");
        } catch (e) {
            console.error(e);
            setError("강의 정보 수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-24 text-center font-black text-gray-400">LOADING...</div>;

    return (
        <div className="max-w-6xl mx-auto py-16 px-6">
            {/* 헤더 섹션 */}
            <header className="mb-10 text-center md:text-left">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Instructor Studio</p>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">강의 정보 수정</h1>
                <p className="text-gray-500 mt-2 font-medium">강의의 상세 정보와 학습 영상을 업데이트하세요.</p>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {!isInfoUpdated ? (
                    /* 1단계: 정보 수정 폼 */
                    <form onSubmit={handleUpdateInfo} className="p-8 md:p-12 space-y-8">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-900 ml-1">강의 제목</label>
                            <input
                                className="w-full text-xl font-bold p-4 bg-gray-50 border-none rounded-2xl ring-2 ring-transparent focus:ring-blue-600/20 focus:bg-white transition-all outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="강의 제목을 입력하세요"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-900 ml-1">강의 상세 소개</label>
                            <textarea
                                className="w-full text-[16px] font-medium p-4 bg-gray-50 border-none rounded-2xl ring-2 ring-transparent focus:ring-blue-600/20 focus:bg-white transition-all outline-none min-h-[200px] resize-none leading-relaxed"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="강의 상세 소개를 입력하세요"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-900 ml-1">국가 카테고리</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none cursor-pointer"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}>
                                    <option value="USA">🇺🇸 미국</option>
                                    <option value="JAPAN">🇯🇵 일본</option>
                                    <option value="GERMANY">🇩🇪 독일</option>
                                    <option value="ITALY">🇮🇹 이탈리아</option>
                                    <option value="CHINA">🇨🇳 중국</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-900 ml-1">강의 사용 언어</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none cursor-pointer"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as Language)}>
                                    <option value="en">영어</option>
                                    <option value="jp">일본어</option>
                                    <option value="de">독일어</option>
                                    <option value="it">이탈리아어</option>
                                    <option value="cn">중국어</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-blue-600 text-white text-[15px] font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-gray-200"
                            >
                                {loading ? "저장 중..." : "다음 단계: 영상 업데이트"}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* 2단계: 영상 업데이트 */
                    <div className="p-8 md:p-12">
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">✓</div>
                                <span className="text-blue-900 font-black tracking-tight">강의 기본 정보가 업데이트되었습니다.</span>
                            </div>
                            <button
                                onClick={() => setIsInfoUpdated(false)}
                                className="text-[13px] font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4"
                            >
                                정보 재수정
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => setUploadMode("UPLOAD")}
                                className={`py-4 rounded-2xl text-[14px] font-black transition-all ${uploadMode === "UPLOAD"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}>
                                직접 파일 업로드
                            </button>
                            <button
                                onClick={() => setUploadMode("YOUTUBE")}
                                className={`py-4 rounded-2xl text-[14px] font-black transition-all ${uploadMode === "YOUTUBE"
                                    ? "bg-red-600 text-white shadow-lg shadow-red-100"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}>
                                유튜브 링크 연결
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200">
                            {uploadMode === "UPLOAD" ? (
                                <VideoUpload lectureId={Number(classId)} isEdit={true} onSuccess={() => navigate(-1)} />
                            ) : (
                                <VideoYoutube lectureId={Number(classId)} isEdit={true} onSuccess={() => navigate(-1)} />
                            )}
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-[14px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                            >
                                ← 뒤로 가기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
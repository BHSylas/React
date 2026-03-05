import { useState } from "react";
import { api } from "../../api/axiosInstance";
import { VideoUpload } from "../../components/prof/upload/VideoUpload";
import { VideoYoutube } from "../../components/prof/upload/VideoYoutube";

type Language = "en" | "jp" | "de" | "it" | "cn";

// 국가별 기본 언어 매핑 객체
const COUNTRY_LANGUAGE_MAP: Record<string, Language> = {
    USA: "en",
    JAPAN: "jp",
    GERMANY: "de",
    ITALY: "it",
    CHINA: "cn",
};

export default function NewClassPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("USA");
    // const [language, setLanguage] = useState<Language>("en"); // 국가의 종속됨으로 필요없음
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                language: COUNTRY_LANGUAGE_MAP[country] || "en", // 선택된 언어의 맞추기 (없으면 기본 영어)
            };

            const res = await api.post("/instructor/lectures", payload);
            console.log("Create class success:", res.data);
            const lectureId = res.data.lectureId;
            setCreatedLectureId(lectureId);

            // 테스트 단계에서는 일단 alert / console 정도로 충분
            alert("Class created successfully");
        } catch (err) {
            console.error(err);
            setError("Failed to create class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 헤더 섹션 */}
            <header className="mb-10 text-center md:text-left">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Instructor Studio</p>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">새 강의 등록</h1>
                <p className="text-gray-500 mt-2 font-medium">지식을 공유하고 전 세계 학생들과 연결되세요.</p>
            </header>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {!createdLectureId ? (
                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                        {/* 제목 입력 */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-900 ml-1">강의 제목</label>
                            <input
                                className="w-full text-xl font-bold p-4 bg-gray-50 border-none rounded-2xl ring-2 ring-transparent focus:ring-blue-600/20 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="예: 비즈니스 독일어 회화 마스터"
                            />
                        </div>

                        {/* 소개 입력 */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-900 ml-1">강의 상세 소개</label>
                            <textarea
                                className="w-full text-[16px] font-medium p-4 bg-gray-50 border-none rounded-2xl ring-2 ring-transparent focus:ring-blue-600/20 focus:bg-white transition-all outline-none min-h-[200px] resize-none leading-relaxed placeholder:text-gray-300"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="학생들이 강의의 가치를 알 수 있도록 상세히 적어주세요."
                            />
                        </div>

                        {/* 국가 및 언어 선택 (그리드 레이아웃) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-900 ml-1">국가 카테고리</label>
                                <p className="text-xs text-gray-400 mb-2 ml-1">* 국가를 선택하면 해당 국가의 언어로 자동 설정됩니다.</p>
                                <select
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}>
                                    <option value="USA">🇺🇸 미국</option>
                                    <option value="JAPAN">🇯🇵 일본</option>
                                    <option value="GERMANY">🇩🇪 독일</option>
                                    <option value="ITALY">🇮🇹 이탈리아</option>
                                    <option value="CHINA">🇨🇳 중국</option>
                                </select>
                            </div>

                            {/* <div className="space-y-2">
                                <label className="text-sm font-black text-gray-900 ml-1">강의 사용 언어</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as Language)}
                                >
                                    <option value="en">영어</option>
                                    <option value="jp">일본어</option>
                                    <option value="de">독일어</option>
                                    <option value="it">이탈리아어</option>
                                    <option value="cn">중국어</option>
                                </select>
                            </div> */}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 animate-shake">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-blue-600 text-white text-[15px] font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "처리 중..." : "다음 단계: 영상 업로드"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 md:p-12 animate-in zoom-in-95 duration-500">
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">✓</div>
                                <span className="text-blue-900 font-black">강의 기본 정보가 등록되었습니다.</span>
                            </div>
                            <button
                                onClick={() => setCreatedLectureId(null)}
                                className="text-[13px] font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4"
                            >
                                정보 수정하기
                            </button>
                        </div>

                        {/* 업로드 모드 선택 버튼 그룹 */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => setUploadMode("UPLOAD")}
                                className={`py-4 rounded-2xl text-[14px] font-black transition-all ${uploadMode === "UPLOAD"
                                    ? "bg-blue-600 text-white shadow-lg shadow-gray-300 scale-[1.02]"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}>
                                직접 파일 업로드
                            </button>
                            <button
                                onClick={() => setUploadMode("YOUTUBE")}
                                className={`py-4 rounded-2xl text-[14px] font-black transition-all ${uploadMode === "YOUTUBE"
                                    ? "bg-red-600 text-white shadow-lg shadow-red-100 scale-[1.02]"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}>
                                유튜브 링크 연결
                            </button>
                        </div>

                        {/* 하위 컴포넌트 렌더링 영역 */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200">
                            {uploadMode === "UPLOAD" ? (
                                <VideoUpload lectureId={createdLectureId} onSuccess={() => window.location.href = "/class"} />
                            ) : (
                                <VideoYoutube lectureId={createdLectureId} onSuccess={() => window.location.href = "/class"} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
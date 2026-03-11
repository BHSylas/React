import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";

interface NpcStatsDTO {
    country: string;
    level: string;
    totalNpcCount: number;
    solvedCount: number;
    correctCount: number;
    officialAccuracy: number;
    accuracy: number;
}

const COUNTRY_NAMES: Record<string, string> = {
    USA: "미국",
    JAPAN: "일본",
    CHINA: "중국",
    GERMANY: "독일",
    ITALY: "이탈리아",
    UK: "영국",
    FRANCE: "프랑스",
};

const LEVEL_NAMES: Record<string, string> = {
    BEGINNER: "초급",
    INTERMEDIATE: "중급",
    ADVANCED: "고급",
};

export default function ProfMetaStats() {
    const [stats, setStats] = useState<NpcStatsDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState("ALL");
    const [selectedLevel, setSelectedLevel] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        api.get("/professor/stats")
            .then(res => setStats(res.data))
            .catch(err => console.error("통계 로드 실패:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const filteredStats = stats.filter(item => {
        if (item.totalNpcCount === 0) return false;
        const countryMatch = selectedCountry === "ALL" || item.country === selectedCountry;
        const levelMatch = selectedLevel === "ALL" || item.level === selectedLevel;
        return countryMatch && levelMatch;
    });

    // 요약 수치
    const totalNpcs = stats.reduce((acc, cur) => acc + cur.totalNpcCount, 0);
    const totalSolved = stats.reduce((acc, cur) => acc + cur.solvedCount, 0);
    const totalCorrect = stats.reduce((acc, cur) => acc + cur.correctCount, 0);

    // 페이지네이션
    const totalPages = Math.ceil(filteredStats.length / itemsPerPage);
    const currentItems = filteredStats.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex-1">
            {/* 헤더 */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-900 mb-8">
                <h2 className="text-[22px] font-black text-gray-900 tracking-tight">메타버스 학습 통계</h2>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                    Student Analytics
                </span>
            </div>

            {/* 요약 카드 */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border-2 border-gray-200 rounded-[1.5rem] p-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Total Problems</p>
                    <p className="text-3xl font-black text-gray-900">
                        {totalNpcs}
                        <span className="text-sm ml-1 font-bold text-black">문제</span>
                    </p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-[1.5rem] p-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Total Solved</p>
                    <p className="text-3xl font-black text-gray-900">
                        {totalSolved}
                        <span className="text-sm ml-1 font-bold text-black">회</span>
                    </p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-[1.5rem] p-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Correct Count</p>
                    <p className="text-3xl font-black text-gray-900">
                        {totalCorrect}
                        <span className="text-sm ml-1 font-bold text-black">정답</span>
                    </p>
                </div>
            </div>

            {/* 필터 */}
            <div className="flex gap-3 mb-4">
                <select
                    value={selectedCountry}
                    onChange={e => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold outline-none bg-white"
                >
                    <option value="ALL">전체 국가</option>
                    {[...new Set(stats.map(s => s.country))].map(c => (
                        <option key={c} value={c}>{COUNTRY_NAMES[c] ?? c}</option>
                    ))}
                </select>
                <select
                    value={selectedLevel}
                    onChange={e => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold outline-none bg-white"
                >
                    <option value="ALL">전체 레벨</option>
                    {[...new Set(stats.map(s => s.level))].map(l => (
                        <option key={l} value={l}>{LEVEL_NAMES[l] ?? l}</option>
                    ))}
                </select>
            </div>

            {/* 테이블 */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-4 font-black text-gray-600 text-left">국가</th>
                            <th className="py-4 px-4 font-black text-gray-600">난이도</th>
                            <th className="py-4 px-4 font-black text-gray-600">전체 문제</th>
                            <th className="py-4 px-4 font-black text-gray-600">풀이 횟수</th>
                            <th className="py-4 px-4 font-black text-gray-600">정답 수</th>
                            <th className="py-4 px-4 font-black text-gray-600">진도율</th>
                            <th className="py-4 px-4 font-black text-gray-600">정답률</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentItems.length > 0 ? currentItems.map((item, idx) => {
                            const progress = item.totalNpcCount > 0
                                ? Math.min(100, Math.round((item.solvedCount / item.totalNpcCount) * 100))
                                : 0;
                            const isLow = item.officialAccuracy < 20;

                            return (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 font-bold text-gray-900 text-left">
                                        {COUNTRY_NAMES[item.country] ?? item.country}
                                    </td>
                                    <td className="py-4 px-4 text-gray-600 font-medium">
                                        {LEVEL_NAMES[item.level] ?? item.level}
                                    </td>
                                    <td className="py-4 px-4 text-gray-700 font-bold">{item.totalNpcCount}</td>
                                    <td className="py-4 px-4 text-gray-700">{item.solvedCount}</td>
                                    <td className="py-4 px-4 text-gray-700">{item.correctCount}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{progress}%</span>
                                        </div>
                                    </td>
                                    <td className={`py-4 px-4 font-bold ${isLow ? "text-red-500" : "text-green-600"}`}>
                                        {item.officialAccuracy}%
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={7} className="py-16 text-gray-300 font-medium">
                                    조건에 맞는 통계가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-30 hover:bg-gray-50"
                    >
                        이전
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                                currentPage === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-30 hover:bg-gray-50"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

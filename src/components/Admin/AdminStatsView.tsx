import axios from "axios";
import { useEffect, useState } from "react";

interface NpcStats {
    country: string; // 나라
    level: string; // 레벨
    totalNpcCount: number; // 전체 NPC(문제) 수
    solvedCount: number; // 사용자가 푼 문제
    correctCount: number; // 사용자가 맞춘 문제
    officialAccuracy: number; // 전체 문제 대비 정답률
    accuracy: number; // 푼 문제대비 정답률
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
}

export function AdminStatsView() {
    const [stats, setStats] = useState<NpcStats[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const itemsPerPage = 10;

    const [selectedCountry, setSelectedCountry] = useState<string>("ALL"); // 국가 선택
    const [selectedLevel, setSelectedLevel] = useState<string>("ALL"); // 레벨 선택

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const r = await axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
                setStats(r.data);
            } catch (e) {
                console.error("오류", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const filterStats = stats.filter(item => {
        if (item.totalNpcCount === 0) return false;

        const countryMath = selectedCountry === "ALL" || item.country === selectedCountry; // 전체 혹은 선택한 국가
        const levelMath = selectedLevel === "ALL" || item.level === selectedLevel; // 전체 혹은 선택한 레벨
        return countryMath && levelMath;
    });

    if (loading) return <div>데이터 로딩 중...</div>

    const totalNpcs = stats.reduce((acc, curr) => acc + curr.totalNpcCount, 0); // 문제 횟수(NPC횟수)
    const totalSolved = stats.reduce((acc, curr) => acc + curr.solvedCount, 0); // 풀이횟수
    const avgAccuracy = (stats.reduce((acc, curr) => acc + curr.officialAccuracy, 0) / (stats.length || 1)).toFixed(2);

    const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지의 마지막 인덱스
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지의 첫 인덱스
    const currentItems = filterStats.slice(indexOfFirstItem, indexOfLastItem) // 현재 페이지에 보여줄 데이터(필터링 포함)
    const totalPages = Math.ceil(filterStats.length / itemsPerPage); // 전체 페이지 수

    return (
        <div className="p-6 min-h-screen">
            <div>
                <h2 className="text-3xl font-bold text-center">메타버스 학습 통계</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-5">
                    <div className="p-5 rounded-md shadow border border-gray-400">
                        <p className="text-[17px] font-medium">총 문제 수</p>
                        <span className="text-2xl font-bold text-blue-600">{totalNpcs.toLocaleString()}</span>
                    </div>
                    <div className="p-5 rounded-md shadow border border-gray-400">
                        <p className="text-[17px] font-medium">풀이 횟수</p>
                        <span className="text-2xl font-bold text-blue-600">{totalSolved.toLocaleString()}</span>
                    </div>
                    <div className="p-5 rounded-md shadow border border-gray-400">
                        <p className="text-[17px] font-medium">평균 정답률</p>
                        <span className="text-2xl font-bold text-blue-600">{avgAccuracy}%</span>
                    </div>
                </div>
            </div>
            <div className="rounded-lg shadow overflow-hidden p-4 border border-gray-400">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr>
                            <th className="py-4">국가</th>
                            <th className="py-4">난이도</th>
                            <th className="py-4">전체 문제</th>
                            {/* <th className="py-4">사용자가 푼 문제</th> */}
                            {/* <th className="py-4">정답률</th> */}
                            <th className="py-4">정답률</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-500">
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => {
                                const isLowAccuracy = item.accuracy < 30; // 정답률 30퍼 빨간색
                                const isLowOffAccuracy = item.officialAccuracy < 30; // 전체 정답률 30퍼 미만 빨간색

                                return (
                                    <tr key={index}>
                                        <td className="py-4 text-black">{COUNTRY_NAMES[item.country]}</td>
                                        <td className="py-4 text-black">{LEVEL_NAMES[item.level]}</td>
                                        <td className="py-4 text-black">{item.totalNpcCount}</td>
                                        {/* <td className="py-4">{item.solvedCount}</td> */}
                                        {/* <td className={`py-4 font-bold ${isLowAccuracy ? 'text-red-600' : 'text-gray-700'
                                            }`}>{item.accuracy}%</td> */}
                                        <td className={`py-4 font-medium ${isLowOffAccuracy ? 'text-red-500' : 'text-green-500'}`}>
                                            {item.officialAccuracy}%
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <div className="px-8 text-gray-400">검색 조건의 맞는 내용이 없습니다.</div>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-end gap-6 mb-8 p-4 border-t">
                    <div>
                        <select
                            value={selectedCountry}
                            onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
                            className="p-2 border rounded border-gray-400 outline-none">
                            <option value="ALL">전체 국가</option>
                            {[...new Set(stats.map(s => s.country))].map(c => <option key={c} value={c}>{COUNTRY_NAMES[c]}</option>)}
                        </select>
                    </div>
                    <div>
                        <select
                            value={selectedLevel}
                            onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
                            className="p-2 border rounded border-gray-400 outline-none">
                            <option value="ALL">전체 레벨</option>
                            {[...new Set(stats.map(s => s.level))].map(c => <option key={c} value={c}>{LEVEL_NAMES[c]}</option>)}
                        </select>
                    </div>
                </div>
                {stats.length > itemsPerPage && (
                    <div className="flex justify-center mt-5 border-t-2 py-5 gap-5">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-500 rounded hover:bg-gray-100">
                            이전
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`${currentPage === i + 1 ? 'text-blue-500 font-bold' :
                                    'text-gray-500 hover:font-bold'}`}>
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-500 rounded hover:bg-gray-100"
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
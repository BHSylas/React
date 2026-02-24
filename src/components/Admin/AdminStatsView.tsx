import axios from "axios";
import { useEffect, useState } from "react";

interface NpcStats {
    country: string;
    level: string;
    totalNpcCount: number;
    solvedCount: number;
    correctCount: number;
    officialAccuracy: number;
    accuracy: number;
}

export function AdminStatsView() {
    const [stats, setStats] = useState<NpcStats[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const itemsPerPage = 10;

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

    if (loading) return <div>데이터 로딩 중...</div>

    const totalNpcs = stats.reduce((acc, curr) => acc + curr.totalNpcCount, 0); // 문제 횟수(NPC횟수)
    const totalSolved = stats.reduce((acc, curr) => acc + curr.solvedCount, 0); // 풀이횟수
    const avgAccuracy = (stats.reduce((acc, curr) => acc + curr.accuracy, 0) / (stats.length || 1)).toFixed(2);
    // 정답률

    const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지의 마지막 인덱스
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지의 첫 인덱스
    const currentItems = stats.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에 보여줄 데이터만 자르기
    const totalPages = Math.ceil(stats.length / itemsPerPage); // 전체 페이지 수

    return (
        <div className="p-6 min-h-screen">
            <div>
                <h2 className="text-3xl font-bold text-center">메타버스 학습 통계</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-5">
                    <div className="p-5 rounded-md shadow">
                        <p className="text-sm text-gray-500 font-medium">총 문제 수</p>
                        <span className="text-2xl font-bold text-blue-600">{totalNpcs.toLocaleString()}</span>
                    </div>
                    <div className="p-5 rounded-md shadow">
                        <p className="text-sm text-gray-500 font-medium">풀이 횟수</p>
                        <span className="text-2xl font-bold text-blue-600">{totalSolved.toLocaleString()}</span>
                    </div>
                    <div className="p-5 rounded-md shadow">
                        <p className="text-sm text-gray-500 font-medium">평균 정답률</p>
                        <span className="text-2xl font-bold text-blue-600">{avgAccuracy}%</span>
                    </div>
                </div>
            </div>
            <div className="rounded-lg shadow overflow-hidden p-4">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr>
                            <th className="py-4">국가</th>
                            <th className="py-4">난이도</th>
                            <th className="py-4">NPC 수</th>
                            <th className="py-4">정답 / 전체 풀이</th>
                            <th className="py-4">정답률</th>
                            <th className="py-4">대비 편차</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-500">
                        {currentItems.map((item, index) => {
                            const diff = item.accuracy - item.officialAccuracy;
                            const isLowAccuracy = item.accuracy < 30; // 정답률 30퍼 빨간색

                            return (
                                <tr key={index}>
                                    <td className="py-4">{item.country}</td>
                                    <td className="py-4">{item.level}</td>
                                    <td className="py-4">{item.totalNpcCount}</td>
                                    <td className="py-4">{item.correctCount} / {item.solvedCount}</td>
                                    <td className={`py-4 font-bold ${isLowAccuracy ? 'text-red-600' : 'text-gray-700'
                                        }`}>{item.accuracy}%</td>
                                    <td className={`py-4 font-medium ${diff < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                                    </td>
                                    {/* 대비편차가 음수일 때(마이너스 일 때 붉은색 */}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {stats.length > itemsPerPage && (
                    <div className="flex justify-center mt-5 border-t-2 py-5 gap-5">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-100">
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
                            className="px-3 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-100"
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
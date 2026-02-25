import { useNavigate, useParams } from "react-router";
import { type StudentEnrollment, type LectureStats } from "../../types/Instructor";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";

export default function LectureManagePage() {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();

    const [stats, setStats] = useState<LectureStats | null>(null); // 강의 진도 상태
    const [students, setStudents] = useState<StudentEnrollment[]>([]); // 강의 학생 목록
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchManagementData = async () => {
            try {
                setLoading(true);
                // 통계와 학생 리스트를 같이 가져옴
                const [statsRes, studentsRes] = await Promise.all([
                    api.get(`/instructor/lectures/${classId}/stats`),
                    api.get(`/instructor/lectures/${classId}/enrollments`)
                ]);

                console.log(statsRes.data);
                console.log(studentsRes.data);

                setStats(statsRes.data);
                setStudents(studentsRes.data.content || studentsRes.data); //Page일경우를 대비해 .content도 사용
            } catch (e) {
                console.error("데이터 로드 실패", e);
            } finally {
                setLoading(false);
            }
        };

        if (classId) fetchManagementData();
    }, [classId]);

    if (loading) return <div className="p-8 text-gray-500">관리 데이터를 불러오는 중...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen bg-white">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-10 border-b pb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">강의 통합 관리</h1>
                    <p className="text-sm text-gray-400 mt-1">강의 식별 번호: {classId}</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2 text-sm font-bold border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded-none"
                >
                    강의페이지로 돌아가기
                </button>
            </div>

            {/* 상단 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 border-l-4 border-blue-600 bg-blue-50">
                    <p className="text-xs font-bold text-blue-600">전체 수강생 수</p>
                    <p className="text-2xl font-black mt-1 text-blue-900">{stats?.enrolledCount || 0}명</p>
                </div>
                <div className="p-6 border-l-4 border-green-500 bg-green-50">
                    <p className="text-xs font-bold text-green-600">평균 진도율</p>
                    <p className="text-2xl font-black mt-1 text-green-900">{stats ? Math.round(stats.avgProgressRate) : 0}%</p>
                </div>
                <div className="p-6 border-l-4 border-purple-500 bg-purple-50">
                    <p className="text-xs font-bold text-purple-600">수료 완료 인원</p>
                    <p className="text-2xl font-black mt-1 text-purple-900">{stats?.completedCount || 0}명</p>
                </div>
            </div>

            {/* 수강생 리스트 테이블 */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    수강생 현황
                </h2>
                <div className="border-t-2 border-gray-900 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-4 py-4 text-xs font-bold text-gray-600">수강생 닉네임</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-600 text-center">진도율</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-600 text-center">상태</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-600 text-right">수료일</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map((student) => (
                                <tr key={student.enrollmentId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-5 font-bold text-gray-800">
                                        {student.studentNickname}
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex items-center gap-3 justify-center">
                                            <div className="w-32 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-gray-900 h-full"
                                                    style={{ width: `${student.progressRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium w-8 text-right">{student.progressRate}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-sm border ${student.status === 'COMPLETED'
                                                ? 'border-green-600 text-green-600 bg-green-50'
                                                : 'border-gray-300 text-gray-400'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-right text-sm text-gray-500">
                                        {student.completedAt ? new Date(student.completedAt).toLocaleDateString() : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {students.length === 0 && (
                        <div className="py-20 text-center text-gray-300">
                            데이터가 존재하지 않습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
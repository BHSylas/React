import { useEffect, useState } from "react";
import { type EnrollmentStatus, type LectureStudentEnrollmentItem } from "../../components/prof/enrollment/StudentEnrollment";
import { api } from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

export const ProfClassStudent: React.FC = () => {
    const { lectureId } = useParams<{ lectureId: string }>();
    const [enrollments, setEnrollments] = useState<LectureStudentEnrollmentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<string>("");
    const navigate = useNavigate();

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60); // 분
        const s = seconds % 60; // 초
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    } // 시간 변환, 서버에서 초 단위로 내려오는 시청시간을 분:초 형태로 변환

    const statusMap: Record<EnrollmentStatus, { label: string; color: string }> = {
        NOT_STARTED: { label: '시작 전', color: 'bg-gray-100 text-gray-600' },
        IN_PROGRESS: { label: '학습 중', color: 'bg-blue-100 text-blue-600' },
        COMPLETED: { label: '수료 완료', color: 'bg-green-100 text-green-600' },
        CANCELED: { label: '취소', color: 'bg-red-100 text-red-600' }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                api.get(`/lectures/${lectureId}`).then(res => {
                    setTitle(res.data.title);
                }).catch(err => {
                    console.error("강의 정보 로드 실패", err);
                });
                const res = await api.get(`/instructor/lectures/${lectureId}/enrollments`);
                setEnrollments(res.data.content);
            } catch (err) {
                console.error("데이터 로드 실패", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [lectureId]);

    if (loading) return <div>수강생 정보를 불러오는 중...</div>

    return (
        <main>
            <div>
                <div className="flex flex-col items-center">
                    <div className="w-full flex justify-start">
                        <button className="font-bold cursor-pointer hover:text-blue-900 hover:scale-105 transition-all" onClick={() => {navigate('/class/prof')}}>← 강의 목록</button>
                    </div>
                    <h2 className="my-6 font-bold text-5xl text-center">{title}</h2>
                    <p className="p-2 text-center text-blue-800 font-bold cursor-pointer hover:text-blue-900 hover:scale-105 transition-all" onClick={() => {navigate(`/class/${lectureId}`)}}>강의 바로 가기</p>
                </div>
                {enrollments.length > 0 ? (
                    <div>
                        <div>
                            <h3 className="my-6 font-bold text-xl">수강생 목록</h3>
                            <div className="mb-4 text-gray-600">총 {enrollments.length}명의 수강생이 있습니다.</div>
                        </div>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2">학생(닉네임)</th>
                                    <th className="px-3 py-2">학습 진도 상태</th>
                                    <th className="px-3 py-2">진도율 / 시청시간</th>
                                    <th className="px-3 py-2">수료일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((item) => (
                                    <tr key={item.enrollmentId} className="border-y border-gray-200">
                                        <td className="px-3 py-2"><span className="tont-semibold">{item.studentNickname}</span></td>
                                        <td className="px-3 py-2"><span className={`px-2 py-1 rounded-full text-xs font-medium
                                        ${statusMap[item.status].color} `}>{statusMap[item.status].label}</span></td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${item.progressRate}%` }}></div>
                                                </div>
                                                <div>
                                                    {formatTime(item.lastWatchedTime)} / {formatTime(item.totalDuration)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            {item.completedAt ? (
                                                <div className="text-green-600 mt-1">수료: {new Date(item.completedAt).toLocaleDateString()}</div>
                                            ) : (
                                                <div className="text-red-600 mt-1">수료가 되지 않았습니다.</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="font-bold">아직 수강 신청한 학생이 없습니다.</div>
                )}
            </div>
        </main>
    )
}
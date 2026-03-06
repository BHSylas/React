import { useEffect, useState } from "react";
// import { api } from "../../api/axiosInstance";
import type { EnrollmentItem } from "../../types/EnrollmentItem";
import HeadRenderer from "../../components/my/HeadRenderer";
import EnrollmentRenderer from "../../components/my/EnrollmentRenderer";
import { useAuth } from "../../hooks/useAuth";
import { ProfClassList } from "../../components/prof/my/ProfClassList";
import { MyActivityRenderer } from "../../components/my/MyActivityRenderer";
import QuizRenderer from "../../components/my/QuizRenderer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import MetaList from "../prof/MetaList";
import { api } from "../../api/axiosInstance";

type MyPagePick = "Class" | "QnA" | "Post" | "Comment" | "Metaverse" | "Quiz";

interface TokenPayload {
    sub: string;
}

export default function MyPage() {
    const [loading, setLoading] = useState(true);
    const [picked, setPicked] = useState<MyPagePick>(() => {
        const savedPick = sessionStorage.getItem("recentPick");
        if (savedPick) {
            sessionStorage.removeItem("recentPick");
            return savedPick as MyPagePick;
        }
        return "Class";
    });
    const [classes, setClasses] = useState<EnrollmentItem[]>([]);
    const [contentList, setContentList] = useState<any[]>([]);
    const [quizStats, setQuizStats] = useState<any>(null); // 퀴즈 통계 데이터 상태 추가

    const handlePick = (item: MyPagePick) => {
        setPicked(item);
        sessionStorage.setItem("recentPick", item);
    }

    const { role, nickname } = useAuth();
    useEffect(() => {
        const fetchData = async () => {
            if (picked === "Class" && Number(role) === 1) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setContentList([]);
            const token = localStorage.getItem("token");
            let currentSub: string | null = null;
            if (token) {
                try {
                    const decoded = jwtDecode<TokenPayload>(token);
                    currentSub = decoded.sub;
                } catch (e) {
                    console.error("토큰 디코딩 실패", e);
                }
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            try {
                switch (picked) {
                    case "Class":
                        {
                            const res = await axios.get("/api/me/enrollments", config);
                            setClasses(res.data.content || []);
                            break;
                        }
                    case "QnA":
                    case "Post":
                        // QnA 게시판에서 내 닉네임으로 작성된 것만
                        {
                            const boardRes = await axios.get("/api/boards/searchBoard?size=1000", config);
                            const boardData = boardRes.data.content || [];
                            let myLectureIds: any[] = []; // 강의 아이디 저장
                            if (Number(role) === 1 && picked === "QnA") {
                                try {
                                    const lecturesRes = await axios.get(`/api/lectures?size=1000`, config); // 강의목록
                                    const allLectures = lecturesRes.data.content || []; // 강의 내용
                                    myLectureIds = allLectures
                                        .filter((lec: any) => String(lec.professorId) === String(currentSub))
                                        // 교수아이디와 로그인 계정 id을 비교
                                        .map((lec: any) => lec.lectureId); // 맞는 거에서 강의아이디 가져옴
                                } catch (e) {
                                    console.error("강의 목록 조회 실패", e);
                                }
                            }
                            const filtered = boardData.filter((item: any) => {
                                const isAuthor = item.writerName?.trim() === nickname?.trim();
                                if (picked === "QnA") {
                                    if (Number(role) === 1) return item.boardType === "LECTURE_QNA" && myLectureIds.includes(item.lectureId);
                                    // if (Number(role) === 2) return item.boardType === "QNA";
                                    return isAuthor && item.boardType === "LECTURE_QNA"; // 학생이면
                                }
                                return isAuthor && item.boardType !== "LECTURE_QNA"; // post면 강의 QnA 글 안 보이게 하기
                            });
                            setContentList(filtered);
                            break;
                        }
                    case "Comment":
                        {
                            const cr = await axios.get("/api/boards/comments/me", config);
                            const commentData = cr.data.content || cr.data || [];
                            const seenIds = new Set();
                            const uniqueComments = commentData.filter((item: any) => {
                                if (seenIds.has(item.id)) {
                                    return false; // 이미 있는 ID면 제외
                                }
                                seenIds.add(item.id);
                                return true;
                            });
                            setContentList(uniqueComments);
                            break;
                        }
                    case "Quiz":
                        {
                            api.get("/myPage/learning-stats").then(res => {
                                console.log("학습 통계 데이터: ", res.data);
                                setQuizStats(res.data);
                            }).catch(err => {
                                console.error("학습 통계 로드 실패: ", err);
                            });
                            break;
                        }
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [picked, nickname, role]);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 프로필 영역 */}
                <header className="mb-16">
                    <HeadRenderer />
                </header>

                {/* 메인 콘텐츠 영역 */}
                <div className="flex gap-4 min-h-[600px] animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <Picker picked={picked} onPick={handlePick} role={role} />

                    <main className="flex-1 pl-8">
                        {picked === "Class" && (
                            Number(role) === 1 ? <ProfClassList /> : <EnrollmentRenderer classes={classes} />
                        )}
                        {picked === "Metaverse" && <MetaList />}
                        {picked !== "Class" && picked !== "Metaverse" && picked !== "Quiz" && (
                            <MyActivityRenderer type={picked} data={contentList} />
                        )}
                        {picked === "Quiz" && <QuizRenderer data={quizStats} />}
                    </main>
                </div>
            </div>
        </div>
    );
}

function Picker({ picked, onPick, role }: { picked: string; onPick: (item: any) => void; role: any }) {
    const userRole = Number(role);

    const items = ["Class", "QnA", "Post", "Comment"].filter(item => {
        if (item === "QnA" && userRole === 2) return false;
        return true;
    });

    if (userRole === 1) {
        items.push("Metaverse");
    }
    else if (userRole === 0) {
        items.push("Quiz"); // 퀴즈 탭 추가: 교수는 퀴즈 못 푸니까 안 보이게
    }
    return (
        <nav className="w-64 shrink-0 pr-8 space-y-2 border-r border-gray-100 h-fit">
            <p className="px-4 mb-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Dashboard</p>
            {items.map((item) => {
                let displayName = item;
                if (item === "QnA") {
                    displayName = "강의 Q&A";
                }
                const isPicked = picked === item;
                return (
                    <button
                        key={item}
                        className={`w-full flex items-center px-5 py-4 rounded-2xl text-[15px] font-black transition-all duration-200 
                            ${isPicked
                                ? "bg-blue-600 text-white shadow-lg shadow-gray-200 translate-x-2"
                                : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        onClick={() => onPick(item as any)}
                    >
                        {isPicked && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 animate-pulse" />}
                        {displayName}
                    </button>
                );
            })}
        </nav>
    );
}
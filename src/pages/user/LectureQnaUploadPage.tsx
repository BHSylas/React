import { useState, type ChangeEvent, useEffect } from "react"
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { QNA_FORM } from "../../components/board/upload/BoardOptions";
import { BoardLecture } from "../../components/board/upload/BoardLecture";

export function LectureQnAUploadPage() {
    const { lectureId: urlLectureId } = useParams(); // URL 파라미터 추출
    const [formData, setFormData] = useState({
        ...QNA_FORM
    });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (urlLectureId) {
            setFormData(prev => ({
                ...prev,
                lectureId: Number(urlLectureId)
            }));
        }
    }, [urlLectureId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    }

    const handleLectureSelect = (id: number) => {
        setFormData(prev => ({
            ...prev,
            lectureId: id
        }));
    };

    const handleSave = async () => {

        if (!formData.title && !formData.content) {
            alert("제목과 내용은 필수 입력 사항입니다.");
            return;
        }

        const dataToSend = { ...formData };

        if (formData.boardType !== "LECTURE_QNA") {
            dataToSend.lectureId = 0;
        } else if (!formData.lectureId) {
            alert("질문할 강의를 선택해주세요.");
            return;
        }

        axios.post('/api/boards/create', dataToSend, {
            headers: {
                Authorization: `Bearer ${token}` // 토큰 전달
            }
        }).then(res => {
            if (!res) throw new Error(`서버 응답 오류`);
            alert("업로드 성공!");
            navigate(`/class/qna/${formData.lectureId}`)
        }).catch(err => {
            console.error("데이터 로드 실패: ", err);
            alert("업로드 중 오류가 발생했습니다.");
        })
    }

    const handleReset = () => {
        if (window.confirm("내용을 모두 삭제하겠습니까?")) {
            setFormData({ ...QNA_FORM });
        }
    }

    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            {/* 상단 헤더: 서비스 아이덴티티 강조 */}
            <header className="mb-10 ml-2">
                <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Lecture Q&A</p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">강의 질문하기</h1>
            </header>

            {/* 메인 폼 컨테이너: 연한 테두리와 미세한 그림자로 영역 명확화 */}
            <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="space-y-10">

                    {/* 제목 입력 영역: 밑줄 스타일로 가독성 확보 */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest">Question Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full text-2xl font-bold py-3 px-1 border-b border-gray-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-200 bg-transparent"
                            placeholder="어떤 점이 궁금하신가요?"
                        />
                    </div>

                    {/* 강의 선택 영역: 별도 박스로 분리하여 시각적 인지 향상 */}
                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            <label className="text-[11px] font-black text-gray-700 uppercase tracking-widest">Select Your Lecture</label>
                        </div>
                        <div>
                            <BoardLecture
                                selectedId={formData.lectureId}
                                onSelect={handleLectureSelect}
                            />
                        </div>
                    </div>

                    {/* 본문 영역: 내부 테두리와 연한 배경으로 영역 가두기 */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full min-h-[450px] p-6 text-[15px] leading-relaxed resize-none outline-none text-gray-700 placeholder:text-gray-200 bg-gray-50/30 rounded-2xl border border-gray-100 focus:bg-white focus:border-blue-200 transition-all shadow-inner"
                            placeholder="내용을 입력하세요..."
                        />
                    </div>
                </div>

                {/* 하단 버튼 바: 정돈된 간격과 반응형 대응 */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleSave}
                            className="flex-1 md:flex-none px-10 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                        >
                            질문 등록
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3.5 bg-white text-gray-400 text-sm font-bold rounded-xl border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                        >
                            초기화
                        </button>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full md:w-auto px-6 py-3.5 text-gray-400 text-sm font-bold hover:text-gray-900 transition-all"
                    >
                        취소 후 돌아가기
                    </button>
                </div>
            </section>
        </main>
    );
}
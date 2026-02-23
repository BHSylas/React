import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router";
import axios from "axios";
import { QNA_FORM } from "../../components/board/upload/BoardOptions";
import { BoardLecture } from "../../components/board/upload/BoardLecture";

export function LectureQnAUploadPage() {
    const [formData, setFormData] = useState({
        ...QNA_FORM
    });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

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
        <main className="px-6 py-8 space-y-6">
            <section className="border border-gray-300 rounded-md px-5 py-7">
                <div className="w-full mb-5">
                    <input name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border-b-2 border-gray-300 w-full h-full text-xl p-2 outline-none mb-5"
                        placeholder="게시글 제목"></input>
                    <div>
                            <BoardLecture selectedId={formData.lectureId}
                                onSelect={handleLectureSelect}></BoardLecture>
                    </div>
                </div>
                <div>
                    <textarea name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className="w-full h-screen resize-none leading-[1.5]
                    border-2 border-gray-300 rounded-md p-3"
                        placeholder="내용을 입력하세요.">
                    </textarea>
                </div>
                <div className="mt-5 flex justify-between items-center">
                    <div className="flex gap-3 px-3">
                        <button onClick={handleSave}
                            className="btn px-4 py-2 text-sm font-medium rounded-md bg-blue-800 text-white
                        hover:bg-blue-900 transition-colors">업로드</button>
                        <button onClick={handleReset}
                            className="btn px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white
                        hover:bg-red-700 transition-colors">초기화</button>
                    </div>
                    <div className="px-3">
                        <button onClick={() => navigate(-1)}
                            className="btn px-4 py-2 text-sm font-medium rounded-md bg-blue-800 text-white
                        hover:bg-blue-900 transition-colors">목록</button>
                    </div>
                </div>
            </section>
        </main>
    )
}
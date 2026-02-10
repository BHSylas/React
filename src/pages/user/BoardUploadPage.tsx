import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router";
import axios from "axios";
import { BOARD_ROLE_OPTION, BOARD_FORM } from "../../components/board/upload/BoardOptions";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { BoardLecture } from "../../components/board/upload/BoardLecture";

interface MyTokenPayload extends JwtPayload {
    role: number | string; // 0, 1, 2 숫자로 들어오면 number
}

export function BoardUploadPage() {
    const [formData, setFormData] = useState(BOARD_FORM);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let userRole = ""; // 기본은 학생으로 설정

    if (token) {
        try {
            const decoded = jwtDecode<MyTokenPayload>(token);
            userRole = String(decoded.role);
        } catch (error) {
            console.error("토큰 해독 실패", error);
        }
    }

    const filteredOptions = BOARD_ROLE_OPTION.filter(opt =>
        opt.roles.includes(userRole)
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

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

        axios.post('/api/board/create', formData, {
            headers: {
                Authorization: `Bearer ${token}` // 토큰 전달
            }
        }).then(res => {
            if (!res) throw new Error(`서버 응답 오류`);
            alert("업로드 성공!");
            navigate('/board')
        }).catch(err => {
            console.error("데이터 로드 실패: ", err);
            alert("업로드 중 오류가 발생했습니다.");
        })
    }

    const handleReset = () => {
        if (window.confirm("내용을 모두 삭제하겠습니까?")) {
            setFormData({ ...BOARD_FORM });
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
                        <input className="outline-none px-1 w-auto"
                            placeholder="작성자" readOnly></input>
                        <input className="outline-none px-1 w-auto"
                            placeholder="날짜" readOnly></input>
                        <select name="boardType"
                            value={formData.boardType}
                            onChange={handleChange}
                            className="px-2 border border-gray-500 rounded-md mr-6">
                            {filteredOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {formData.boardType === "LECTURE_QNA" && (
                            <BoardLecture selectedId={formData.lectureId}
                                onSelect={handleLectureSelect}></BoardLecture>
                        )}
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
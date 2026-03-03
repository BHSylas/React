import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router";
import axios from "axios";
import { BOARD_ROLE_OPTION, BOARD_FORM } from "../../components/board/upload/BoardOptions";
import { jwtDecode, type JwtPayload } from "jwt-decode";
// import { BoardLecture } from "../../components/board/upload/BoardLecture";

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
        const { name, value, type } = e.target;
        // 1. 체크박스(pinned)인 경우 처리
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
            return;
        }

        // 2. 숫자형 데이터(lectureId) 처리
        if (name === "lectureId") {
            setFormData((prev) => ({
                ...prev,
                [name]: Number(value),
            }));
            return;
        }

        // 3. 나머지 일반 텍스트 및 셀렉트 박스 처리
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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

        axios.post('/api/boards/create', formData, {
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
        <main className="max-w-6xl mx-auto px-6 py-12">
            <header className="mb-10 ml-2">
                <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Editor</p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">게시글 작성</h1>
            </header>

            <section className="bg-white border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="space-y-10">
                    
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest">Title</label>
                        <input 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full text-2xl font-bold py-3 px-1 border-b border-gray-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-200"
                            placeholder="제목을 입력해 주세요"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                        <div className="flex items-center gap-3">
                            <select 
                                name="boardType"
                                value={formData.boardType}
                                onChange={handleChange}
                                className="pl-4 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer appearance-none shadow-sm"
                            >
                                {filteredOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {formData.boardType === "NOTICE" && (
                            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm hover:border-blue-300 transition-all">
                                <input
                                    type="checkbox"
                                    name="pinned"
                                    checked={formData.pinned}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                <span className="text-sm font-bold text-blue-600">상단 고정 공지</span>
                            </label>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest">Content</label>
                        <textarea 
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full min-h-[450px] p-6 text-[15px] leading-relaxed resize-none outline-none text-gray-700 placeholder:text-gray-200 bg-gray-50/30 rounded-2xl border border-gray-100 focus:bg-white focus:border-blue-200 transition-all"
                            placeholder="내용을 입력하세요..."
                        />
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={handleSave}
                            className="flex-1 md:flex-none px-10 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                        >
                            업로드
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
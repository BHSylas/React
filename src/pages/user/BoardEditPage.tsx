import { useEffect, useState, type ChangeEvent } from "react"
import { useNavigate, useParams } from "react-router";
import { BOARD_ROLE_OPTION, BOARD_FORM } from "../../components/board/upload/BoardOptions";
import { BoardLecture } from "../../components/board/upload/BoardLecture";
import { api } from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";

export function BoardEditPage() {
    const postId = useParams().postId;
    const [formData, setFormData] = useState(BOARD_FORM);
    const navigate = useNavigate();
    const { role } = useAuth();

    useEffect(() => {
        // 여기에 기존 게시글 데이터를 불러오는 로직 추가
        if (!postId) return;
        api.get(`/boards/list/${postId}`).then(res => {
            if (!res) throw new Error(`서버 응답 오류`);
            setFormData(res.data);
        }).catch(err => {
            console.error("데이터 로드 실패: ", err);
            alert("게시글 로드 중 오류가 발생했습니다.");
        });
    }, [postId]);
    if (role === null) {
        console.log("?");
        return <div>Loading...</div>;
    }
    const filteredOptions = BOARD_ROLE_OPTION.filter(opt =>
        opt.roles.includes(role)
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

        api.put(`/boards/update/${postId}`, formData).then(res => {
            if (!res) throw new Error(`서버 응답 오류`);
            console.log(res, res.data);
            alert("수정 성공!");
            navigate(`/board/${postId}`)
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
            {/* 헤더 섹션 */}
            <header className="mb-10 ml-2">
                <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Editor</p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">게시글 수정</h1>
            </header>

            {/* 메인 폼 섹션 */}
            <section className="bg-white border-2 border-black rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="space-y-10">

                    {/* 제목 입력 */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase ml-1 tracking-widest">Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full text-2xl font-bold py-3 px-1 border-b border-black outline-none placeholder:text-black"
                            placeholder="제목을 입력해 주세요"
                        />
                    </div>

                    {/* 옵션 선택 영역 (타입, 고정, 강의선택) */}
                    <div className="flex flex-wrap items-center gap-4 bg-gray-50/50 border border-black p-4 rounded-2xl border border-gray-100/50">
                        <div className="flex items-center">
                            <select
                                name="boardType"
                                value={formData.boardType}
                                onChange={handleChange}
                                className="pl-4 pr-8 py-2 bg-white border border-black rounded-xl text-sm font-bold text-black cursor-pointer appearance-none shadow-sm"
                            >
                                {filteredOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {formData.boardType === "NOTICE" && (
                            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-blue-500 shadow-sm">
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

                        {formData.boardType === "LECTURE_QNA" && (
                            <div className="flex-1 min-w-[200px]">
                                <BoardLecture
                                    selectedId={formData.lectureId}
                                    onSelect={handleLectureSelect}
                                />
                            </div>
                        )}
                    </div>

                    {/* 본문 입력 */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase ml-1 tracking-widest">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full min-h-[500px] p-6 text-[15px] leading-relaxed resize-none outline-none text-black placeholder:text-black bg-gray-50/30 rounded-2xl border border-black"
                            placeholder="내용을 입력하세요..."
                        />
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleSave}
                            className="flex-1 md:flex-none px-10 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                        >
                            수정 완료
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3.5 bg-white text-black text-sm font-bold rounded-xl border border-black hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-all"
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
    )
}
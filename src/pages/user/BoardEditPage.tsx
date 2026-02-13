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
    const {role} = useAuth();

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
    if(role === null) {
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
                        {formData.boardType === "NOTICE" && (
                            <label className="flex items-center gap-2 cursor-pointer bg-yellow-50 px-3 py-1 rounded-md border border-yellow-200 mt-5">
                                <input
                                    type="checkbox"
                                    name="pinned"
                                    checked={formData.pinned}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-yellow-600"
                                />
                                <span className="text-sm font-medium text-yellow-800">이 게시글을 상단에 고정합니다</span>
                            </label>
                        )}
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
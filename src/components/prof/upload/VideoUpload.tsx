import { useState, type ChangeEvent } from "react";
import { api } from "../../../api/axiosInstance";

interface LectureVideoProps {
    lectureId: number;
    onSuccess: () => void;
}

export function VideoUpload({ lectureId, onSuccess }: LectureVideoProps) {
    const [file, setFile] = useState<File | null>(null); // 선택한 파일
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0); // 업로드 퍼센트

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        // 파일이 선택되지 않았거나 취소했을 경우 처리
        if (!selectedFiles || selectedFiles.length === 0) {
            return;
        }

        const singleFile = selectedFiles[0];

        if (!singleFile.type.startsWith("video/")) {
            alert("비디오 파일만 업로드 가능합니다.");
            e.target.value = ""; // input 비우기
            return;
        }

        setFile(singleFile);
        setProgress(0); // 새 파일 선택 시 진행률 초기화
    };
    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData(); // 대용량 데이터 전송을 위한 FormData 개체
        formData.append("file", file); //백엔드와 이름을 맞춤

        setUploading(true);
        try {
            await api.post(`/instructor/lectures/${lectureId}/video/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total || 1; // 0으로 나누기 방지
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                    setProgress(percentCompleted);
                },
            });
            onSuccess();
        } catch (err) {
            console.error("Upload Error:", err);
            alert("업로드 실패: 서버 연결 상태나 파일 용량을 확인하세요.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mt-6 p-6 border-2 border-dashed border-blue-200 rounded-md bg-gray-50">
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold">강의 영상 업로드</h2>

                {/* multiple 속성을 제외하여 브라우저 선택창에서도 하나만 선택되도록 유도 */}
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="w-full text-sm text-gray-500 
                     file:mr-4 file:py-3 file:px-6 
                     file:rounded-md file:border-0 
                     file:text-sm file:font-bold 
                     file:bg-blue-600 file:text-white 
                     hover:file:bg-blue-700 cursor-pointer"
                />

                {file && (
                    <div className="w-full mt-6 bg-white p-4 rounded-md shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-sm font-semibold text-blue-600">
                                선택됨: {file.name}
                            </span>
                            <span className="text-xs text-gray-400">
                                {(file.size / (1024 * 1024)).toFixed(1)}MB
                            </span>
                        </div>

                        {/* 프로그레스 바 */}
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`w-full py-3 rounded-md font-bold text-white transition-colors
                ${uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {uploading ? `업로드 중... ${progress}%` : "이 영상으로 확정하기"}
                        </button>

                        {!uploading && (
                            <p className="text-center text-[12px] text-gray-400 mt-2">
                                * 다른 영상으로 교체하려면 다시 파일을 선택하세요.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
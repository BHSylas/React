import { useState, type ChangeEvent } from "react";
import { api } from "../../../api/axiosInstance";

interface LectureVideoProps {
    lectureId: number;
    onSuccess: () => void;
    isEdit?: boolean;
}

export function VideoUpload({ lectureId, onSuccess, isEdit = false }: LectureVideoProps) {
    const [file, setFile] = useState<File | null>(null); // 선택한 파일
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0); // 업로드 퍼센트
    const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null); // 추출된 썸네일 저장
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); // 썸네일 미리보기

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        // 파일이 선택되지 않았거나 취소했을 경우 처리
        if (!selectedFile || !selectedFile.type.startsWith("video/")) {
            alert("비디오 파일을 선택해주세요.")
            return;
        }

        setFile(selectedFile);
        setProgress(0);

        const videoUrl = URL.createObjectURL(selectedFile); // 임시 URL 생성
        const video = document.createElement("video");
        video.src = videoUrl;

        video.onloadeddata = () => {
            video.currentTime = 1; // 영상 업로드 1초지점으로 이동
        };

        video.onseeked = () => {
            const canvas = document.createElement("canvas"); // 썸네일 캡처를 위한 캔버스 제작
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight; // 가로세로 이미지 맞춤
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    setThumbnailBlob(blob);
                    if (thumbnailPreview) {
                        URL.revokeObjectURL(thumbnailPreview);
                    } // 이전 만들어진 URL있음 삭제
                    setThumbnailPreview(URL.createObjectURL(blob));
                }
                URL.revokeObjectURL(videoUrl); // 비디오 임시 URL 해제
                video.src = ""; // 비디오 소스 비우기
                video.load();   // 비디오 리소스 완전 정리
            }, "image/jpeg", 0.8);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData(); // 대용량 데이터 전송을 위한 FormData 개체
        formData.append("file", file); //백엔드와 이름을 맞춤

        if (thumbnailBlob) {
            const thumbFile = new File([thumbnailBlob], "thumbnail.jpg", { type: "image/jpeg" });
            formData.append("thumbnail", thumbFile);
        }

        setUploading(true);
        try {
            const method = isEdit ? "put" : "post";
            const url = `/instructor/lectures/${lectureId}/video/upload`;
            await api[method](url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total || 1; // 0으로 나누기 방지
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                    setProgress(percentCompleted);
                },
            });
            alert(isEdit ? "영상이 교체되었습니다." : "영상이 업로드되었습니다.");
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
                <h2 className="text-xl font-bold">{isEdit ? "강의 영상 교체 (업로드)" : "강의 영상 업로드"}</h2>

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

                {thumbnailPreview && (
                    <div className="mt-4 flex flex-col items-center">
                        <p className="text-xs text-gray-500 mb-2">자동 생성된 썸네일</p>
                        <img src={thumbnailPreview} alt="Thumbnail" className="w-48 h-27 object-cover rounded border shadow-sm" />
                    </div>
                )}

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
                            {uploading ? `업로드 중... ${progress}%` : isEdit ? "이 영상으로 교체하기" :
                                "이 영상으로 확정하기"}
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
import { useState } from "react";
import { api } from "../../api/axiosInstance";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // 업로드 성공 시 목록을 새로고침하기 위한 함수
}

export default function VideoUploadModal({isOpen, onClose, onSuccess}: VideoUploadModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 보여주지 않음

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) {
      alert("유튜브 링크를 입력해주세요.");
      return;
    }
        if (!keyword.trim) {
      alert("검색할 키워드를 입력해주세요.");
      return;
    }
    
    try {
      setUploading(true);

      await api.post("/videos/admin", {
        youtubeUrl: youtubeUrl,
        keyword: keyword
      });

      alert("동영상이 성공적으로 등록되었습니다!");
      onSuccess(); // 목록 새로고침
      onClose();   // 모달 닫기
      setYoutubeUrl(""); // 입력창 초기화
      setKeyword("");
    } catch (error) {
      console.error("등록 에러:", error);
      alert("등록에 실패했습니다. 올바른 유튜브 주소인지 확인해 주세요.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="max-w-xl modal-box bg-base-100">
        <h3 className="mb-6 text-lg font-bold">관리자: 새 영상 등록</h3>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="form-control">
            <label className="text-sm font-semibold label text-base-content/70">유튜브 링크</label>
            <input 
              type="text" 
              className="w-full input input-bordered" 
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="form-control">
            <label className="text-sm font-semibold label text-base-content/70">키워드</label>
            <input 
              type="text" 
              className="w-full input input-bordered" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="영상과 관련된 키워드를 적어주세요"
            />
          </div>

          <div className="gap-4 modal-action">
            <button type="submit" className="px-3 btn btn-primary btn-outline" disabled={uploading}>
              {uploading ? "등록 중..." : "등록하기"}
            </button>
            <button type="button" className="px-3 btn btn-error btn-outline" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { api } from "../../api/axiosInstance";
import type { VideoResponseDto } from "../../types/VideoResponseDto";

interface VideoEditModalProps {
  isOpen: boolean;
  video: VideoResponseDto;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VideoEditModal({ isOpen, video, onClose, onSuccess }: VideoEditModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 모달이 열릴 때 선택된 비디오의 기존 키워드를 입력창에 셋팅
  useEffect(() => {
    if (isOpen && video) {
      setYoutubeUrl(""); // 링크는 매번 새로 입력받는 것이 안전하므로 비웁니다.
      setKeyword(video.keyword);
    }
  }, [isOpen, video]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 백엔드 컨트롤러의 @PutMapping("/admin/{id}") 호출
    api.put("/videos/admin/" + video.id, {
      youtubeUrl: youtubeUrl,
      keyword: keyword,
    })
      .then(() => {
        alert("동영상이 수정되었습니다.");
        onSuccess();
        onClose();
      })
      .catch((err) => {
        console.error(err);
        alert("수정 실패: " + (err.response?.data || "알 수 없는 오류"));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold text-base-content">동영상 정보 수정</h3>
        
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* 유튜브 링크 입력 (선택 사항) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">새 유튜브 URL (영상 변경 시에만 입력)</span>
            </label>
            <input
              type="text"
              className="w-full input input-bordered"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>

          {/* 키워드 입력 (필수 사항) */}
          <div className="form-control">
            <label className="label">
              <span className="font-semibold label-text">키워드</span>
            </label>
            <input
              type="text"
              className="w-full input input-bordered"
              required
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* 하단 버튼 영역 */}
          <div className="modal-action">
            <button 
              type="submit" 
              className={`px-3 btn btn-primary btn-outline ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              수정 완료
            </button>
            <button 
              type="button" 
              className="px-3 btn btn-error btn-outline" 
              onClick={onClose} 
              disabled={loading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
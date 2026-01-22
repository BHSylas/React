import { useState } from "react";
import { api } from "../../api/axiosInstance";

export default function BoardWriter({playerId, onSuccess} : {playerId : number, onSuccess: any}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
  if (!content.trim()) {
    setMessage("내용을 입력해 주세요.");
    return;
  }
  try {
    setLoading(true);
    setMessage("");
    await api.post(`/boards/players/${playerId}/boards`, {
      title: `${playerId}_comment`,
      content: content,
    });
    setMessage("게시글이 등록되었습니다!");
    setContent("");
    onSuccess();
    //navigate(`/players/${playerId}/boards`);
  } catch (err) {
    console.error(err);
    setMessage("등록 중 오류가 발생했습니다.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="rounded-xl w-full p-4 space-y-6">
      <div className="divider w-full mt-4"></div>
      {message && <div className="alert alert-info mt-4">{message}</div>}
      <div className="form-control">
        <textarea
          className="textarea w-full textarea-bordered resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
        />
      </div>
      {/* SUBMIT */}
      <button
        className="btn btn-primary w-full"
        disabled={loading}
        onClick={submit}
      >
        {loading ? "업로드 중..." : "등록"}
      </button>
    </div>
  );
}

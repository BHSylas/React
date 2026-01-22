import { useState } from "react";
import { api } from "../../api/axiosInstance";

export default function CommentWriter({postId, onSuccess} : {postId : number, onSuccess: any}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
  if (!content.trim()) {
    return;
  }
  try {
    setLoading(true);
    await api.post(`/comments/${postId}`, {
      title: `${postId}_comment`,
      content: content,
      postId: postId,
    });
    setContent("");
    onSuccess();
    //navigate(`/players/${playerId}/boards`);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="rounded-xl w-full p-4 space-y-6">
      <div className="divider w-full mt-4"></div>
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

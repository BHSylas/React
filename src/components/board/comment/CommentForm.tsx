import { useState } from "react";
import { api } from "../../../api/axiosInstance";

export default function CommentForm({ postId, onSubmit }: { postId: string, onSubmit: () => void }) {
  const [content, setContent] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post(`/boards/comments/create/${postId}`, {
      content: content,
    }).then(() => {
      setContent("");
      onSubmit();
    }).catch((err: any) => {
      console.error(err);
    });
  }
  return (
    <form
      className="bg-white border border-black rounded-2xl p-4 md:p-5 space-y-3"
      onSubmit={handleSubmit}
    >
      <textarea
        className="w-full bg-transparent text-sm leading-relaxed placeholder:text-black resize-none outline-none min-h-[80px] px-1"
        rows={3}
        placeholder="댓글을 작성하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <div className="flex justify-between items-center pt-2">
        <span className="text-[10px] font-bold uppercase tracking-tight px-1">
          Press Post to reply
        </span>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white text-[12px] font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
        >
          댓글 작성
        </button>
      </div>
    </form>
  );
}
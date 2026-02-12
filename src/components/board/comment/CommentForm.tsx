import { useState } from "react";
import { api } from "../../../api/axiosInstance";

export default function CommentForm({ postId, onSubmit }: { postId: string, onSubmit: () => void }) {
  const [content, setContent] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(postId, content);
    api.post(`/boards/comments/create/${postId}`, {
      content: content,
    }).then((res) => {
      console.log(res.data);
      setContent("");
      onSubmit();
    }).catch((err : any) => {
      console.error(err);
    });
  }
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <textarea
        className="w-full border rounded-lg p-2 resize-none"
        rows={4}
        placeholder="댓글을 작성하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex justify-end">
        <button
        type="submit"
        className="px-4 py-2 rounded 
        hover:text-blue-800 hover:scale-105 hover:font-bold transition"
      >댓글 작성</button>
      </div>
    </form>
  );
}
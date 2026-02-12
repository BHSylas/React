export function CommentBlock() {
  return (
    <section className="border rounded-lg p-6 text-sm">
      <CommentList />
      <CommentForm />
    </section>
  );
}

function CommentList() {
  return (
    <div className="space-y-4 mb-6">
      {/* 댓글 아이템 예시 */}
      <div className="border-b pb-4">
        <p className="font-semibold">사용자1</p>
        <p className="text-gray-700">이 게시글에 대한 댓글입니다.</p>
      </div>
      <div className="border-b pb-4">
        <p className="font-semibold">사용자2</p>
        <p className="text-gray-700">또 다른 댓글 예시입니다.</p>
      </div>
    </div>
  );
}

function CommentForm() {
  return (
    <form className="space-y-4">
      <textarea
        className="w-full border rounded-lg p-2 resize-none"
        rows={4}
        placeholder="댓글을 작성하세요..."
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
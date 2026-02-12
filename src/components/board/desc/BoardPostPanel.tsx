import type { Board } from "../../../types/Board";

export function BoardPostPanel({post} : {post: Board | undefined}) {
  if(!post) {
    return <div>Loading...</div>;
  }
  if(!post.title || !post.content) {
    return <div>게시글을 불러올 수 없습니다.</div>;
  }
  return (
    <section className="rounded-lg space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{post.title}</h1>
        <div className="text-sm text-gray-500 flex gap-2">
          <span>작성자: {post.writerName || "사용자"}</span>
          {/*<span>{author}</span>
          <span>·</span>
          <span>{category}</span>
          <span>·</span>
          <span>{createdAt}</span>*/}
        </div>
      </div>

      {/* Content */}
      <div className="pt-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
    </section>
  );
}

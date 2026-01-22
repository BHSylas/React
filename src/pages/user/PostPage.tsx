import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import type { Block } from "../../types/Blocks";

export default function PostPage() {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    useEffect(() => {
        api.get(`/posts/${id}`).then(res => {
    setPost(res.data);
  }).finally(() => {
    setLoading(false);
  });
    }, []);
    const sortedBlocks = post?.blocks
  .slice()
  .sort((a : Block, b: Block) => parseInt(a.id) - parseInt(b.id));

  if (loading) {
    return <div>불러오는 중...</div>;
  }

  if (!post) {
    return <div>글을 불러올 수 없습니다.</div>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">
        {post.title}
      </h1>

      <div className="space-y-4">
        {sortedBlocks.map((block : any) => { //TextBlock으로 가정, 추후 확장
          if (block.type === "text") {
            return (
              <p
                key={block.id}
                className="whitespace-pre-wrap leading-relaxed"
              >
                {block.content}
              </p>
            );
          }
          if(block.type === "prediction") {
            return <div>예측 블록 (매치 ID: {block.matchId})</div>;
          }
          // prediction 등은 지금은 무시
          return null;
        })}
      </div>
    </article>
  );
}
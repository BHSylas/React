import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import { type AdminPost, type PageResponse, } from "../../types/Post";
import { useNavigate } from "react-router-dom";
import getName from "../../utils/getName";

export default function AdminPostList() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<AdminPost> | null>(null);
  const [hideDeleted, setHideDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get<PageResponse<AdminPost>>("/posts/admin", {
        params: {
          page,
          size: 10,
        },
      })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  if (!data) {
    return <div className="text-center py-10">데이터가 없습니다.</div>;
  }

  return (
    <div className="w-full bg-base-200 max-w-5xl mx-auto p-4 space-y-4 rounded-xl">
      <div className="flex flex-row">
        <h1 className="mx-2 text-2xl font-bold mb-4 flex flex-1">게시판 관리</h1>
        <button className="btn px-2 font-bold text-xl" onClick={() => setHideDeleted(!hideDeleted)}>
          {hideDeleted ? "삭제글 보기" : "삭제글 숨기기"}
        </button>
      </div>
      <ul className="space-y-2 flex flex-col gap-1">
        {data.content.map((post) => (
          post.deleted && hideDeleted ? null :
          <a className="cursor-pointer" key={post.id} onClick={() => {navigate(`/admin/posts/${post.id}`)}}>
            <li
              key={post.id}
              className="p-4 rounded-xl bg-base-100 hover:bg-base-300 transition"
            >
              <div className="text-lg font-semibold">{post.deleted ? "[삭제됨] : " : ""}{post.title}</div>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>{getName(post.authorName)}</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </li>
          </a>
        ))}
      </ul>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2 pt-4">
        <button
          className="btn btn-sm"
          disabled={data.first}
          onClick={() => setPage((p) => p - 1)}
        >
          ◀ 이전
        </button>

        <span className="px-4 py-1 text-sm">
          {data.number + 1} / {data.totalPages}
        </span>

        <button
          className="btn btn-sm"
          disabled={data.last}
          onClick={() => setPage((p) => p + 1)}
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
}

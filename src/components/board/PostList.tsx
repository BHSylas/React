import { useEffect, useRef, useState } from "react";
import { api } from "../../api/axiosInstance";
import type { BoardDto } from "../../types/BoardDto";
import BoardElement from "./PostElement";

export default function BoardList({
  playerId,
  refresh,
}: {
  playerId: number;
  refresh: number;
}) {
  const [comments, setComments] = useState<BoardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(true);
  // 페이징
  const [page, setPage] = useState(0);
  const size = 10;
  const [lastPage, setLastPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const requestIdRef = useRef(0);

  /** merge 기반 incremental update */
  const mergeComments = (prev: BoardDto[], fetched: BoardDto[]) => {
    // 기존 prev에 없는 fetched만 추가
    const newOnes = fetched.filter(
      (item) => !prev.some((p) => p.id === item.id)
    );
    return [...prev, ...newOnes]; // ASC 기준 append
  };

  /** 서버에서 가져오기 (Page<T> 기반) */
  const loadComments = async (pageNumber: number, isMerging: boolean = false) => {
    try {
      setLoading(true);
      const reqId = ++requestIdRef.current;
      const res = await api.get(
        `/boards/players/${playerId}/boards?page=${pageNumber}&size=${size}&sort=createdAt,asc`
      );
      if (reqId !== requestIdRef.current) {
        return;
      }
      // Page<T> 전제
      const fetched = res.data.content ?? res.data;
      const isLast = res.data.last ?? false;
      setTotalPages(res.data.totalPages ?? 1);
      // 기존 목록에 merge
      if (isMerging) {
        setComments((prev) => mergeComments(prev, fetched));
      } else {
        setComments(fetched);
      }
      setLastPage(isLast);
      return res.data.totalPages ?? 1;
    } catch (err) {
      console.error(err);
      return 1;
    } finally {
      setLoading(false);
    }
  };
   // 첫 로딩: 아직 page=0이지만 서버 totalPages를 모름
  useEffect(() => {
    loadComments(0).then(tp => {
      const last = tp - 1;   // 이제 정확한 totalPages를 사용
      setPage(last >= 0 ? last : 0);
      setInit(false);
      setLoading(false);
    });
  }, []); // 최초 1회만 실행

  /** refresh 시: 기존 목록 유지 + 백그라운드에서 merge */
  useEffect(() => {
   // ASC 구조: refresh 발생 시 최신 댓글이 추가되므로 마지막 페이지로 이동
    if(init) return;
    const last = totalPages - 1;
    setPage(last >= 0 ? last : 0);
    loadComments(last >= 0 ? last : 0, true);
  }, [refresh]);

  // page 변경 시 실제 데이터 로딩
  useEffect(() => {
    if(init) return;
    setLoading(true);
    loadComments(page).then(() => setLoading(false));
  }, [page]);


  if (comments.length === 0 && loading)
    return <div className="p-6">불러오는 중...</div>;
  return (
    <div className="w-full bg-base-200 space-y-4 rounded-xl p-4 relative">

      {/* 현재 댓글 목록 — 깜빡임 없이 지속 유지 */}
      {comments.map((cmt) => (
        <BoardElement key={cmt.id} comment={cmt} interactive={true}/>
      ))}

      {/* 페이징 UI */}
      <div className="flex justify-between items-center pt-4">
        <button
          className={`btn btn-sm px-2 ${page === 0  ? "bg-base-100" : "bg-blue-800"}`}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          {page === 0 ? "◁" : "◀" }
        </button>

        <span className="text-sm opacity-70">페이지 {page + 1}</span>

        <button
          className={`btn btn-sm px-2 ${lastPage ? "bg-base-100" : "bg-blue-800"}`}
          onClick={() => !lastPage && setPage((p) => p + 1)}
          disabled={lastPage}
        >
          {lastPage ? "▷" : "▶"}
        </button>
      </div>

      {/* 로딩 오버레이: 목록 깜빡임 없이 표시 */}
      {loading && (
        <div className="absolute inset-0 bg-base-200/40 backdrop-blur-sm flex justify-center items-center rounded-xl">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}

    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { api } from "../../api/axiosInstance";
import CommentElement from "./CommentElement";
import type { CommentDto } from "../../types/Comment";
import getName from "../../utils/getName";

export default function CommentList({
  postId,
  refresh,
  onReply = null,
}: {
  postId: number;
  refresh: number;
  onReply: (() => void) | null;
}) {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(true);
  // 페이징
  const [page, setPage] = useState(0);
  const size = 100;
  //const [lastPage, setLastPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const requestIdRef = useRef(0);

  /** merge 기반 incremental update */
  const mergeComments = (prev: CommentDto[], fetched: CommentDto[]) => {
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
        `/comments/${postId}?page=${pageNumber}&size=${size}&sort=createdAt,asc`
      );
      if (reqId !== requestIdRef.current) {
        return;
      }
      // Page<T> 전제
      const fetched = res.data.content ?? res.data;
      //const isLast = res.data.last ?? false;
      setTotalPages(res.data.totalPages ?? 1);
      // 기존 목록에 merge
      if (isMerging) {
        setComments((prev) => mergeComments(prev, fetched));
      } else {
        setComments(fetched);
      }
      //setLastPage(isLast);
      return res.data.totalPages ?? 1;
    } catch (err) {
      console.error(err);
      return 1;
    } finally {
      setLoading(false);
    }
  };
  const buildOrderedComments = (list: CommentDto[]) => {
    type Node = CommentDto & {
      replies: Node[];
      depth: number;
    };

    const map = new Map<number, Node>();
    const roots: Node[] = [];

    // 1) 노드 초기화 (depth 기본값 0)
    for (const c of list) {
      map.set(c.id, { ...c, replies: [], depth: 0 });
    }

    // 2) 부모-자식 연결 + depth 전파
    for (const node of map.values()) {
      if (node.parentId != null) {
        const parent = map.get(node.parentId);
        if (parent) {
          node.depth = parent.depth + 1;   // ⭐ 핵심
          parent.replies.push(node);
        } else {
          // 부모가 없으면 root 취급 (depth = 0 유지)
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    // 3) (선택) replies 정렬
    const sortTree = (n: Node) => {
      n.replies.sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      );
      n.replies.forEach(sortTree);
    };
    roots.forEach(sortTree);

    // 4) flatten
    const ordered: (CommentDto & { depth: number })[] = [];
    const dfs = (n: Node) => {
      ordered.push(n);
      n.replies.forEach(dfs);
    };
    roots.forEach(dfs);

    return ordered;
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

  const orderedComments = buildOrderedComments(comments);
  if (comments.length === 0 && loading)
    return <div className="p-6">불러오는 중...</div>;
  return (
    <div className="w-full bg-base-200 space-y-4 rounded-xl p-4 relative">

      {/* 현재 댓글 목록 — 깜빡임 없이 지속 유지 */}
      {orderedComments.length > 0 ? orderedComments.map((cmt) => (
        cmt.parentId != null ?
        <CommentElement 
        key={cmt.id} 
        comment={cmt} 
        depth={cmt.depth}
        interactive={true} 
        parentContent={`${getName(comments.find(c => c.id === cmt.parentId)?.author) || ""} ${comments.find(c => c.id === cmt.parentId)? " | " : ""} ${comments.find(c => c.id === cmt.parentId)?.content || "(삭제된 댓글)"}`} 
        onReplyAct={onReply} />
        :
        <CommentElement 
        key={cmt.id} 
        comment={cmt} 
        depth={cmt.depth}
        interactive={true} 
        parentContent="" 
        onReplyAct={onReply}/>
      )) 
    :
      <div className="p-6 text-center bg-base-100 rounded-xl text-base-content/60">등록된 댓글이 없습니다.</div>
      }

      {/* 페이징 UI */}
      {/*<div className="flex justify-between items-center pt-4">
        <button
          className="btn btn-sm"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          {page === 0 ? "◁" : "◀" }
        </button>

        <span className="text-sm opacity-70">페이지 {page + 1}</span>

        <button
          className="btn btn-sm"
          onClick={() => !lastPage && setPage((p) => p + 1)}
          disabled={lastPage}
        >
          {lastPage ? "▷" : "▶"}
        </button>
      </div>*/}

      {/* 로딩 오버레이: 목록 깜빡임 없이 표시 */}
      {loading && (
        <div className="absolute inset-0 bg-base-200/40 backdrop-blur-sm flex justify-center items-center rounded-xl">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}

    </div>
  );
}

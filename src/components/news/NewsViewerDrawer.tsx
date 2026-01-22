import { useEffect, useRef, useState } from "react";
import type { NewsDto } from "../../types/NewsDto";
import { api } from "../../api/axiosInstance";

interface Props {
  selected: NewsDto | null;
  onClose: () => void;
}

// NewsViewerDrawer.tsx
export default function NewsViewerDrawer({ selected, onClose } : Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const summaryCache = useRef(new Map<string, string>());
  useEffect(() => {
    if (!selected) return;
    setSummary("");
  }, [selected]);
  const fetchSummary = (url : string) => {
    if (!selected) {
      console.log("선택된 뉴스가 없습니다.");
      return;
    }
    if (summaryCache.current.has(url)) {
      setSummary(summaryCache.current.get(url)!);
      return;
    }
    setSummary("요약 중입니다...");
    setLoading(true);
    api.get(`/gemini-summary?url=${encodeURIComponent(url)}`)
      .then((res: any) => {
        summaryCache.current.set(url, res.data);
        setSummary(res.data);
      })
      .catch((err: any) => {
        console.error(err);
        setSummary("요약을 받아오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  if(!selected) return;
  return (
    <div className="drawer drawer-end open fixed inset-0 z-[9999]">
      
      {/* Drawer 토글 역할 */}
      <input id="news-viewer-drawer" type="checkbox" className="drawer-toggle" checked readOnly />

      {/* Drawer가 차지할 높이: 화면 전체 */}
      <div className="drawer-content min-h-screen">
        {/* 화면의 실제 컨텐츠는 없지만, 이 영역이 Drawer 높이를 만들어 줌 */}
      </div>

      <div className="drawer-side">
        <label
          htmlFor="news-viewer-drawer"
          className="drawer-overlay"
          onClick={onClose}
        ></label>

        <div className="bg-base-100 w-[90vw] max-w-xl h-full p-6 shadow-xl overflow-y-auto">
          <h2 className="text-xl font-bold mb-3">{selected?.title}</h2>
          <p className="text-sm opacity-70 mb-4">
            {(selected != null) && new Date(selected.pubDate).toLocaleString()}
          </p>
          {summary && <div className="mt-4">
            <h3 className="font-bold mb-2">AI 요약(원문)</h3>
            {loading ? (
              <p>요약 생성 중...</p>
            ) : (
              <p className="whitespace-pre-line leading-relaxed">
                {summary || "요약 내용이 없습니다."}
              </p>
            )}
          </div>}
          <button
            className="btn w-full my-2 bg-base-200"
            onClick={() => fetchSummary(selected.link)}
          >
            AI 요약 받기
          </button>
          <div className="divider my-4"></div>
          <p className="mb-6 leading-relaxed">
            {selected?.description}
          </p>
          <div className="divider my-4"></div>
          <a
            href={selected?.link}
            className="btn btn-primary w-full"
            target="_blank"
          >
            원문 보기
          </a>
          <button className="btn w-full mt-2 bg-base-200" onClick={onClose}>
            접기
          </button>
        </div>
      </div>
    </div>
  );
}

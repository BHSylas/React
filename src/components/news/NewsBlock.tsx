import { useRef, useState } from "react";
import type { NewsDto } from "../../types/NewsDto";
import { api } from "../../api/axiosInstance";

export default function NewsBlock({news} : {news : NewsDto}) {
  const [expand, setExpand] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const summaryCache = useRef("");
    const fetchSummary = (url : string) => {
      if (!news) {
        console.log("선택된 뉴스가 없습니다.");
        return;
      }
      if(summary !== "") {
        setSummary("");
        return;
      }
      if (summaryCache.current) {
        setSummary(summaryCache.current!);
        return;
      }
      setSummary("요약 중입니다...");
      setLoading(true);
      api.get(`/gemini-summary?url=${encodeURIComponent(url)}`)
        .then((res: any) => {
          summaryCache.current = res.data;
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
    return (
      <div className="card bg-base-100 shadow-lg p-5 border border-base-300 mt-4">
        <div>
          <h1 className="text-2xl font-bold">{news.title}</h1>
          <p className="text-base-content/60 text-sm mt-1">
            {news.pubDate}
          </p>
          {expand === true ? 
          <div>
            <button className="btn btn-primary md:btn-neutral md:hover:btn-primary w-full mt-2 bg-base-200" onClick={() => setExpand(false)}>
              닫기
            </button>
            <div className="divider my-4"></div>
            <p className="mb-6 leading-relaxed">
              {news?.description}
            </p>
            <a
              href={news?.link}
              className="btn btn-primary w-full"
              target="_blank"
            >
              원문 보기
            </a>
            <div className="divider my-4"></div>
            {summary && 
            <div className="mt-4">
              <h3 className="font-bold mb-2">AI 요약(원문)</h3>
              {loading ? (
                <p>요약 생성 중...</p>
              ) : (
                <p className="whitespace-pre-line leading-relaxed">
                  {summary || "요약 내용이 없습니다."}
                </p>
              )}
              <div className="divider my-4"/>
            </div>}
            <button
              className="btn btn-primary md:btn-neutral md:hover:btn-primary w-full my-2 bg-base-200"
              onClick={() => fetchSummary(news.link)}
            >
              {summary === "" ? "AI 요약 받기" : "요약 접기"}
            </button>
          </div>
          : 
          <div className="btn btn-primary md:btn-neutral md:hover:btn-primary w-full mt-2 bg-base-200" onClick={() => setExpand(true)}>더보기</div>}
        </div>
    </div>
  );
}
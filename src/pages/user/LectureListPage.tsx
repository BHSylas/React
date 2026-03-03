import { useEffect, useState, useCallback } from "react";
import ClassBoardSidebar from "../../components/class/list/ClassBoardSidebar";
import ClassList from "../../components/class/list/ClassList";
import { type ClassItem } from "../../types/ClassItem";
import { api } from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// import { ta } from "date-fns/locale";

//import { api } from "../../api/axiosInstance";

/* =========================
  테스트용 더미 데이터
========================= */

const LANGUAGE_MAP: Record<string, string> = {
  "Japan": "jp",
  "USA": "en",
  "Germany": "de",
  "Italy": "it",
  "China": "cn",
};
async function fetchClasses(params: {
  categoryId: string;
  page: number;
  size: number;
}): Promise<{ content: ClassItem[]; totalPages: number; totalElements: number }> {
  // =========================
  // 실제 API 요청 (백엔드 준비 후)
  // =========================
  const response = await api.get(`/lectures?page=${params.page}&size=${params.size}&language=${params.categoryId}`);
  if (response.data.content.length === 0 && params.page === 0) {
    throw new Error("No classes found");
  }
  return {
    content: response.data.content,
    totalPages: response.data.totalPages || 1,
    totalElements: response.data.totalElements || 0
  };
}


export function LectureListPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    const savedLang = sessionStorage.getItem("language");
    if (savedLang && LANGUAGE_MAP[savedLang]) {
      sessionStorage.removeItem("language");
      return LANGUAGE_MAP[savedLang];
    }
    return "ALL";
  });
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);

  const requestClasses = useCallback(
    async (categoryId: string, page: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchClasses({ categoryId, page, size: pageSize });
        setClassList(result.content);
        setTotalPages(result.totalPages);
      } catch (e: unknown) {
        console.error(e);
        setError("강의 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    requestClasses(selectedCategoryId, currentPage);
  }, [selectedCategoryId, currentPage, requestClasses]);

  const handleSelectCategory = (categoryId: string) => {
    if (isLoading) return; // 로딩 중 요청 무시
    setSelectedCategoryId(categoryId);
    setCurrentPage(0); // 카테고리 변경 시 첫 페이지로
  };

  const handlePageChange = (newPage: number) => {
    if (isLoading || newPage < 0 || newPage >= totalPages) return;
    setCurrentPage(newPage);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-10 py-12 px-6">
      {/* 사이드바 영역 */}
      <aside className="w-64 shrink-0">
        <ClassBoardSidebar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 min-w-0 relative">

        {/* 상단 액션바 */}
        <header className="flex justify-between items-end mb-8 px-2">
          <div>
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Explore</p>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">강좌 목록</h1>
          </div>

          {role === '1' && (
            <button
              className="group relative flex items-center gap-2 px-6 py-2.5 
                   bg-blue-600 text-white text-sm font-bold rounded-full
                   hover:bg-blue-700 hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]
                   transition-all duration-300 active:scale-95"
              onClick={() => navigate("/class/new")}
            >
              새 강의 등록
            </button>
          )}
        </header>

        {/* 에러/결과 없음 상태 */}
        {(error || (!isLoading && classList.length === 0)) && (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-sm">
              {error || "조건에 맞는 강의가 아직 없습니다."}
            </p>
          </div>
        )}

        {/* 강의 리스트 */}
        {classList.length > 0 && (
          <div
            className={`transition-all duration-500 ${isLoading ? "opacity-30 blur-[2px] pointer-events-none" : "opacity-100"
              }`}
          >
            <ClassList classList={classList} />
          </div>
        )}

        {/* 페이지네이션 */}
        {!isLoading && !error && classList.length > 0 && totalPages > 1 && (
          <nav className="flex justify-center items-center gap-1.5 mt-16">
            {/* 이전 버튼 그룹 */}
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
              className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 transition-colors"
            >
              <span className="sr-only">First</span>
              «
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 transition-colors mr-2"
            >
              ‹
            </button>

            {/* 페이지 번호 */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i)
                .filter((page) => (
                  page === 0 || page === totalPages - 1 || Math.abs(page - currentPage) <= 2
                ))
                .map((page, index, array) => {
                  const prevPage = array[index - 1];
                  const isCurrent = currentPage === page;

                  return (
                    <div key={page} className="flex items-center gap-1">
                      {prevPage !== undefined && page - prevPage > 1 && (
                        <span className="px-1 text-gray-300 text-xs">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs transition-all ${isCurrent
                            ? "font-bold scale-110"
                            : "text-gray-400 hover:font-bold hover:text-gray-900"
                          }`}
                      >
                        {page + 1}
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* 다음 버튼 그룹 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 transition-colors ml-2"
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 transition-colors"
            >
              »
            </button>
          </nav>
        )}

        {/* 로딩 스피너 (Overlay 지우고 중앙 고정) */}
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}

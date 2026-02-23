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
  "Japan" : "jp",
  "USA" : "en",
  "Germany" : "de",
  "Italy" : "it",
  "China" : "cn",
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
  const {role} = useAuth();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex mx-auto gap-6 py-6">
      {/* Sidebar */}
      <ClassBoardSidebar
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* List 영역 */}
      <div className="flex-1 relative">
        {role === '1' && 
          <div className="w-full flex justify-end mb-4">
            <button className="transition hover:text-blue-800 hover:font-bold hover:scale-105" onClick={() => {navigate("/class/new")}}>+ 새 강의</button>
          </div>
        }
        {/* 에러 */}
        {error && (
          <div className="p-4 text-red-600 font-semibold">
            {error}
          </div>
        )}

        {/* 결과 없음 */}
        {!isLoading && !error && classList.length === 0 && (
          <div className="p-4 text-gray-500">
            조건에 맞는 강의가 없습니다.
          </div>
        )}

        {/* 리스트 */}
        {classList.length > 0 && (
          <div
            className={`transition-opacity ${
              isLoading ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
          >
            <ClassList classList={classList} />
          </div>
        )}

        {/* 페이지네이션 */}
        {!isLoading && !error && classList.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {/* 첫 페이지 */}
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              ««
            </button>
            
            {/* 이전 페이지 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              ‹
            </button>

            {/* 페이지 번호들 */}
            {Array.from({ length: totalPages }, (_, i) => i)
              .filter((page) => {
                // 현재 페이지 주변 2개씩만 표시
                return (
                  page === 0 ||
                  page === totalPages - 1 ||
                  Math.abs(page - currentPage) <= 2
                );
              })
              .map((page, index, array) => {
                // 페이지 간격이 있을 경우 ... 표시
                const prevPage = array[index - 1];
                const showEllipsis = prevPage !== undefined && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-2">
                    {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded border transition ${
                        currentPage === page
                          ? "bg-blue-800 text-white border-blue-500 font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {page + 1}
                    </button>
                  </div>
                );
              })}

            {/* 다음 페이지 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              ›
            </button>

            {/* 마지막 페이지 */}
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              »»
            </button>
          </div>
        )}

        {/* 로딩 오버레이 (선택) */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            로딩 중...
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import ClassBoardSidebar from "../../components/class/list/ClassBoardSidebar";
import ClassList from "../../components/class/list/ClassList";
import { type ClassItem } from "../../types/ClassItem";
import { api } from "../../api/axiosInstance";
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
}): Promise<ClassItem[]> {
  // =========================
  // 실제 API 요청 (백엔드 준비 후)
  // =========================
  const response = await api.get(`/lectures?page=0&size=5&language=${params.categoryId}&enrolling=false`);
  if (response.data.length === 0) {
    throw new Error("No classes found");
  }
  //if(params.categoryId === "ALL") return MOCK_CLASSES;
  //else return MOCK_CLASSES.filter(c => c.categoryId === params.categoryId.toLowerCase());
  return await response.data.content;
}


export function ClassListPage() {
  /* =========================
      상태 정의
  ========================= */

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

  /* =========================
      단일 검색 메서드
  ========================= */

  const requestClasses = useCallback(
  async (categoryId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchClasses({ categoryId });
      setClassList(result);
    } catch (e: any) {
      console.error(e);
      setError("강의 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  },
  []
);


  /* =========================
     최초 진입 / 조건 변경
  ========================= */

  useEffect(() => {
    requestClasses(selectedCategoryId);
  }, [selectedCategoryId, requestClasses]);

  /* =========================
     Sidebar Callback
  ========================= */

  const handleSelectCategory = (categoryId: string) => {
    if (isLoading) return; // 로딩 중 요청 무시
    setSelectedCategoryId(categoryId);
  };

  /* =========================
     렌더링
  ========================= */

  return (
    <div className="flex mx-auto gap-6 py-6">
      {/* Sidebar */}
      <ClassBoardSidebar
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* List 영역 */}
      <div className="flex-1 relative">
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

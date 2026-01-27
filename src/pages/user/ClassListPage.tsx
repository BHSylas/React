import { useEffect, useState, useCallback } from "react";
import ClassBoardSidebar from "../../components/class/list/ClassBoardSidebar";
import ClassList from "../../components/class/list/ClassList";
import { type ClassItem } from "../../types/ClassItem";
import { api } from "../../api/axiosInstance";

/* =========================
  테스트용 더미 데이터
========================= */

const MOCK_CLASSES: ClassItem[] = [
  {
    id: "1",
    title: "너도 할 수 있다! 실전 영어",
    professor: "홍길동",
    level: "초급",
    description: "대중교통에서 쓸 수 있는 영어를 배워봅니다.",
    categoryId: "en",
  },
  {
    id: "2",
    title: "Words for Cafe",
    professor: "James J. Johnson",
    level: "초급",
    description: "This is apple",
    categoryId: "en",
  },
  {
    id: "3",
    title: "日常会話入門",
    professor: "竜田 一郞",
    level: "초급",
    description: "ニンジャ何で？",
    categoryId: "jp",
  },
  {
    id: "4",
    title: "Einführung in die deutsche Sprachwissenschaft",
    professor: "Friedrich Müller",
    level: "초급",
    description: "Schweinhund",
    categoryId: "de",
  },
  {
    id: "5",
    title: "Imparare l'italiano facilmente",
    professor: "Giovanni Rossi",
    level: "초급",
    description: "Mama mia",
    categoryId: "it",
  },
  {
    id: "6",
    title: "基础汉语入门",
    professor: "王伟",
    level: "초급",
    description: "我爱北京天安门。",
    categoryId: "cn",
  },
];

async function fetchClasses(params: {
  categoryId: string;
}): Promise<ClassItem[]> {
  // =========================
  // 실제 API 요청 (백엔드 준비 후)
  // =========================
  console.log(params); //params가 사용되지 않는 문제 방지
  const response = await api.get(
    `/lecture/list`
  );
  if (response.data.length === 0) {
    return MOCK_CLASSES;
  }
  return await response.data;
}


export function ClassListPage() {
  /* =========================
     상태 정의
  ========================= */

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
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
    <div className="flex max-w-7xl mx-auto gap-6 py-6">
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

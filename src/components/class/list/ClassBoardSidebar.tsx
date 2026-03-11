import { useState } from "react";

interface ClassBoardSidebarProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}


interface SidebarCategory {
  id: string;
  title: string;
  children?: SidebarCategory[];
}

const CATEGORIES: SidebarCategory[] = [
  {
    id: "ALL",
    title: "전체 강의",
    children: [
      { id: "en", title: "영어" },
      { id: "jp", title: "일본어" },
      { id: "de", title: "독일어" },
      { id: "it", title: "이탈리아어" },
      { id: "cn", title: "중국어" },
    ],
  },
];

export default function ClassBoardSidebar({
  selectedCategoryId,
  onSelectCategory,
}: ClassBoardSidebarProps) {
  return (
    <aside className="w-60">
      {CATEGORIES.map((cat) => (
        <SidebarNode
          key={cat.id}
          node={cat}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </aside>
  );
}

function SidebarNode({
  node,
  selectedCategoryId,
  onSelectCategory,
}: {
  node: SidebarCategory;
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedCategoryId;

  return (
    <div className="w-full">
      <div
        className={`group flex items-center gap-1 rounded-[12px] px-3 py-2.5 transition-all duration-200 cursor-pointer
          ${
            isSelected
              ? "bg-blue-600 text-white shadow-md shadow-gray-200"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }`}
      >
        {/* 화살표 아이콘: 기호 대신 CSS 기반으로 세련되게 처리 가능하지만, 기호를 쓰신다면 더 작고 연하게 */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
              setIsOpen((prev) => !prev);
            }}
            className={`w-5 h-5 flex items-center justify-center text-[10px] transition-transform duration-300
                       ${isOpen ? "rotate-0" : "-rotate-90"} 
                       ${isSelected ? "text-white/60" : "text-gray-400"}`}
          >
            ▼
          </button>
        ) : (
          <span className="w-5 h-5 flex items-center justify-center">
             <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-blue-400" : "bg-gray-300"}`} />
          </span>
        )}

        {/* 카테고리 선택 버튼 */}
        <button
          type="button"
          onClick={() => onSelectCategory(node.id)}
          className={`flex-1 text-left text-[14px] ${isSelected ? "font-black" : "font-bold"}`}
        >
          {node.title}
        </button>
      </div>

      {/* 하위 카테고리 영역 */}
      {hasChildren && isOpen && (
        <div className="ml-5 mt-1.5 space-y-1 border-l border-gray-100 pl-2">
          {node.children!.map((child) => (
            <SidebarNode
              key={child.id}
              node={child}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

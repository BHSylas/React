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
    id: "all",
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
    <div className="ml-2">
      <div
        className={`flex items-center gap-1 rounded px-2 py-1 transition-all
          ${
            isSelected
              ? "bg-blue-800 text-white"
              : "text-blue-800 hover:bg-blue-50"
          }`}
      >
        {/* ▶ 열림/닫힘 전용 버튼 */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-6 h-6 flex items-center justify-center text-xs
                      opacity-60 hover:opacity-100 rounded"
            aria-label={isOpen ? "카테고리 접기" : "카테고리 펼치기"}
          >
            {isOpen ? "▼" : "▶"}
          </button>
        ) : (
          // 자식 없는 노드는 정렬 맞춤용 placeholder
          <span className="w-6 h-6 inline-block" />
        )}

        {/* 카테고리 선택 버튼 */}
        <button
          type="button"
          onClick={() => onSelectCategory(node.id)}
          className="flex-1 text-left"
        >
          {node.title}
        </button>
      </div>

      {/* children */}
      {hasChildren && isOpen && (
        <div className="ml-4 mt-1 space-y-1">
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

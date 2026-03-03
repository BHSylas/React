// import React, { useState } from "react";

export type CategoryValue = 'NOTICE' | 'FREE' | 'FAQ' | 'QNA' | 'MANUAL';
export type CategoryLabel = | '공지사항' | '자유게시판' | 'FAQ' | 'Q&A' | '매뉴얼';

interface MenuItem {
    label: CategoryLabel;
    value: CategoryValue;
}

const menuItems: MenuItem[] = [
    { label: '공지사항', value: 'NOTICE' },
    { label: '자유게시판', value: 'FREE' },
    { label: 'FAQ', value: 'FAQ' },
    { label: 'Q&A', value: 'QNA' },
    // { label: '강의 Q&A', value: 'LECTURE_QNA' },
    { label: '매뉴얼', value: 'MANUAL' },
];

interface TagManuProps {
    activeTab: CategoryValue;
    onTabChange: (tab: CategoryValue) => void;
}

const TagManu: React.FC<TagManuProps> = ({ activeTab, onTabChange }) => {
    // const [activeTab, setActiveTab] = useState<Category>('공지사항');

    const activeLabel = menuItems.find(item => item.value === activeTab)?.label;

    // const menuItems: Category[] = ['공지사항', '자유게시판', 'FAQ', 'Q&A', '매뉴얼'];

    return (
        <div className="flex flex-col items-center w-full mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">
                {activeLabel}
            </h1>

            <nav className="flex items-center gap-8 border-b border-gray-100 w-full justify-center pb-4">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.value;
                    return (
                        <div
                            key={item.value}
                            onClick={() => onTabChange(item.value)}
                            className={`relative cursor-pointer text-[15px] transition-all duration-200 pb-4
                                ${isActive
                                    ? 'text-blue-600 font-bold'
                                    : 'text-gray-400 font-medium hover:text-gray-600'
                                }`}
                        >
                            {item.label}
                            {isActive && (
                                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default TagManu;
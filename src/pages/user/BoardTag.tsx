// import React, { useState } from "react";

export type CategoryValue = 'NOTICE' | 'FREE' | 'FAQ' | 'QNA' | 'LECTURE_QNA' | 'MANUAL';
export type CategoryLabel = | '공지사항' | '자유게시판' | 'FAQ' | 'Q&A' | '강의 Q&A' | '매뉴얼';

interface MenuItem {
    label: CategoryLabel;
    value: CategoryValue;
}

const menuItems: MenuItem[] = [
    { label: '공지사항', value: 'NOTICE' },
    { label: '자유게시판', value: 'FREE' },
    { label: 'FAQ', value: 'FAQ' },
    { label: 'Q&A', value: 'QNA' },
    { label: '강의 Q&A', value: 'LECTURE_QNA' },
    { label: '매뉴얼', value: 'MANUAL' },
];

interface TagManuProps {
    activeTab : CategoryValue;
    onTabChange: (tab: CategoryValue) => void;
}

const TagManu: React.FC<TagManuProps> = ({ activeTab, onTabChange }) => {
    // const [activeTab, setActiveTab] = useState<Category>('공지사항');

    const activeLabel = menuItems.find(item => item.value === activeTab)?.label;

    // const menuItems: Category[] = ['공지사항', '자유게시판', 'FAQ', 'Q&A', '강의 Q&A', '매뉴얼'];

    return (
        <div className="grid justify-center items-center gap-5 mb-10">
            <h1 className="text-3xl text-blue-800 flex justify-center font-bold">{activeLabel}</h1>

            <nav className="flex gap-3">
                {menuItems.map((item) => (
                    <div key={item.value} onClick={() => onTabChange(item.value)} className={`cursor-pointer text-blue-600 ${activeTab === item.value ? 'font-bold' : 'font-nomal'}`}>{item.label}</div>))}
            </nav>
        </div>
    );
};

export default TagManu;
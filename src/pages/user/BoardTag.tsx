// import React, { useState } from "react";

export type Category = | '공지사항' | '자유게시판' | 'FAQ' | 'Q&A' | '강의 Q&A' |'매뉴얼';

interface TagManuProps {
    activeTab: Category;
    onTabChange: (tab: Category) => void;
}

const TagManu: React.FC<TagManuProps> = ({ activeTab, onTabChange }) => {
    // const [activeTab, setActiveTab] = useState<Category>('공지사항');

    const menuItems: Category[] = ['공지사항', '자유게시판', 'FAQ', 'Q&A', '강의 Q&A', '매뉴얼'];

    return (
        <div className="grid justify-center items-center gap-5 mb-10">
            <h1 className="text-3xl text-blue-800 flex justify-center font-bold">{activeTab}</h1>

            <nav className="flex gap-3">
                {menuItems.map((item) => (
                    <div key={item} onClick={() => onTabChange(item)} className={`cursor-pointer text-blue-600 ${activeTab === item ? 'font-bold' : 'font-nomal'}`}>{item}</div>))}
            </nav>
        </div>
    );
};

export default TagManu;
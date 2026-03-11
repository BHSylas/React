
interface NpcPreviewProps {
    text: string;
}

const NpcPreview = ({ text }: NpcPreviewProps) => {
    return (
        <div className='w-full'>
            <h3 className="text-[11px] font-black text-blue-600 uppercase ml-1 tracking-widest mb-2">NPC Preview</h3>
            <div className="w-full min-h-[100px] p-5 text-[15px] leading-relaxed bg-blue-50/30 border border-blue-100/50 rounded-2xl text-gray-600 italic shadow-inner">
                {text || "NPC의 대사가 이곳에 실시간으로 표시됩니다."}
            </div>
        </div>
    );
};

export default NpcPreview;
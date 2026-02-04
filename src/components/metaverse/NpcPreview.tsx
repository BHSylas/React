
interface NpcPreviewProps {
    text: string;
}

const NpcPreview = ({ text }: NpcPreviewProps) => {
    return (
        <div className='w-full mb-8'>
            <h3 className='text-2xl font-bold mb-5'>시험 미리보기</h3>
            <div className="w-full min-h-[100px] box-border border border-gray-500 rounded-md p-3 resize-none leading-[1.5]">
                {text || "npc의 대사가 이곳으로 출력됩니다."}
            </div>
        </div>
    );
};

export default NpcPreview;
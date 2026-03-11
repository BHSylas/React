
interface UserPreviewProps {
  text: string;
}

const UserPreview = ({ text }: UserPreviewProps) => {
  const parts = text.split(/(\[\s*\])/g);

  return (
    <div className='w-full'>
      <h3 className="text-[11px] font-black text-blue-600 uppercase ml-1 tracking-widest mb-2">User Preview</h3>
      <div className="w-full min-h-[100px] p-5 text-[15px] leading-relaxed bg-blue-50/30 border border-blue-100/50 rounded-2xl text-gray-700 shadow-inner flex flex-wrap items-center gap-1">
        {text ? (
          parts.map((part, index) =>
            /^\[\s*\]$/.test(part) ? (
              <input
                key={index}
                type="text"
                readOnly
                placeholder="정답"
                className="inline-block w-20 px-2 py-1 bg-white border border-blue-200 rounded-lg text-xs text-center text-blue-500 font-bold placeholder:text-blue-200 focus:outline-none"
              />
            ) : (
              <span key={index}>{part}</span>
            )
          )
        ) : (
          <span className="text-gray-400 italic">캐릭터의 질문 문장이 이곳에 표시됩니다.</span>
        )}
      </div>
    </div>
  );
};

export default UserPreview;
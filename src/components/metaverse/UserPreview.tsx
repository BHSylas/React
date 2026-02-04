
interface UserPreviewProps {
    text: string;
}

const UserPreview = ({ text }: UserPreviewProps) => {
  const parts = text.split(/(\[\s*\])/g);

  return (
    <div className='w-full mb-8'>
      <div className="w-full min-h-[100px] box-border border border-gray-500 rounded-md p-3 resize-none leading-[1.5]">
        {text ? (
          parts.map((part, index) => 
            /^\[\s*\]$/.test(part) ? (
              <input 
                key={index}
                type="text" 
                readOnly 
                placeholder="정답 칸"
                className='CharaBlankSpace'
              />
            ) : (
              <span key={index}>{part}</span>
            )
          )
        ) : (
          <span>캐릭터의 대사가 출력됩니다.</span>
        )}
      </div>
    </div>
  );
};

export default UserPreview;
import { type ChangeEvent } from 'react';

interface UserInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  name? :string;
}

const UserInput = ({ value, onChange, name }: UserInputProps) => {
  return (
    <div className="w-full">
      <h3 className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest mb-2">User Question</h3>
      <textarea 
        className="w-full min-h-[150px] p-5 text-[15px] leading-relaxed resize-none outline-none text-gray-700 placeholder:text-gray-200 bg-gray-50/30 rounded-2xl border border-gray-100 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all [field-sizing:content]"
        name={name}
        value={value} 
        onChange={onChange}
        placeholder="사용자가 채워야 할 문장(빈칸은 [ ]로 표시)"
        rows={4}
      />
    </div>
  );
};

export default UserInput;
import { type ChangeEvent } from "react";

interface NpcInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
}

const NpcInput = ({ value, onChange, name }: NpcInputProps) => {
    return (
        <div className="w-full">
            <h3 className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-widest mb-2">NPC Dialogue</h3>
            <textarea 
                className="w-full min-h-[150px] p-5 text-[15px] leading-relaxed resize-none outline-none text-gray-700 placeholder:text-gray-200 bg-gray-50/30 rounded-2xl border border-gray-100 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all [field-sizing:content]"
                name={name}
                value={value}
                onChange={onChange}
                placeholder="NPC가 사용자에게 건넬 대사를 입력하세요..."
            />
        </div>
    );
};

export default NpcInput;

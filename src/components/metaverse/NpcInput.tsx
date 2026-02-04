import { type ChangeEvent } from "react";

interface NpcInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
}

const NpcInput = ({ value, onChange, name }: NpcInputProps) => {
    return (
        <div className="w-full mb-8">
            <h3 className='text-2xl font-bold mb-5'>npc 대사</h3>
            <textarea className="w-full min-h-[150px] box-border border border-black rounded-md p-3 resize-none leading-[1.5] [field-sizing:content]"
            name={name}
            value={value}
            onChange={onChange}
            placeholder="대사를 입력하세요">
            </textarea>
        </div>
    );
};

export default NpcInput;

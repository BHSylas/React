import { type ChangeEvent } from 'react';

interface UserInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  name? :string;
}

const UserInput = ({ value, onChange, name }: UserInputProps) => {
  return (
    <div className="w-full mb-8">
      <h3 className='text-2xl font-bold mb-5'>캐릭터 대사</h3>
      <textarea 
        className="w-full min-h-[100px] box-border border border-black rounded-md p-3 resize-none leading-[1.5] [field-sizing:content]"
        name={name}
        value={value} 
        onChange={onChange}
        placeholder="빈칸은 [ ]로 표시(예: I am a [ ] student.)"
        rows={4}
      />
    </div>
  );
};

export default UserInput;
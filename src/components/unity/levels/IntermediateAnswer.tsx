import { useState } from "react";

export default function IntermediateAnswer({options, onOptionSelect} : {options: string[] | null, onOptionSelect: (option: string) => void}) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const handleOptionToggle = (option: string) => {
        setSelectedOptions((prev: string[]) => {
            if(prev.includes(option)) {
                return prev.filter(o => o !== option);
            }
            else {
                return [...prev, option];
            }
        });
    }
    if(!options) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-lg font-bold">Loading...</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="flex gap-4">
                {options.map((option, index) => (
                    <div key={index} className="relative">
                        <button 
                        className={`px-4 py-2 rounded transition ${selectedOptions.includes(option) ? 'bg-green-600 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`} 
                        onClick={() => handleOptionToggle(option)}>
                            {option}
                        </button>
                        {selectedOptions.includes(option) && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {selectedOptions.indexOf(option) + 1}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            <button className="px-4 py-2 font-bold text-green-800 rounded hover:scale-105 transition" onClick={() => onOptionSelect(selectedOptions.join(" "))}>
                Submit
            </button>
        </div>
    );
}
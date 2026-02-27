export default function BeginnerAnswer({options, onOptionSelect} : {options: string[] | null, onOptionSelect: (option: string) => void}) {
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
                    <button key={index} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={() => onOptionSelect(option)}>
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
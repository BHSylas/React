interface AnswerButtonsProps {
    isEditing: boolean;
    onEditStart: () => void;
    onEditCancel: () => void;
    onEditSubmit: () => void;
    onDelete: () => void;
}

export function AnswerButtons({
    isEditing, onEditStart, onEditCancel, onEditSubmit, onDelete }: AnswerButtonsProps) {
    return (
        <div className="mt-5">
            {isEditing ? (
                <div>
                    <button className="px-3 py-1 text-sm hover:text-red-800 hover:font-bold hover:scale-105 transition-all"
                        onClick={onEditCancel}>
                        취소
                    </button>
                    <button className="px-3 py-1 text-sm hover:text-blue-800 hover:font-bold hover:scale-105 transition-all"
                        onClick={onEditSubmit}>
                        저장
                    </button>
                </div>
            ) : (
                <div>
                    <button className="px-3 py-1 text-sm hover:text-blue-800 hover:font-bold hover:scale-105 transition-all"
                        onClick={onEditStart}>
                        수정
                    </button>
                    <button
                        className="px-3 py-1 text-sm hover:text-red-800 hover:font-bold hover:scale-105 transition-all"
                        onClick={onDelete}>
                        삭제
                    </button>
                </div>
            )}
        </div>
    )
}
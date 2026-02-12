export default function CommentElement( {comment} : {comment: Comment} ) {
    return (
        <div className="flex">
            <div className="flex-1 border-b pb-4">
                <p className="font-semibold">{comment.writerName}</p>
                <p className="text-gray-700">{comment.content}</p>
            </div>
            <div className="flex flex-col justify-start space-y-2 ml-4">
                <button className="transition hover:text-blue-800 hover:font-bold hover:scale-105">수정</button>
                <button className="transition hover:text-red-800 hover:font-bold hover:scale-105">삭제</button>
            </div>
        </div>
        );
}
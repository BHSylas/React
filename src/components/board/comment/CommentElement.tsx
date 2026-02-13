import { useRef, useState } from "react";
import { api } from "../../../api/axiosInstance";

export default function CommentElement( {comment} : {comment: Comment} ) {
    const [edit, setEdit] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [content, setContent] = useState(comment.content);
    const originalContent = useRef(comment.content);
    const handleEdit = () => {
        if(edit){
            setContent(originalContent.current);
        }
        setEdit(!edit);
    }
    const update = () => {
        api.put(`/boards/comments/update/${comment.commentId}`, {
            content: content,
        }).then(() => {
            setEdit(false);
            originalContent.current = content;
        }).catch((err : any) => {
            console.error(err);
            alert("NO");
            setEdit(false);
            setContent(originalContent.current);
        });
    }
    const remove = () => {
        alert("삭제하시겠습니까?");
        api.delete(`/boards/comments/delete/${comment.commentId}`)
        .then((res) => {
            console.log(res.data);
            setDeleted(true);
        }).catch((err : any) => {
            console.error(err);
            alert("NO");
        });
    }
    if(deleted) {
        return null;
    }
    return (
        <div className="flex">
            <div className="flex-1 border-b pb-4">
                {edit ? 
                <div>
                    <textarea
                    className="w-full border rounded-lg p-2 resize-none"
                    rows={2}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={content}
                    >
                        
                    </textarea>
                </div>
                :
                <div>
                    <p className="text-xs font-semibold">{comment.writerName}</p>
                    <p className="text-xl text-gray-700">{content}</p>
                </div>
                }
            </div>
            <div className="">
                {edit ? 
                <div className="flex flex-col space-y-2 ml-4">
                    <button className="transition hover:text-green-800 hover:font-bold hover:scale-105" onClick={update}>저장</button>
                    <button className="transition hover:text-red-800 hover:font-bold hover:scale-105" onClick={handleEdit}>취소</button>
                </div>
                :
                <div className="flex flex-col space-y-2 ml-4">
                    <button className="transition hover:text-blue-800 hover:font-bold hover:scale-105" onClick={handleEdit}>수정</button>
                    <button className="transition hover:text-red-800 hover:font-bold hover:scale-105" onClick={remove}>삭제</button>
                </div>}
            </div>
        </div>
        );
}
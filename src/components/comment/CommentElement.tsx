import { api } from "../../api/axiosInstance";
import type { CommentDto } from "../../types/Comment";
import getName from "../../utils/getName";
import { useState } from "react";
import { textLimiter } from "../../utils/textLimiter";

export default function CommentElement({comment, interactive = true, parentContent = null, onReplyAct = null, depth = 0} : {comment : CommentDto, interactive: boolean, parentContent?: string | null, onReplyAct?: (() => void) | null, depth?: number}) {
  const [hidden, setHidden] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [onReply, setOnReply] = useState(false);
  const [isYourComment, setIsYourComment] = useState<"yes" | "no" | "not yet">("not yet");
  const [content, setContent] = useState(comment);
  const [input, setInput] = useState(comment.content);
  const submit = async () => {
    try {
      await api.put(`/comments/${comment.id}`, {
        content: input,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setOnEdit(false);
      setContent({...content, content: input});//임시방편
    }
  };
  const cancel = () => {
    setOnEdit(false);
    setInput(content.content);
  };
  const submitReply = async () => {
    try {
      await api.post(`/comments/${comment.postId}/${comment.id}`, {
        content: input,
        postId: comment.postId,
        parentId: comment.id,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setOnReply(false);
      if(onReplyAct !== null) {
        onReplyAct();
      }
    }
  };
  const tryEdit = () => {
    if(isYourComment === "no") {
      return;
    }
    // 수정 모드 진입 시 처리할 내용
    if(isYourComment === "not yet") {
      api.get(`/comments/edit/${comment.id}`)
    .then(() => {
      setIsYourComment("yes");
    })
    .catch(err => {
      console.error(err);
      alert("댓글 정보를 불러올 수 없었습니다.");
      setIsYourComment("no");
      setOnEdit(false);
    });
      }
    setOnEdit(true);
    setInput(content.content);
  };
  const remove = () => {
    const c = confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if(!c) return;
    api.delete(`/comments/${comment.id}`)
    .then(() => {
      setHidden(true);
    })
    .catch(err => {
      console.error(err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    });
  }
  const tryReply = () => {
    if(onEdit && input !== content.content) {
      const c = confirm("수정 중인 내용이 저장되지 않습니다. 계속하시겠습니까?");
      if(!c) return;
      setOnEdit(false);
    }
    setOnReply(true);
    setInput("");

  }
  if(hidden) return <div></div>;
  return (
    <div
      className="flex justify-between card bg-base-100 shadow-lg p-4 border border-base-300 mt-4"
      style={{
        marginLeft: `${Math.min(depth * 10, 80)}px`,
      }}
    >
      <div className="flex flex-col md:flex-row" >
        <div className="flex flex-col flex-1">
          {onEdit ? 
            <div className="flex flex-col justify-center">
              <div className="form-control flex-1">
                <textarea
                  className=" text-xl resize-none outline-none w-full min-h-20 max-h-40 overflow-x-hidden leading-relaxed bg-transparent border-base-300"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="내용을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                <button className="btn btn-success p-2" onClick={() => {submit()}}>저장</button>
                <button className="btn btn-warning p-2" onClick={() => {cancel()}}>취소</button>
              </div>
            </div> 
            : 
            <div className="flex flex-col">
              {comment.parentId != null ? <div className="text-xs md:text-lg">{parentContent != null ? getName(parentContent) : ""}</div> : null}
              <h1 className="md:hidden">{comment.parentId != null ? "↳ " : ""} {textLimiter(getName(content.author, "사용자"), 5)} | {content.content}</h1>
              <h1 className="text-xl hidden md:block">{comment.parentId != null ? "↳ re: " : ""} {getName(content.author, "사용자")} | {content.content}</h1>
              <p className="text-base-content/60 text-sm mt-1">{new Date(content.createdAt).toLocaleString()}</p>
            </div>}
            {onReply ? 
              <div className="form-control flex-1">
                <h1 className="mt-2 text-xl font-bold">대댓글:</h1>
                <textarea
                  className=" text-xl resize-none outline-none w-full min-h-20 max-h-40 overflow-x-hidden leading-relaxed bg-transparent border-base-300"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="내용을 입력하세요"
                />
                <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                  <button className="btn btn-success p-2" onClick={() => {submitReply()}}>저장</button>
                  <button className="btn btn-warning p-2" onClick={() => {setOnReply(false); setInput("");}}>취소</button>
                </div>
              </div> 
              :
              null }
        </div>
        {!onEdit && !onReply && interactive === true ? 
        <div className="flex flex-col justify-center">
          <span className="justify-end md:justify-center flex">
            <button className="btn btn-sm btn-success p-2 px-3" onClick={() => {tryReply()}}>↵</button>
            <button className="btn btn-sm btn-primary p-2" onClick={() => {tryEdit()}}>수정</button>
            <button className="btn btn-sm btn-error p-2" onClick={() => {remove()}}>삭제</button>
          </span>
        </div> : <div></div>}
      </div>
    </div>
  );
}
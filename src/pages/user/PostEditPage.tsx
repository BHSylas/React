import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlockPickerPanel from "../../components/post/BlockPickerPanel";
import { createLiveEditorBlock, createPredictionEditorBlock, createTextEditorBlock, createVideoEditorBlock } from "../../utils/createEditorBlock";
import type { AnyEditorBlock } from "../../types/EditorBlocks";
import PredictionCard from "../../components/predictions/PredictionCard";
import { api } from "../../api/axiosInstance";
import YtPlayer from "../../components/Youtube/YtPlayer";
import type { MatchDto } from "../../types/MatchDto";

type ServerBlock =
  | { id: string; type: "text"; content: string }
  | { id: string; type: "prediction"; matchId: number }
  | { id: string; type: "live"; videoId: string }
  | { id: string; type: "video"; videoId: string };


export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<AnyEditorBlock[]>([
    createTextEditorBlock(),
  ]);
  const {id} = useParams();
  const [activeBlockKey, setActiveBlockKey] = useState<string | null>(null);
  const [cursorAtEnd, setCursorAtEnd] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTargetKey, setPickerTargetKey] = useState<string | null>(null);
  const navigate = useNavigate();

  /* 제목 */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  /* text 내용 변경 */
  const updateTextBlock = (key: string, content: string) => {
    setBlocks((prev: AnyEditorBlock[]) =>
      prev.map(b =>
        b.key === key && b.block.type === "text"
          ? { ...b, block: { ...b.block, content } }
          : b
      )
    );
  };

  const returnList = () => {
    if(isPostEmpty()) { //내용이 없으면 그냥 돌아가기
      navigate('/posts');
      return;
    }
    const c = confirm("작성 중인 내용이 사라집니다. 돌아가시겠습니까?");
    if (c) navigate('/posts');
  }
  const isPostEmpty = () => {
    return blocks[0].block.type === "text" // 첫 블록이 텍스트 블록이고(아무 블록도 없을 때 자동 생성됨)
    && blocks[0].block.content.trim() === "" // 그 내용이 비어있고
    && blocks.length === 1; // 텍스트 블록밖에 없을 때
  }
  /* 저장 */
  const handleSubmit = async () => {
    if(title.trim() === "" || title === null) {
      alert("제목을 입력해주세요.");
      return;
    }
    if(blocks.length === 0 || isPostEmpty()) { // 글이 정상적으로 작성된다면 첫 텍스트 블록이 빌 수는 없음
      alert("내용을 입력해주세요.");
      return;
    }
    const payload = {
      title,
      blocks: blocks
        .map(b => b.block)
        .filter(b =>
          !(b.type === "text" && b.content.trim() === "")
        )
        .map((block, index) => {
          if (block.type === "prediction") {
            return {
              id: String(index + 1),
              type: "prediction",
              matchId: block.match?.id,
            };
          }
          if (block.type === "live") {
            return {
              id: String(index + 1),
              type: "live",
              videoId: block.live?.videoId,
            };
          }
          if (block.type === "video") {
            return {
              id: String(index + 1),
              type: "video",
              videoId: block.video?.videoId,
            };
          }
          return {...block, id: String(index + 1)};
        }),
    };
    await api.put(`/posts/${id}`, payload)
    .then(() => {
      alert("글이 성공적으로 수정되었습니다.");
      navigate(`/posts/${id}`);
    });
  };

  const renderBlock = ({ key, block }: AnyEditorBlock) => { //renderBlock이 너무 많이 호출됨, 원인을 찾을 수 있으면 좋으련만
    if(block.type === "prediction" && block.match !== null && block.match !== undefined) {
      return (
      <div key={key} className="relative">
        <PredictionCard match={block.match} interactive={false} />
        <div className="flex justify-end mt-2">
          <button className="btn btn-error py-2 px-3 text-xl font-bold mr-2" onClick={() => {removeBlock(key)}}>x</button>
        </div>
      </div>
    );}
    if(block.type === "live" && block.live !== null) {
      return (
      <div key={key} className="relative">
          <div className="">
            <YtPlayer videoId={block.live.videoId} auto={true} />
            <div className="flex justify-end mt-2">
              <button className="btn btn-error py-2 px-3 text-xl font-bold mr-2" onClick={() => {removeBlock(key)}}>x</button>
            </div>
          </div>
        </div>
    );}
    if(block.type === "video" && block.video !== null) {
      return (
      <div key={key} className="relative">
          <div className="">
            <YtPlayer videoId={block.video.videoId} auto={false} />
            <div className="flex justify-end mt-2">
              <button className="btn btn-error py-2 px-3 text-xl font-bold mr-2" onClick={() => {removeBlock(key)}}>x</button>
            </div>
          </div>
        </div>
    );}
    if(block.type === "text") {
      return (
      <div key={key} className="relative flex flex-col mt-2">
        <textarea
          className="resize-none outline-none overflow-hidden h-auto leading-relaxed bg-transparent border-base-300 pr-12 pl-2"
          value={block.type === "text" ? block.content : ""}
          onChange={e => {
            updateTextBlock(key, e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onFocus={e => {
            setActiveBlockKey(key);
            setCursorAtEnd(
              e.currentTarget.selectionStart === e.currentTarget.value.length
            );
          }}
          onClick={e => {
            setCursorAtEnd(
              e.currentTarget.selectionStart === e.currentTarget.value.length
            );
          }}
          onKeyUp={e => {
            setCursorAtEnd(
              e.currentTarget.selectionStart === e.currentTarget.value.length
            );
          }}
        />

        {activeBlockKey === key && cursorAtEnd && (
          <button
            className="
              absolute right-2 p-2 px-3 text-xl
              font-bold btn btn-success bg-base-300
            "
            onClick={() => {
              setPickerTargetKey(key);
              setPickerOpen(true);
            }}
          >
            +
          </button>
        )}
      </div>
    );}
    return (<div key={key} className="relative">
        <div>알 수 없는 블록</div>
        <div className="flex justify-end mt-2">
          <button className="btn btn-error py-2 px-3 text-xl font-bold mr-2" onClick={() => {removeBlock(key)}}>x</button>
        </div>
      </div>);
  };
  const insertBlockAfter = ( targetKey: string, newBlock: AnyEditorBlock ) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.key === targetKey);
      if (idx === -1) return prev;

      const blocksToInsert: AnyEditorBlock[] = [newBlock];

      // 비-text 블록이면 뒤에 text 블록 자동 추가
      if (newBlock.block.type !== "text") {
        blocksToInsert.push(createTextEditorBlock());
      }

      return [
        ...prev.slice(0, idx + 1),
        ...blocksToInsert,
        ...prev.slice(idx + 1),
      ];
    });
  };
  const removeBlock = (targetKey: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.key === targetKey);
      if (idx === -1) return prev;

      const next = [...prev];

      // 대상 블록 제거
      next.splice(idx, 1);

      // non-text 블록 제거 시, 바로 뒤 text 블록도 함께 제거
      if (
        idx < next.length &&
        next[idx]?.block.type === "text"
      ) {
        next.splice(idx, 1);
      }

      // blocks가 완전히 비면 text 블록 하나 보장
      if (next.length === 0) {
        next.push(createTextEditorBlock());
      }

      return next;
    });
  };
  const reset = () => {
    if(isPostEmpty()) return; //이미 비어있음
    const c = confirm("내용이 전부 사라집니다. 초기화하시겠습니까?");
    if(!c) return; //취소됨
    setTitle("");
    setBlocks([createTextEditorBlock()]);
  };

  const initEditorBlocksFromServer = (
    serverBlocks: ServerBlock[],
    matches: MatchDto[],
  ): AnyEditorBlock[] => {
    const result: AnyEditorBlock[] = [];
    serverBlocks
      .slice()
      .sort((a, b) => parseInt(a.id) - parseInt(b.id))
      .forEach(block => {
        if (block.type === "text") {
          result.push(createTextEditorBlock(block.content));
          return;
        }
        if (block.type === "prediction") {
          result.push(
            createPredictionEditorBlock(matches.find(m => m.id === block.matchId)!)
          );
          result.push(createTextEditorBlock());
          return;
        }
        if (block.type === "live") {
          result.push(
            createLiveEditorBlock({ 
                title: "",
                videoId: block.videoId,
                channelId: "",
                channelName: "",
              })
          );
          result.push(createTextEditorBlock());
          return;
        }
        if (block.type === "video") {
          result.push(
            createVideoEditorBlock({ 
              id: 0,
              title: "",
              videoId: block.videoId,
              thumbnailUrl: "",
              keyword: "",
            })
          );
          result.push(createTextEditorBlock());
          return;
        }
      });
    return result;
  };

  useEffect(() => {
    // 초기화 시 서버에서 블록 불러오기 (수정 페이지용)
    if (!id) return;
    api.get(`/posts/${id}/edit`).then(res => {
      api.get("/predictions/matches").then(res2 => {
        const predictionMatches = res2.data;
        const serverBlocks: ServerBlock[] = res.data.blocks;
        const editorBlocks = initEditorBlocksFromServer(serverBlocks, predictionMatches);
        setBlocks(editorBlocks);
      });
      setTitle(res.data.title);
    }).catch(() => {
      alert("글을 수정할 수 없습니다.");
      navigate(`/posts/${id}`); //뷰 페이지로 이동
    });
  }, []);


  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 min-h-[calc(100vh-200px)] bg-base-200 rounded-xl">
      <div className="flex flex-col min-h-[calc(100vh-200px)]">
        <div className="flex flex-col flex-1">
          <div className="flex">
            <h1 className="mx-2 text-2xl font-bold mb-4 flex flex-1">글 수정</h1> 
            <button className="btn btn-primary p-2 bg-base-100" onClick={() => {returnList()}}>← 목록으로</button>
          </div>
          <div className="mb-4"></div>
          {/* 제목 */}
          <div className="p-2 rounded-xl border border-white/10 flex flex-col flex-1">
            <input
              className="w-full mt-2 text-2xl pl-2 font-semibold outline-none bg-transparent"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={handleTitleChange}
            />
            <div className="divider my-4"></div>
          {/* 블록들 */}
            <div className="flex flex-1 flex-col max-h-[calc(100vh-300px)] overflow-y-auto">
              {blocks.map(renderBlock)}
            </div>

            <BlockPickerPanel
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
              onSelect={(type: string, item: any) => {
                if (!pickerTargetKey) return;
                let newBlock: AnyEditorBlock;
                // 지금은 임시 로그
                // 이후 단계:
                if(type === "prediction") newBlock = createPredictionEditorBlock(item);
                else if(type === "live") newBlock = createLiveEditorBlock(item);
                else if(type === "video") newBlock = createVideoEditorBlock(item);
                else newBlock = createTextEditorBlock(); // 일단 기본값
                insertBlockAfter(pickerTargetKey, newBlock);
              
                setPickerOpen(false);
              }}
            />

          </div>
          <div className="divider my-4"></div>
          <div className="flex mt-2 justify-around">
            {/* 제출 */}
            <button
              onClick={reset}
              className="btn btn-error px-6 py-2 rounded-lg text-white"
            >
              초기화
            </button>
            <div className="flex-1"></div>
            <button
              onClick={handleSubmit}
              className="btn btn-primary px-6 py-2 rounded-lg text-white"
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import worldimg from "/worldMap.png";
// import LoremIpsum from "../../components/dev/Lipsum";
import { useState, useEffect } from "react";
import WorldMap from "../../components/home/WorldMap";
import { useNavigate } from "react-router";
import { BoardListBlock } from "../../components/board/list/BoardListBlock";
import type { Board } from "../../types/Board";
import ClassList from "../../components/class/list/ClassList";
import type { ClassItem } from "../../types/ClassItem";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [freeBoards, setFreeBoards] = useState<Board[]>([]);
  const [newClasses, setNewClasses] = useState<ClassItem[]>([]);

  // 자유게시판 가져오는 useEffect
  useEffect(() => {
    const fetchFreeBoards = async () => {
      try {
        const response = await axios.get('/api/boards/searchBoard?size=1000', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        //content 안에 게시판 글 목록 보기
        const boardData = response.data.content || [];
        // 필터 적용(FREE(자유게시판)) 후 잘라서 5개만 보이기
        const filtered = boardData.filter((board: Board) => board.boardType === "FREE")
          .slice(0, 5);
        setFreeBoards(filtered);
      } catch (error) {
        console.log("게시판 데이터를 가져오는데 실패", error);
      }
    };
    fetchFreeBoards();
  }, []);

  // 최신 강좌 가져오는 useEffect
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('/api/lectures', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // 위와 동일하나 필터 없이 3개만
        const classData = res.data.content || [];
        setNewClasses(classData.slice(0, 3));
      } catch (err) {
        console.log("강의 로딩 실패", err);
      }
    };
    fetchClasses();
  }, []);


  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-900">
      <header className="flex flex-col md:flex-row justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-8 mb-10 overflow-hidden relative">
        <div className="z-10 text-center md:text-left">
          <p className="text-blue-600 font-bold text-xs tracking-tighter uppercase mb-1">Learning Metaverse System</p>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">LMS</h1>
        </div>
        <div className="z-10 mt-4 md:mt-0 hidden md:block text-right">
          <p className="text-sm font-medium text-slate-600">오늘도 즐거운 학습 되세요!</p>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        <section>
          <div className="mb-5 px-2">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              Learning World
            </h3>
            <p className="text-sm text-slate-500 mt-1">세계지도 안에서 내가 원하는 국가를 선택해 그 강의를 확인할 수 있어요.</p>
          </div>
          <div className="shadow-sm">
            <WorldMap />
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-6 px-2">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                New Arrivals
              </h3>
              <p className="text-sm text-slate-500 mt-1">최신 강의를 미리 볼 수 있어요.</p>
            </div>
            <button
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => navigate('/class')}
            >
              전체 보기 &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-blue-600 rounded-2xl p-7 text-white flex flex-col justify-between shadow-lg shadow-blue-100 relative overflow-hidden">
              <h4 className="text-lg font-bold leading-tight z-10">따끈따끈<br />바로 올라온<br />최신 강의</h4>
              <div className="text-4xl opacity-20 font-black z-10 self-end">NEW</div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
            </div>
            <div className="md:col-span-3">
              {newClasses.length > 0 ? (
                <ClassList classList={newClasses} viewType="card" />
              ) : (
                <div className="flex items-center justify-center h-48 border border-dashed border-slate-200 rounded-2xl text-slate-400 bg-slate-50/30">
                  표시할 강의가 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-6 px-2">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Community
              </h3>
              <p className="text-sm text-slate-500 mt-1">다양한 학습자와 소통해보세요.</p>
            </div>
            <button
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => navigate('/board')}
            >
              더 보기 &rarr;
            </button>
          </div>

          <div className="bg-white shadow-[0_10px_40px_rgb(0,0,0,0.03)] overflow-hidden">
            {freeBoards.length > 0 ? (
              <div className="p-0">
                <BoardListBlock boards={freeBoards} />
              </div>
            ) : (
              <div className="py-24 text-center text-slate-300 font-medium">
                작성된 게시글이 없습니다.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
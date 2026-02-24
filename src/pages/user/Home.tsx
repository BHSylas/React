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
        const response = await axios.get('/api/boards/searchBoard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        //content 안에 게시판 글 목록 보기
        const boardData = response.data.content || [];
        // 필터 적용(FREE(자유게시판)) 후 잘라서 5개만 보이기
        const filtered = boardData.filter((board: Board) => board.boardType === "FREE")
          .slice(0, 5);
        setFreeBoards(filtered)
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
    <div className="p-7 rounded-xl">
      <header className="text-center">
        <h1 className="text-7xl text-blue-800 font-bold m-10">LMS</h1>
        <p>프로토타입 페이지</p>
        <p className="cursor-pointer" onClick={() => { navigate("/unity-test") }}>🕹메타버스 한시적 넘겨주기...</p>
      </header>
      <div className="divider" />
      <div className='mainboard'>
        <section>
          < WorldMap />
        </section>
        <section className='flex flex-col gap-5 mt-5'>
          {/* <h3 className="text-lg font-bold pl-2">추천 강좌</h3>
          <div className="flex justify-start text-start align-center">
            <div className='bg-cyan-200 rounded-xl pt-4'>
              <div className="py-5 pl-4 pr-36 flex flex-col gap-1">
                <h3 className="text-lg font-bold">모두에게 추천받는 <br />인기 강좌 신청하기</h3>
                <button className="bg-sky-800 rounded-xl font-bold text-slate-100 px-8 py-2 my-2 hover:shadow">전체 보기</button>
              </div>
            </div>
            <div className='topPickClassList'>
              <div> */}
          {/*Placeholder of list*/}
          {/* </div>
            </div>
          </div> */}
          <h3 className="text-lg font-bold pl-2 mt-3">최신 강좌</h3>
          <div className="flex justify-start text-start items-stretch">
            <div className='grid bg-cyan-100 w-[300px] h-[270px] h-auto rounded-xl items-end mr-6'>
              <div className="py-5 px-4 flex flex-col gap-1">
                <h3 className="text-lg font-bold pb-3">따끈따끈 새 강좌 <br />가장 먼저 신청하기</h3>
                <button className="bg-blue-800 rounded-xl font-bold text-slate-100 px-8 py-2 my-2 hover:shadow self-end"
                  onClick={() => navigate('/class')}>전체 보기</button>
              </div>
            </div>
            <div className='flex-grow'>
              {newClasses.length > 0 ? (
                <ClassList classList={newClasses} viewType="card" />
              ) : (
                <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                  등록된 최신 강좌가 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center mt-10 mb-2 px-2">
            <h3 className="text-lg font-bold">자유게시판</h3>
            <button
              className="text-sm text-gray-500 hover:text-blue-600 font-medium"
              onClick={() => navigate('/board')}>더보기 +
            </button>
          </div>
          {/* 구분선 */}
          <div className="divider bg-blue-950 h-0.5 rounded-xl mb-0" />
          <div className="mx-2">
            {freeBoards.length > 0 ? (
              <BoardListBlock boards={freeBoards} />
            ) : (
              <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-b-xl">
                최신 게시글이 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

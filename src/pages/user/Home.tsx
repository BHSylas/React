// import worldimg from "/worldMap.png";
import WorldMapComponent from "./WorldMap";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="p-7 rounded-xl">
      <header className="text-center">
        <h1 className="text-7xl text-blue-800 font-bold m-10">LMS</h1>
        <p>프로토타입 페이지</p>
        <p className="cursor-pointer" onClick={() => {navigate("/unity-test")}}>🕹메타버스 한시적 넘겨주기...</p>
      </header>
      <div className="divider"/>
      <div className='mainboard'>
          <section>
                  < WorldMap />
          </section>
          <section className='flex flex-col gap-5 mt-5'>
              <h3 className="text-lg font-bold pl-2">추천 강좌</h3>
              <div className="flex justify-start text-start align-center">
                  <div className='bg-cyan-200 rounded-xl pt-4'>
                    <div className="py-5 pl-4 pr-36 flex flex-col gap-1">
                      <h3 className="text-lg font-bold">모두에게 추천받는 <br/>인기 강좌 신청하기</h3>
                      <button className="bg-sky-800 rounded-xl font-bold text-slate-100 px-8 py-2 my-2 hover:shadow">전체 보기</button>
                    </div>
                  </div>
                  <div className='topPickClassList'>
                      <div>
                        {/*Placeholder of list*/}
                      </div>
                  </div>
              </div>
              <h3 className="text-lg font-bold pl-2">최신 강좌</h3>
              <div className="flex justify-start text-start align-center">
                  <div className='bg-cyan-100 rounded-xl pt-4'>
                    <div className="py-5 pl-4 pr-36 flex flex-col gap-1">
                      <h3 className="text-lg font-bold">따끈따끈 새 강좌 <br/>가장 먼저 신청하기</h3>
                      <button className="bg-sky-800 rounded-xl font-bold text-slate-100 px-8 py-2 my-2 hover:shadow">전체 보기</button>
                    </div>
                  </div>
                  <div className='topPickClassList'>
                      <div>
                        {/*Placeholder of list*/}
                      </div>
                  </div>
              </div>
          </section>
          <section>
              <h3 className="text-lg font-bold mt-5 pl-2">커뮤니티</h3>
              <div className="divider bg-blue-950 h-0.5 rounded-xl" />
              <div className="p-3 mx-2">
                <p>목록 없음</p>
                  {/*Placeholder of list*/}
              </div>
          </section>
      </div>
    </div>
  );
}

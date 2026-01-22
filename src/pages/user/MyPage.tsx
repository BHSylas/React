import { api } from "../../api/axiosInstance";
import { useEffect, useState } from "react";
import type { UserDto } from "../../types/UserDto";
import getName from "../../utils/getName";
import type { PredictDto } from "../../types/PredictDto";
import type { BoardDto } from "../../types/BoardDto";
import MyPrediction from "../../components/my/MyPrediction";
import MyBoard from "../../components/my/MyBoard";
import MyPost from "../../components/my/MyPost";
import Galaxy from "../../../public/galaxy.jpg";
import type { PostSummary } from "../../types/Post";
import { useAuth } from "../../hooks/useAuth";

export default function MyPage() {
    const {logout} = useAuth();
    const [user, setUser] = useState<UserDto | null>(null);
    const [myPre, setMyPre] = useState<PredictDto[] | null>(null);
    const [myBrd, setMyBrd] = useState<BoardDto[] | null>(null);
    const [myPost, setMyPost] = useState<PostSummary[] | null>(null);
    const [openRmb, setOpenRmb] = useState(false);
    const [openPre, setOpenPre] = useState(false);
    const [openBrd, setOpenBrd] = useState(false);
    const [openPost, setOpenPost] = useState(false);
    const [loading, setLoading] = useState(true);
    const handleProvider = (provider: string ) => {
        if(user?.admin === true && user?.username === 'admin') return "관리자";
        switch(provider){
            case "GOOGLE":
                return "Google 유저";
                break;
            case "KAKAO":
                return "Kakao 유저";
                break;
            case "NAVER":
                return "Naver 유저";
                break;
            case "LOCAL":
                return "일반 유저";
                break;
            default:
                return "?";
                break;
        }
    }
  const bye = () => {
    if(!openRmb) {
      alert("회원님의 확실한 탈퇴 의사를 확인하기 위하여 유저명(굵은 글씨)를 누른 후 다시 시도해주세요.");
      return;
    }
    if(!confirm("정말 탈퇴하시겠습니까? 재가입 시에는 기존의 정보가 모두 사라집니다.")) return;
    api.get("/user/checkToken").then(() => {
      api.delete("/user/my/deleteAccount").then(() => {
        alert("탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
        logout();
      }).catch((err: any) => {
        alert("탈퇴 중 오류가 발생했습니다.");
        console.error(err);
      })
    }).catch((err:any) => {
      alert("인증 정보 확인 중 오류가 발생했습니다.");
      console.error(err);
    });
  }
  useEffect(() => {
    api.get("user/my")
    .then((res) => {
      setUser(res.data);
    })
    .catch((e: any) => {console.error(e);});
    api.get("predictions/my")
    .then((res => {
      setMyPre(res.data);
    }))
    .catch((e: any) => console.error(e));
    api.get("posts/my")
    .then((res => {
      setMyPost(res.data);
    }))
    .catch((e: any) => console.error(e));
    api.get("boards/my")
    .then((res => {
      setMyBrd(res.data);
    }))
    .catch((e: any) => console.error(e))
    .finally(() =>{
      setLoading(false);
    });
  }, []);
  // Should require this many?

  if (loading) {
    return <div className="p-6">불러오는 중...</div>;
  }
  if(user === null || myPre === null || myBrd === null) {
    return <div>올바르지 않은 정보</div>;
  }
  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-4 lg:p-6">
          <header>
            <div className="bg-base-200 rounded-xl shadow h-max-10 flex flex-col items-center text-center">
              <div className="w-full overflow-hidden rounded-t-xl">
                <div className="h-64">
                  <img className="w-full h-full object-cover object-center" src={Galaxy} alt="프로필 이미지"/>
                </div>
              </div>
              <div className="pb-8">
                <button className={user.admin === true ? "text-3xl md:text-6xl font-bold text-blue-600 m-4" : "text-3xl md:text-6xl font-bold m-4"} onClick={() => {setOpenRmb(true)}}>{getName(user.email, user.username)}</button>
                <p className="text-lg md:text-xl">{handleProvider(user.provider)}</p>
                <p className="text-xs">{user.email !== null ? user.email : "이메일 없음"}</p>
                <div><button className={`btn ${openRmb ? "btn-error" : "btn-ghost"} m-2 p-2`} onClick={bye}>회원 탈퇴</button></div>
              </div>
            </div>
          </header>
          <section id="my-predictions">
            <div className="rounded-xl text-2xl font-bold bg-base-200 p-4 mt-1">
              <div className="flex">
                <div className="flex-1">내 승부예측</div>
                <div className="btn btn-lg text-2xl mb-2" onClick={() => setOpenPre(!openPre)}>{openPre === true ? "접기" : "펼치기"}</div>
              </div>
              {(openPre) ? (myPre.length !== 0 ? myPre.map(predict => <MyPrediction key={predict.id} predict={predict}/>) : <div className="text-center">예측한 매치가 없습니다.</div>) : <div className="text-center">...</div>}
            </div>
          </section>
          <section id="my-posts">
            <div className="rounded-xl text-2xl font-bold bg-base-200 p-4 mt-1">
              <div className="flex">
                <div className="flex-1">내 게시글</div>
                <div className="btn btn-lg text-2xl mb-2" onClick={() => setOpenPost(!openPost)}>{openPost === true ? "접기" : "펼치기"}</div>
              </div>
              {(openPost) ? (myPost?.length !== 0 ? myPost?.map(predict => <MyPost key={predict.id} post={predict}/>) : <div className="text-center">내 게시글이 없습니다.</div>) : <div className="text-center">...</div>}
            </div>
          </section>
          <section id="my-boards">
            <div className="rounded-xl text-2xl font-bold bg-base-200 p-4 mt-1">
              <div className="flex">
                <div className="flex-1">내 응원 글</div>
                <div className="btn btn-lg text-2xl mb-2" onClick={() => setOpenBrd(!openBrd)}>{openBrd === true ? "접기" : "펼치기"}</div>
              </div>
              {(openBrd) ? (myBrd.length !== 0 ? myBrd.map(predict => <MyBoard key={predict.id} post={predict}/>) : <div className="text-center">내 응원 글이 없습니다.</div>) : <div className="text-center">...</div>}
            </div>
          </section>
    </main>
  );
}

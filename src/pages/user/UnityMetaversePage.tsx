import { useEffect, useRef, useState } from "react";
import { UnityCanvas } from "../../components/unity/UnityCanvas";
import TestModal from "../../components/unity/TestModal";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "../../types/conversation";
import { api } from "../../api/axiosInstance";
import { decompileCountryCode } from "../../utils/decompileCountryCode";

export default function UnityMetaversePage() {
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const currentId = useRef<number | null>(null);
  const country = (() => {
    const validCountries = ["GR", "US", "JP", "IT", "CN"];
    const storedCountry = sessionStorage.getItem("country");
    if (storedCountry && validCountries.includes(storedCountry)) {
      console.log("Country loaded from sessionStorage:", storedCountry);
      //sessionStorage.removeItem("country");
      return storedCountry;
    }
    return "US";
  })();
  const modalRef = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    // @ts-expect-error : onUnityTick added to window
    window.onAirportLoadedFromUnity = () => {
      //초기 로드 완료 시에 country 정보 Unity에 전달 (Unity에서 국가별 대화 데이터 로드 위해)
      //Airport는 deprecated이나 메서드 명칭을 수정할 경우 프론트-유니티 간 약속된 통신 규약이 깨지므로 일단 유지
      // 향후 리팩토링이 필요하다면 그 시점에 메서드 명칭 변경 고려
      console.log("Airport loaded from Unity");
      // @ts-expect-error : unityInstance added to window
      window.unityInstance?.SendMessage("GameObject", "SetCountryFromWeb", country);
    }
    // @ts-expect-error : onUnityTick added to window
    window.onSceneLoadedFromUnity = () => { 
      //씬 로드 시점에 대화 데이터 서버에서 불러오기
      //불러온 데이터를 Unity에 주입하는 것으로 country 선택 → 데이터 로드 → 대화 시작의 흐름 완성
      console.log("Country selected from Unity:", country);
      api.get(`/user/npc/list?country=${decompileCountryCode(country)}`).then((res) => {
        setConversations(res.data);
        console.log("Conversations loaded from server:", res.data);
        // @ts-expect-error: unityInstance added to window
        window.unityInstance?.SendMessage("GameObject", "InjectDialogsJson", JSON.stringify(res.data as ConversationUnity[]));
      }).catch((err) => {
        console.error("Failed to load conversations from server:", err);
      });
    };
    // @ts-expect-error : onQuestionShownFromUnity added to window
    window.onQuestionShownFromUnity = (conversationId: number) => {
      //Unity에서 문제풀이 개시 신호 수신 시 modal 오픈, 현재 대화 ID 저장
      console.log("Question shown from Unity, conversationId:", conversationId);
      currentId.current = conversationId;
      if (modalRef.current) return;
      modalRef.current = true;
      setModalOpened(true);
    };
    return () => {
      // @ts-expect-error : onUnityTick added to window
      window.onCountrySelectedFromUnity = undefined;
      // @ts-expect-error : onUnityTick added to window
      window.onAirportLoadedFromUnity = undefined;
      // @ts-expect-error : onQuestionShownFromUnity added to window
      window.onQuestionShownFromUnity = undefined;
    };
  }, [country]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-center text-3xl font-bold">{country}</div>
        <div className="text-3xl font-bold cursor-pointer ml-4 rounded-xl border border-gray-300 px-6" onClick={() => {setModalOpened(false); navigate("/");}}>←</div>
      </div>
      <UnityCanvas />
      {modalOpened && (
        <TestModal currentConversation={conversations.find(c => c.conversationId === currentId.current)!} onClose={() => {
          setModalOpened(false);
          modalRef.current = false;
        }} />
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { UnityCanvas } from "../../components/unity/UnityCanvas";
import TestModal from "../../components/unity/TestModal";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "../../types/conversation";
import { api } from "../../api/axiosInstance";

export default function UnityTestPage() {
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const modalRef = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    // @ts-expect-error : onUnityTick added to window
    window.onCountrySelectedFromUnity = (country: string) => {
      alert(`Unity에서 선택된 국가: ${country}`);
      api.get(`/user/npc/list`).then(res => {
        setConversations(res.data);
      })
      .catch(err => {
        console.error("대화 데이터 불러오기 실패", err);
      });
      // @ts-expect-error : unityInstance added to window
      window.unityInstance?.SendMessage("GameManager", "OnCountrySelected", country);
      // Should inject conversations to Unity here, but for testing, just open modal.
      // Filter conversations by selected country and send to Unity.
      /*const filtered = conversations.filter(c => c.place === country);
      window.unityInstance?.SendMessage("GameManager", "ReceiveConversations", JSON.stringify(filtered));*/
      // Well this wouldn't work since country is like US / GR, but server stores like USA / GERMANY.
      // I guess it is better to have a util function like CountryCodeToName here so that I can actually filter conversations and test the whole flow.
      // Moreover, the server doesn't actually have an endpoint such as /user/npc/list, so I need to request the backend team to implement one or change the flow a bit.
      // Modal opening below would be removed after all, so better not to mention it for now. Why would?
      /*if (!modalRef.current) {
        modalRef.current = true;
        setModalOpened(true);
      }*/
    };
    return () => {
      // @ts-expect-error : onUnityTick added to window
      window.onCountrySelectedFromUnity = undefined;
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-center text-3xl font-bold"></div>
        <div className="text-3xl font-bold cursor-pointer ml-4 rounded-xl border border-gray-300 px-6" onClick={() => {setModalOpened(false); navigate("/");}}>←</div>
      </div>
      <UnityCanvas />
      {modalOpened && (
        <TestModal onClose={() => {
          setModalOpened(false);
          modalRef.current = false;
        }} />
      )}
    </div>
  );
}

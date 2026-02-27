import { useEffect, useRef, useState } from "react";
import { UnityCanvas } from "../../components/unity/UnityCanvas";
import TestModal from "../../components/unity/TestModal";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "../../types/conversation";
import { api } from "../../api/axiosInstance";
import { decompileCountryCode } from "../../utils/decompileCountryCode";
import { useAuth } from "../../hooks/useAuth";

/**
 * Unity WebGL과 React 간 통신을 위한 Window 인터페이스 확장
 * Unity 빌드가 window 객체에 자동으로 추가하는 프로퍼티와 메서드 정의
 */
declare global {
  interface Window {
    /** Unity WebGL 빌드가 생성하는 인스턴스 객체 */
    unityInstance?: {
      /** Unity GameObject의 C# 메서드를 호출하는 함수 */
      SendMessage: (objectName: string, methodName: string, value: string | number) => void;
    };
    /** Unity가 초기 씬 로딩 완료 시 호출하는 콜백 */
    onAirportLoadedFromUnity?: () => void;
    /** Unity가 국가별 씬 로딩 완료 시 호출하는 콜백 */
    onSceneLoadedFromUnity?: () => void;
    /** Unity가 문제풀이 모달 요청 시 호출하는 콜백 */
    onQuestionShownFromUnity?: (conversationId: number | string) => void;
  }
}

/** Unity로 전달하는 대화 데이터 타입 (Conversation과 동일하거나 확장) */
type ConversationUnity = Conversation;

export default function UnityMetaversePage() {
  const { isLoggedIn, role } = useAuth();
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
  const navigate = useNavigate();
  
  /**
   * 문제풀이 모달 열기 핸들러
   * 
   * [Unity 연계]
   * - "InputBinder" 게임 오브젝트의 "NeverMove" 메서드 호출
   * - Unity 측에서 플레이어 입력(WASD, 마우스 등)을 비활성화해야 함
   * 
   * [Unity C# 로직]
   * public class InputBinder : MonoBehaviour {
   *   public void NeverMove() { // SendMessage는 항상 1개의 파라미터 필요, 빈 문자열 전달
   *     playerController.enabled = false;
   *   }
   * }
   */
  const onModalOpened = () => {
    if(modalOpened) return;
    window.unityInstance?.SendMessage(
      "InputBinder",  // Unity의 플레이어 입력 관리 오브젝트
      "NeverMove",    // 이동 비활성화 메서드
      ""              // SendMessage는 반드시 3번째 인자 필요 (사용 안 해도 빈 문자열 전달)
    );
    console.log("Modal opened, sent NeverMove to Unity");
    setModalOpened(true);
  }
  
  /**
   * 문제풀이 모달 닫기 핸들러
   * 
   * [Unity 연계]
   * - "InputBinder"의 "Moving" 메서드 호출하여 플레이어 입력 재활성화
   * - 플레이어가 다시 Unity 월드에서 자유롭게 이동 가능
   */
  const onModalClosed = () => {
    if(!modalOpened) return;
    window.unityInstance?.SendMessage(
      "InputBinder", 
      "Moving",  // 이동 재활성화 메서드
      ""
    );
    setModalOpened(false);
  }

  useEffect(() => {
    /**
     * Unity → React 통신: 초기 로딩 완료 콜백
     * 
     * [호출 시점]
     * - Unity WebGL 빌드가 완전히 로드되고 메인 씬이 준비되었을 때
     * - Unity 측 스크립트에서 Application.ExternalCall("onAirportLoadedFromUnity") 실행 시
     * 
     * [동작]
     * - React에서 선택된 국가 코드를 Unity로 전달
     * - Unity의 "GameObject" 객체의 "SetCountryFromWeb" 메서드 호출
     * 
     * [Unity C# 로직]
     * - GameObject.SetCountryFromWeb(string countryCode) 메서드 존재
     * - 해당 국가의 3D 에셋 로드 또는 씬 초기화 수행
     * 
     * [참고]
     * - "Airport"는 deprecated 명칭이나 Unity와의 통신 규약 유지를 위해 함수명 보존
     * - 향후 양측 협의 하에 리팩토링 시 변경 가능
     */
    window.onAirportLoadedFromUnity = () => {
      console.log("Airport loaded from Unity");
      window.unityInstance?.SendMessage(
        "GameObject",           // Unity 씬의 게임 오브젝트 이름
        "SetCountryFromWeb",    // 호출할 C# 메서드명
        country                 // 전달할 국가 코드 (예: "US", "JP", "GR", "IT", "CN")
      );
    }
    
    /**
     * Unity → React 통신: 국가별 씬 로딩 완료 콜백
     * 
     * [호출 시점]
     * - 사용자가 Unity 내에서 특정 국가를 선택하고 해당 씬이 로드된 직후
     * - Unity의 SceneManager.sceneLoaded 이벤트 또는 커스텀 로직에서 호출
     * 
     * [동작 플로우]
     * 1. 백엔드 API로부터 해당 국가의 NPC 대화 데이터 fetch
     * 2. JSON 형태로 직렬화하여 Unity로 주입
     * 3. Unity는 이 데이터를 파싱하여 NPC별 대화 트리 구성
     * 
     * [데이터 플로우]
     * React (country 선택) 
     *   → Unity (씬 로드) 
     *   → React (API 호출) 
     *   → Unity (대화 데이터 주입)
     * 
     * [Unity C# 로직]
     * public void InjectDialogsJson(string json) {
     *   var dialogs = JsonUtility.FromJson<DialogList>(json);
     *   // NPC별 대화 데이터 초기화
     * }
     * 
     * [주의사항]
     * - Unity의 JsonUtility는 루트 배열을 직접 파싱하지 못할 수 있음 (래퍼 객체 필요 가능성)
     */
    window.onSceneLoadedFromUnity = () => { 
      console.log("Country selected from Unity:", country);
      
      // 국가 코드를 한글 이름으로 변환하여 API 요청 (예: "US" → "미국")
      api.get(`/user/npc/list?country=${decompileCountryCode(country)}`).then((res) => {
        setConversations(res.data);
        console.log("Conversations loaded from server:", res.data);
        
        window.unityInstance?.SendMessage(
          "GameObject", 
          "InjectDialogsJson", 
          JSON.stringify(res.data as ConversationUnity[])
        );
      }).catch((err) => {
        console.error("Failed to load conversations from server:", err);
      });
    };
    
    /**
     * Unity → React 통신: 문제풀이 모달 열기 요청
     * 
     * [호출 시점]
     * - 플레이어가 Unity 내에서 NPC와 상호작용하여 퀴즈/문제 단계에 진입
     * - Unity의 InteractionController.OnQuizStart(int id) 등에서 호출
     * 
     * [매개변수]
     * @param conversationId - 현재 진행 중인 대화의 고유 ID (서버 DB의 PK)
     * 
     * [동작]
     * 1. 전달받은 conversationId를 ref에 저장
     * 2. 플레이어 이동 제한 (Unity 측 입력 비활성화)
     * 3. React 모달 오픈하여 문제 UI 표시
     * 4. 모달에서 정답 제출 후 Unity로 결과 전달 (TestModal 컴포넌트에서 처리)
     * 
     * [주의사항]
     * - conversationId가 number로 전달되지만 Unity에서 문자열로 변환될 수 있음
     * - modalOpened 상태가 이미 true면 중복 호출 방지
     */
    window.onQuestionShownFromUnity = (conversationId: number | string) => {
      console.log("Question shown from Unity, conversationId:", conversationId);
      currentId.current = typeof conversationId === 'string' ? parseInt(conversationId, 10) : conversationId;
      
      if (modalOpened) return; // 중복 모달 방지
      onModalOpened();
    };
    /**
     * [Cleanup]
     * 컴포넌트 언마운트 또는 의존성 변경 시 window 전역 함수 정리
     * 메모리 누수 방지 및 다른 컴포넌트와의 충돌 방지
     */
    return () => {
      window.onAirportLoadedFromUnity = undefined;
      window.onSceneLoadedFromUnity = undefined;
      window.onQuestionShownFromUnity = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]); // modalOpened와 onModalOpened는 의도적으로 제외 (재등록 방지)
  
  if(role === "1") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <p className="text-xl">교수는 접근할 수 없습니다.</p>
        <button className="btn p-4 " onClick={() => navigate("/")}>홈으로 돌아가기</button>
      </div>
    );
  }

  if(!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <p className="text-xl">로그인 전 로딩 금지</p>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between">
        <div className="text-center text-3xl font-bold">{country}</div>
        <div className="text-3xl font-bold cursor-pointer ml-4 rounded-xl border border-gray-300 px-6" onClick={() => {setModalOpened(false); navigate("/");}}>←</div>
      </div>
      <UnityCanvas />
      {modalOpened && (
        <TestModal 
        currentConversation={conversations.find(c => c.conversationId === currentId.current)!} 
        onClose={() => {
          onModalClosed();
        }} />
      )}
    </div>
  );
}

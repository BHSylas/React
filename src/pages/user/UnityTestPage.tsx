import { useEffect, useRef, useState } from "react";
import { UnityCanvas } from "../../components/unity/UnityCanvas";
import TestModal from "../../components/unity/TestModal";
import { useNavigate } from "react-router-dom";

export default function UnityTestPage() {
  const [tick, setTick] = useState<number>(0);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const modalRef = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    // @ts-expect-error : onUnityTick added to window
    window.onUnityTick = (value: number) => {
      setTick(value);
      if (value % 180 <= 2 && !modalRef.current) {
        modalRef.current = true;
        setModalOpened(true);
      }
    };
    return () => {
      // @ts-expect-error : onUnityTick added to window
      window.onUnityTick = undefined;
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-center text-3xl font-bold">{tick}</div>
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

import { useEffect, useRef, useState } from "react";
import { UnityCanvas } from "../../components/unity/UnityCanvas";
import TestModal from "../../components/unity/TestModal";

export default function UnityTestPage() {
  const [tick, setTick] = useState<number>(0);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const modalRef = useRef(false);
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
      <div className="text-center text-3xl font-bold">{tick}</div>
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

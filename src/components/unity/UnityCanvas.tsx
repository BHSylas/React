import { useEffect, useRef } from "react";

export function UnityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // React StrictMode(dev)에서 effect가 2번 실행될 수 있어 가드
    if (startedRef.current) return;
    startedRef.current = true;

    const script = document.createElement("script");
    script.src = "/unity/Build/Builds.loader.js";
    script.async = true;

    script.onload = () => {
      // @ts-expect-error : createUnityInstance added by Unity loader script
      window.createUnityInstance(
        canvasRef.current,
        {
          dataUrl: "/unity/Build/Builds.data.br",
          frameworkUrl: "/unity/Build/Builds.framework.js.br",
          codeUrl: "/unity/Build/Builds.wasm.br",
          streamingAssetsUrl: "/unity/StreamingAssets",
        },
        (progress: number) => console.log("Unity loading:", progress)
      ).then((instance: never) => {
        // @ts-expect-error : unityInstance added to window
        window.unityInstance = instance;
      });
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <canvas
      id="unity-canvas"
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

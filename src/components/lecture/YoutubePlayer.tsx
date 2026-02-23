import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { clamp } from "../../utils/time";
import type { PlayerHandle, PlayerSnapshot } from "../../types/player";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type Props = {
  videoId: string;
  startAtSec: number;
};

const JUMP_THRESHOLD = 1.2;

const YoutubePlayer = forwardRef<PlayerHandle, Props>(
  ({ videoId, startAtSec }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<any>(null);

    const lastTimeRef = useRef(startAtSec);
    const maxWatchedRef = useRef(startAtSec);

    const [currentSec, setCurrentSec] = useState(startAtSec);
    const [maxWatchedSec, setMaxWatchedSec] = useState(startAtSec);
    const [durationSec, setDurationSec] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // IFrame API 로드
    useEffect(() => {
      let cancelled = false;

      const load = async () => {
        await loadYouTubeIframeAPI();
        if (cancelled) return;

        if (!containerRef.current) return;

        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            start: Math.floor(startAtSec),
          },
          events: {
            onReady: () => {
              const d = playerRef.current?.getDuration?.();
              if (Number.isFinite(d) && d > 0) {
                setDurationSec(d);
              }

              playerRef.current?.seekTo(startAtSec, true);

              lastTimeRef.current = startAtSec;
              maxWatchedRef.current = startAtSec;
            },
            onStateChange: (e: any) => {
              const YT = window.YT;
              if (!YT) return;

              if (e.data === YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else {
                setIsPlaying(false);
              }
            },
          },
        });
      };

      void load();

      return () => {
        cancelled = true;
        try {
          playerRef.current?.destroy?.();
        } catch(err: any) {
          console.warn("YT Player destroy error:", err);
        }
      };
    }, [videoId, startAtSec]);

    // 시간 업데이트 (interval 기반)
    useEffect(() => {
      const id = window.setInterval(() => {
        const p = playerRef.current;
        if (!p?.getCurrentTime) return;

        const t = p.getCurrentTime();
        const d = p.getDuration?.();

        if (Number.isFinite(d) && d > 0) {
          setDurationSec(d);
        }

        const diff = t - lastTimeRef.current;

        if (diff > JUMP_THRESHOLD) {
          if (t > maxWatchedRef.current) {
            p.seekTo(maxWatchedRef.current, true);
            return;
          }
        }

        lastTimeRef.current = t;
        setCurrentSec(t);

        if (t > maxWatchedRef.current) {
          maxWatchedRef.current = t;
          setMaxWatchedSec(t);
        }

        const rate = p.getPlaybackRate?.();
        if (Number.isFinite(rate)) {
          setPlaybackRate(rate);
        }
      }, 500);

      return () => window.clearInterval(id);
    }, []);

    // imperative API
    useImperativeHandle(ref, () => ({
      play() {
        playerRef.current?.playVideo?.();
      },
      pause() {
        playerRef.current?.pauseVideo?.();
      },
      seekTo(sec: number) {
        const p = playerRef.current;
        if (!p) return;

        const allowed = Math.min(maxWatchedRef.current, durationSec);
        const next = clamp(sec, 0, allowed);

        p.seekTo(next, true);
        lastTimeRef.current = next;
      },
      setRate(rate: number) {
        playerRef.current?.setPlaybackRate?.(rate);
        setPlaybackRate(rate);
      },
      getSnapshot(): PlayerSnapshot {
        return {
          currentSec,
          maxWatchedSec,
          durationSec,
          isPlaying,
          playbackRate,
        };
      },
    }));

    return (
      <div className="w-full rounded-2xl bg-black shadow">
        <div ref={containerRef} className="aspect-video w-full" />
      </div>
    );
  }
);

export default YoutubePlayer;

/* --------------------- */

function loadYouTubeIframeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[data-yt-iframe-api="1"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.dataset.ytIframeApi = "1";

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    document.head.appendChild(tag);
  });
}

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { clamp } from "../../utils/time";
import type { PlayerHandle, PlayerSnapshot } from "../../types/player";

type Props = {
  src: string;
  startAtSec: number;
};

const JUMP_THRESHOLD = 1.2;

const LocalVideoPlayer = forwardRef<PlayerHandle, Props>(
  ({ src, startAtSec }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const lastTimeRef = useRef(startAtSec);

    const maxWatchedRef = useRef(startAtSec);

    const [currentSec, setCurrentSec] = useState(startAtSec);
    const [maxWatchedSec, setMaxWatchedSec] = useState(startAtSec);
    const [durationSec, setDurationSec] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // 메타데이터 로딩
    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;

      const onLoaded = () => {
        const d = v.duration;
        if (Number.isFinite(d)) setDurationSec(d);

        v.currentTime = clamp(startAtSec, 0, d);
        lastTimeRef.current = startAtSec;
        maxWatchedRef.current = startAtSec;
      };

      v.addEventListener("loadedmetadata", onLoaded);
      return () => v.removeEventListener("loadedmetadata", onLoaded);
    }, [startAtSec]);

    // 시간 업데이트
    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;

      const onTime = () => {
        const t = v.currentTime;
        const diff = t - lastTimeRef.current;

        if (diff > JUMP_THRESHOLD) {
          if (t > maxWatchedRef.current) {
            v.currentTime = maxWatchedRef.current;
            return;
          }
        }

        lastTimeRef.current = t;
        setCurrentSec(t);

        if (t > maxWatchedRef.current) {
          maxWatchedRef.current = t;
          setMaxWatchedSec(t);
        }
      };

      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onRate = () => setPlaybackRate(v.playbackRate);

      v.addEventListener("timeupdate", onTime);
      v.addEventListener("play", onPlay);
      v.addEventListener("pause", onPause);
      v.addEventListener("ratechange", onRate);

      return () => {
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("play", onPlay);
        v.removeEventListener("pause", onPause);
        v.removeEventListener("ratechange", onRate);
      };
    }, []);

    // imperative API
    useImperativeHandle(ref, () => ({
      play() {
        videoRef.current?.play();
      },
      pause() {
        videoRef.current?.pause();
      },
      seekTo(sec: number) {
        const v = videoRef.current;
        if (!v) return;

        const allowed = Math.min(maxWatchedRef.current, durationSec);
        const next = clamp(sec, 0, allowed);

        v.currentTime = next;
        lastTimeRef.current = next;
      },
      setRate(rate: number) {
        if (videoRef.current) {
          videoRef.current.playbackRate = rate;
        }
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
        <video
          ref={videoRef}
          src={src}
          className="aspect-video w-full"
          controls={false}
          playsInline
        />
      </div>
    );
  }
);

export default LocalVideoPlayer;

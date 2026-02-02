import { useState } from "react";
import worldImg from '/worldMap.png';
import markerIcon from '../../assets/location_pin.svg';

interface MarkerData {
  id: string;
  name: string;
  description: string;
  top: string;
  left: string;
  scale: number;
}

export default function WorldMapComponent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [zoomStyle, setZoomStyle] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

  const markers: MarkerData[] = [
    {
      id: "japan",
      name: "일본",
      description:
        "한국과 가까운 섬나라입니다.\n한자와 독자적인 언어를 섞은 일본어를 사용합니다.",
      top: "41%",
      left: "42.5%",
      scale: 3,
    },
    {
      id: "usa",
      name: "미국",
      description:
        "북아메리카 대륙의 거대한 연방 국가입니다.\n세계 공통어인 영어를 사용합니다.",
      top: "40%",
      left: "75%",
      scale: 2.5,
    },
  ];

  const activeMarker = markers.find((m) => m.id === selectedId);

  const handleZoom = (marker: MarkerData) => {
    if (selectedId === marker.id) {
      setSelectedId(null);
      setZoomStyle({ x: 0, y: 0, scale: 1 });
    } else {
      setSelectedId(marker.id);

      const mX = parseFloat(marker.left);
      const mY = parseFloat(marker.top);

      const moveX = (50 - mX) * marker.scale;
      const moveY = (50 - mY) * marker.scale;

      setZoomStyle({
        x: moveX,
        y: moveY,
        scale: marker.scale,
      });
    }
  };

  return (
    <div className="relative h-auto flex justify-center text-center bg-[#d2f7ff] rounded-xl my-5 py-5 overflow-hidden">
      {/* Overlay */}
      <div
        onClick={() => {
          setSelectedId(null);
          setZoomStyle({ x: 0, y: 0, scale: 1 });
        }}
        className={`absolute inset-0 z-10
          bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.5)_80%)]
          transition-opacity duration-700
          ${selectedId ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />


      {/* Description */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 text-white font-bold z-20
          text-2xl transition-all duration-500 delay-300
          ${selectedId ? "opacity-100 top-[25%]" : "opacity-0 top-[20%]"}`}
        style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}
      >
        {activeMarker && (
          <div>
            <h2 className="mb-2 text-4xl">{activeMarker.name}</h2>
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#f1f2f6]">
              {activeMarker.description}
            </p>

            <div className="flex justify-center gap-2 mt-[220px]">
              <button className="h-10 px-5 rounded bg-blue-900 text-sm font-medium text-white hover:bg-blue-950 transition">
                강의 확인하기
              </button>
              <button className="h-10 px-5 rounded bg-blue-900 text-sm font-medium text-white hover:bg-blue-950 transition">
                실전회화 연습하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div
        className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] z-[1]"
        style={{
          transformOrigin: "center",
          transform: `translate(${zoomStyle.x}%, ${zoomStyle.y}%) scale(${zoomStyle.scale})`,
        }}
      >
        <img
          src={worldImg}
          alt="world"
          className="w-full h-full object-contain block"
        />

        {markers.map((marker) => {
          const isVisible =
            selectedId === null || selectedId === marker.id;

          return (
            <div
              key={marker.id}
              onClick={() => handleZoom(marker)}
              className={`absolute cursor-pointer z-20
                -translate-x-1/2 -translate-y-1/2
                ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              style={{ top: marker.top, left: marker.left }}
            >
              <img src={markerIcon} alt="marker" className="w-6" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
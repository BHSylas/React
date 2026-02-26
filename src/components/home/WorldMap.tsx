import { useState } from 'react';
import worldImg from '/worldMap.png';
import markerIcon from '/location_pin.svg';
import { useNavigate } from 'react-router-dom';
import { compileCountryCode } from '../../utils/decompileCountryCode';


interface MarkerData {
    id: string;
    name: string;
    description: string;
    top: string;
    left: string;
    scale: number;
    langKey: string;
    courseUrl: string;
    practiceUrl: string;
}

export default function WorldMap() {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [zoomStyle, setZoomStyle] = useState({
        x: 0, y: 0,
        scale: 1
    });

    const markers: MarkerData[] = [
        { id: 'japan', name: "일본", description: "한국과 가까운 섬나라입니다. \n한자와 독자적인 언어를 섞은 일본어를 사용합니다.", top: '41.3%', left: '42.8%', scale: 3, langKey: 'Japan', courseUrl: '/class', practiceUrl: '' },
        { id: 'usa', name: "미국", description: "북아메리카 대륙의 거대한 연방 국가입니다. \n세계 공통어인 영어를 사용합니다.", top: '39%', left: '75%', scale: 2.5, langKey: 'USA', courseUrl: '/class', practiceUrl: '' },
        { id: 'china', name: "중국", description: "동아시아에 위치한 사회주의 공화국입니다. \n한자를 중심으로 사용하며 중문이라고 부르기도 합니다.", top: '44%', left: '33%', scale: 2.5, langKey: 'China', courseUrl: '/class', practiceUrl: '' },
        { id: 'germany', name: "독일", description: "유럽 중부의 위치한 산업, 과학과 기술분야의 강대국입니다. \n영어 다음으로 많이 사용되는 독일어를 사용합니다.", top: '31%', left: '7.5%', scale: 2.5, langKey: 'Germany', courseUrl: '/class', practiceUrl: '' },
        { id: 'italy', name: "이탈리아", description: "남유럽 지중해 중앙에 있는 반도국가입니다. \n 로망스어군의 언어중 하나인 이탈리아어를 사용합니다.", top: '37.4%', left: '8.3%', scale: 2.5, langKey: 'Italy', courseUrl: '/class', practiceUrl: '' },
    ];

    const activeMaker = markers.find(m => m.id === selectedId);

    // 클릭 시 확대 함수
    const handleZoom = (marker: MarkerData) => {
        if (selectedId === marker.id) {
            setSelectedId(null);
            setZoomStyle({ x: 0, y: 0, scale: 1 });
        } else {
            setSelectedId(marker.id);
            const mX = parseFloat(marker.left); // 단위를 숫자로 변경
            const mY = parseFloat(marker.top);

            const moveX = (50 - mX) * marker.scale;
            const moveY = (50 - mY) * marker.scale; // 확대한 곳을 중앙으로 두기 위한 계산

            setZoomStyle({
                x: moveX,
                y: moveY,
                scale: marker.scale
            });
        }
    };

    const handleCourseClick = (marker: MarkerData) => {
        sessionStorage.setItem("language", marker.langKey);
        navigate(marker.courseUrl);
    }

    const handlePracticeClick = (marker: MarkerData) => {
        sessionStorage.setItem("country", compileCountryCode(marker.id));
        navigate("/unity");
    }

    const btnStyle = "w-auto px-5 h-10 rounded-md bg-[#004d80] hover:bg-[#00324e] text-sm text-white font-medium transition-colors";

    return (
        <div className='relative flex justify-center align-center overflow-hidden text-center bg-[#d2f7ff] rounded-xl p-3 mb-3"'>
            <div
              onClick={() => {
                setSelectedId(null);
                setZoomStyle({ x: 0, y: 0, scale: 1 });
              }}
              className={`absolute inset-0 z-[5]
                bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.5)_80%)]
                transition-opacity duration-700
                ${selectedId ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold z-[20] 
                drop-shadow-[2px_2px_10px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out delay-300 ${selectedId ? 'top-[25%] opacity-100' :
                    'top-[20%] opacity-0'}`}>

                {activeMaker && (
                    <div className="descriptionBox">
                        <h2 className="mb-[10px] text-[36px] text-white">{activeMaker.name}</h2>
                        <p className="break-keep overflow-wrap-anywhere whitespace-pre-wrap m-0 text-xl leading-[1.5] text-[#f1f2f6]">{activeMaker.description}</p>
                        <div className="flex justify-center items-center mx-auto translate-y-[220px] gap-[10px]">
                            <button className={btnStyle} onClick={() => handleCourseClick(activeMaker)}>강의 확인하기</button>
                            <button className={btnStyle} onClick={() => {handlePracticeClick(activeMaker)}}>실전회화 연습하기</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full h-full z-[1] relative transition-transform duration-[700ms] ease[cubic-bezier(0.4,0,0.2,1)]" style={{ transformOrigin: 'center', transform: `translate(${zoomStyle.x}%, ${zoomStyle.y}%) scale(${zoomStyle.scale})` }}>
                <img src={worldImg} alt="worldImg" className="w-full h-full object-contain block"></img>
                {markers.map((marker) => {
                    const isVisible = selectedId === null || selectedId === marker.id;

                    return (
                        <div key={marker.id} className={`absolute w-6 h-auto cursor-pointer z-[5] -translate-x-1/2 -translate-y-1/2
                        transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            style={{ top: marker.top, left: marker.left, }}
                            onClick={() => handleZoom(marker)}><img src={markerIcon} alt="marker" className="w-[24px]" /></div>
                    );
                })}
            </div>
        </div>
    );
};
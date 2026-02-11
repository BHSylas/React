import { useState } from "react";

export default function MyPage() {
    const [rgb, setRgb] = useState<[number, number, number]>([0, 0, 0]);
    if(rgb[0] === 0 && rgb[1] === 0 && rgb[2] === 0){
        setRgb([Math.floor(256 * Math.random()), Math.floor(256 * Math.random()), Math.floor(256 * Math.random())]);
        setInterval(() => {
        setRgb([Math.floor(256 * Math.random()), Math.floor(256 * Math.random()), Math.floor(256 * Math.random())]);
    }, 750);}
    return(
        <div className="w-full h-screen">
            <section>
                <div className="mb-8">
                    <div className="border border-gray-300">Head</div>
                </div>
            </section>
            <div className={`text-7xl font-bold transition-colors flex justify-center items-center`} style={{ color: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` }}>
                Not implemented yet;
            </div>
        </div>
    );
}
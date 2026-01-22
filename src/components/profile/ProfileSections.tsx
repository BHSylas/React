// src/components/Main/ProfileSections.tsx
import { useEffect, useState } from "react";
import {type Player} from "../../types/Player"
import BoardBox from "../board/PostBox";
import { useLocation } from "react-router-dom";

export default function ProfileSections({player}: {player : Player}) {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const enclose = () => setOpen(open !== true)
  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);
  return (
    <section className="space-y-6">
      <div className="bg-base-200 rounded-xl shadow p-6">
        <div className="flex">
          <h2 className="text-2xl lg:text-4xl font-semibold flex-1">수상 경력</h2>
          <div className="text-lg btn m-4 mt-0 bg-base-100" onClick={enclose}>{open === true ? "접기" : "펼치기"}</div>
        </div>
        <div className="divider my-4"></div>
        <ul className="list-disc ml-6 mt-2 text-lg text-base-content/70">
          {open === true ? player.awards?.map((award, idx) => {
            const isDivider = award.trim().startsWith("─");
            const isEmpty = award.trim() === "";
            return (
              <li 
                key={idx} 
                className={`
                  mb-1 
                  ${(isEmpty || isDivider) ? "list-none text-sm md:text-2xl" : "text-xs md:text-lg"} 
                  ${isDivider ? "font-bold text-base-content mt-6 mb-2" : ""}
                `}
              >
                {award || <br />}
              </li>
            );
          }) : <li className="list-none">...</li>}
        </ul>
      </div>
      <div className="bg-base-200 rounded-xl shadow p-6">
        <div className="flex">
          <h2 id="comment" className="text-2xl lg:text-4xl font-semibold flex-1">응원 글</h2>
          {/* <div className="text-lg btn m-4 mt-0 bg-base-100" onClick={enclose}>펼치기/접기</div> */}
        </div>
        <div className="divider my-4"></div>
        <BoardBox playerId={player.id} />
      </div>
    </section>
  );
}

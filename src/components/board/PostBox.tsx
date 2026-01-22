import { useState } from "react";
import BoardList from "./PostList";
import BoardWriter from "./PostWriter";

export default function BoardBox({playerId} : {playerId : number}) {
    const [refreshToken, setRefreshToken] = useState(0);

      // PostWriter가 호출
      const handlePostCreated = () => {
        setRefreshToken((t) => t + 1);  // 변경 시 PostList는 새로 fetch
      };
    return(
        <div>
            <BoardList playerId={playerId} refresh={refreshToken} />
            <BoardWriter playerId={playerId} onSuccess={handlePostCreated} />
        </div>
    )
}
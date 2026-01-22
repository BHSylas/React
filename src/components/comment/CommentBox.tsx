import { useState } from "react";
import CommentList from "./CommentList";
import CommentWriter from "./CommentWriter";

export default function CommentBox({postId} : {postId : number}) {
    const [refreshToken, setRefreshToken] = useState(0);

      // PostWriter가 호출
      const handlePostCreated = () => {
        setRefreshToken((t) => t + 1);  // 변경 시 PostList는 새로 fetch
      };
    return(
        <div>
            <CommentList postId={postId} refresh={refreshToken} onReply={handlePostCreated} />
            <CommentWriter postId={postId} onSuccess={handlePostCreated} />
        </div>
    )
}
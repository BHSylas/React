import { useNavigate } from "react-router-dom";
import type { BoardDto } from "../../types/BoardDto";
import BoardElement from "../board/PostElement";

export default function MyPrediction({post} : {post: BoardDto}){
    const navigate = useNavigate();
    return(
        <a className="cursor-pointer" onClick={ () => navigate(`/players/${post.playerId}#comment`)}>
                <BoardElement comment={post} interactive={false}/>
            </a>
    )
}
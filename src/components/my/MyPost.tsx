import { useNavigate } from "react-router-dom";
import type { PostSummary } from "../../types/Post";

export default function MyPost({post} : {post: PostSummary}){
    const navigate = useNavigate();
    return(
        <a className="cursor-pointer" onClick={() => {navigate(`/posts/${post.id}`)}}>
                    <li
                      className="list-none p-4 m-2 rounded-xl bg-base-100 hover:bg-base-300 transition"
                    >
                      <div className="text-lg font-semibold">{post.title}</div>
                      <div className="text-sm text-gray-500 flex justify-between">
                        <span>{}</span>
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                      </div>
                    </li>
        </a>
    )
}
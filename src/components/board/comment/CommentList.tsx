import CommentElement from "./CommentElement";

export default function CommentList( {comments} : {comments?: Comment[]} ) {
  return (
    <div className="space-y-4 mb-6">
      {comments?.map((comment => (
        <CommentElement key={comment.commentId} comment={comment} />
      )))}
    </div>
  );
}
import React from "react";
import { useSelector } from "react-redux";
import Comment from "./Comment/Comment";
import { AnimatePresence } from "framer-motion";

function Comments(props) {
  const state = useSelector((state) => state.userReducer);
  const { comments } = props;
  return (
    <>
      {comments?.map((comment) => (
        <AnimatePresence>
          <Comment
            key={comment._id}
            commentData={comment}
            signedInUsername={state.username}
            deleteCommentHandler={() =>
              props.deleteCommentHandler(props.postId, comment._id)
            }
          />
        </AnimatePresence>
      ))}
    </>
  );
}

export default Comments;
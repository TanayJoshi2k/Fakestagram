import axios from "axios";
export const addPostComment = async (
  postId,
  userDetails,
  comment,
  setPostComments,
  setComment
) => {
  try {
    const res = await axios.post(`/posts/${postId}/comments`, {
      username: userDetails.username,
      comment: comment,
      avatarURL: userDetails.avatarURL,
    });
    const comments = res.data.comments;
    setPostComments([...comments]);
    setComment("");
  } catch (e) {
    console.log(e);
    setPostComments([]);
    setComment("");
  }
};

export const getPostComments = async (
  postId,
  setLoadingComments,
  postComments,
  setPostComments
) => {
  try {
    setLoadingComments(true);
    const res = await axios.get(`/posts/${postId}/comments`);
    setLoadingComments(false);
    setPostComments(...[...postComments, res.data.comments]);
  } catch (e) {}
};
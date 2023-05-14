import axios from "axios";
export const addPostComment = async (
  postId,
  userDetails,
  comment,
  postComments,
  setPostComments,
  setComment
) => {
  try {

    const commentData = {
      username: userDetails.username,
      comment: comment,
      avatarURL: userDetails.avatarURL,
    }

    const res = await axios.post(`/posts/${postId}/comments`, commentData);
    setPostComments([...res.data.comments]);
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
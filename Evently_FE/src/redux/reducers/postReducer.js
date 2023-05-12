import {
  SET_POSTS,
  SET_LIKES,
  SET_USERNAMES_WHO_LIKED,
  SET_POST_DETAILS,
} from "../actionTypes/actionTypes";

const initialState = {
  posts: [],
};
export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
      };

    case SET_POST_DETAILS:
      const post = state.posts[action.payload.postId];
      post.likes = action.payload.usernamesWhoLiked.length;
      post.usernamesWhoLiked = action.payload.usernamesWhoLiked;
      // modifiedPost[action.payload.postId] = post

      return {
        ...state,
        posts: { ...state.posts },
      };

    default:
      return state;
  }
};

import { SET_POSTS } from "../actionTypes/actionTypes";

export const setPosts = (payload) => {
  return {
    type: SET_POSTS,
    payload: payload,
  };
};


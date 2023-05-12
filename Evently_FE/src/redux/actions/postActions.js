import { SET_LIKES, SET_POSTS, SET_USERNAMES_WHO_LIKED, SET_POST_DETAILS } from "../actionTypes/actionTypes";

export const setPosts = (payload) => {
  return {
    type: SET_POSTS,
    payload: payload,
  };
};

export const setPostLikes = (payload) => {
  return {
    type: SET_LIKES,
    payload: payload
  }
}

export const setUsersWhoLiked = (payload) => {
  return {
    type: SET_USERNAMES_WHO_LIKED,
    payload: payload
  }
}

export const setPostDetails = (payload) => {
  return {
    type: SET_POST_DETAILS,
    payload: payload
  }
}


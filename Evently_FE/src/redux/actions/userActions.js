import {
  SAVE_USER_DETAILS,
  SET_SAVED_POSTS,
  SET_LIKED_POSTS,
} from "../actionTypes/actionTypes";

const saveUserDetails = (payload) => {
  return {
    type: SAVE_USER_DETAILS,
    payload: payload,
  };
};

const setSavedPosts = (payload) => {
  return {
    type: SET_SAVED_POSTS,
    payload: payload,
  };
};

const setLikedPosts = (payload) => {
  return {
    type: SET_LIKED_POSTS,
    payload: payload,
  };
};

export {
  saveUserDetails,
  setSavedPosts,
  setLikedPosts,
};

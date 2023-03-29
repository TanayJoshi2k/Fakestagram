import {
  SAVE_USER_DETAILS,
  SET_BOOKMARKED_EVENTS,
  SET_EVENTS_ATTENDING,
  SET_EVENTS,
  SET_LIKED_POSTS,
} from "../actionTypes/actionTypes";

const saveUserDetails = (payload) => {
  return {
    type: SAVE_USER_DETAILS,
    payload: payload,
  };
};

const setBookmarkedEvents = (payload) => {
  return {
    type: SET_BOOKMARKED_EVENTS,
    payload: payload,
  };
};

const setEventsAttending = (payload) => {
  return {
    type: SET_EVENTS_ATTENDING,
    payload: payload,
  };
};

const setEvents = (payload) => {
  return {
    type: SET_EVENTS,
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
  setBookmarkedEvents,
  setEventsAttending,
  setEvents,
  setLikedPosts,
};

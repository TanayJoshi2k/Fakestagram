import {
  SAVE_USER_DETAILS,
  SET_SAVED_POSTS,
  SET_EVENTS_ATTENDING,
  SET_LIKED_POSTS
} from "../actionTypes/actionTypes";

const initialState = {
  authorized: false,
  avatarURL: "",
  bio: "",
  bookedmarkedEvents: [],
  createdAt: "",
  eventsAttending: [],
  firstName: "",
  followers: [],
  followersCount: 0,
  following: [],
  followingCount: 0,
  gender: "",
  lastName: "",
  notifications: [],
  updatedAt: "",
  username: "",
  likedPosts: [],
  posts:[]
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER_DETAILS:
      return {
        ...state,
        ...action.payload,
      };

    case SET_SAVED_POSTS:
      return {
        ...state,
        savedPosts: [...action.payload],
      };

      case SET_EVENTS_ATTENDING:
      return {
        ...state,
        eventsAttending: [...action.payload],
      };

      case SET_LIKED_POSTS:
      return {
        ...state,
        likedPosts: [...action.payload],
      };
      

    default:
      return state;
  }
};

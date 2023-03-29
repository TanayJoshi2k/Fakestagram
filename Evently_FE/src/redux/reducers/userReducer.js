import {
  SAVE_USER_DETAILS,
  SET_BOOKMARKED_EVENTS,
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
      console.log(action.payload)
      console.log({
        ...state,
        ...action.payload
      })
      return {
        ...state,
        ...action.payload,
      };

    case SET_BOOKMARKED_EVENTS:
      return {
        ...state,
        bookedmarkedEvents: [...action.payload],
      };

      case SET_EVENTS_ATTENDING:
      return {
        ...state,
        eventsAttending: [...action.payload],
      };

      case SET_LIKED_POSTS:
        console.log(action.payload)
      return {
        ...state,
        likedPosts: [...action.payload],
      };
      

    default:
      return state;
  }
};

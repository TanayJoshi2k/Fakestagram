import { SET_POSTS } from "../actionTypes/actionTypes";

const initialState = {
  posts: [],
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS:
      return {
        ...state,
        posts: [...action.payload],
      };

    default:
      return state;
  }
};

import { SET_EVENTS } from "../actionTypes/actionTypes";

const initialState = {
  events: [],
};

export const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload,
      };

    default:
      return state;
  }
};

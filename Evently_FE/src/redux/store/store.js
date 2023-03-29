import { createStore } from "redux";
import { userReducer } from "../reducers/userReducer";
import { eventReducer } from "../reducers/eventReducer";
import { postReducer } from "../reducers/postReducer";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  userReducer,
  eventReducer,
  postReducer
});

const store = createStore(rootReducer);
export default store;

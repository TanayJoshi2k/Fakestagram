import { createStore } from "redux";
import { userReducer } from "../reducers/userReducer";
import { postReducer } from "../reducers/postReducer";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  userReducer,
  postReducer
});

const store = createStore(rootReducer);
export default store;

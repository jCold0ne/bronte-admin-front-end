import { combineReducers } from "redux";
// import authReducer from "./auth_reducer";
import postsReducer from "./posts_reducer";

export default combineReducers({
  // auth: authReducer,
  posts: postsReducer
});

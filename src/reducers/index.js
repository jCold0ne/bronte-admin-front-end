import { combineReducers } from "redux";
import authReducer from "./auth_reducer";
import postsReducer from "./posts_reducer";
import imagesReducer from "./images_reducer";

export default combineReducers({
  auth: authReducer,
  posts: postsReducer,
  images: imagesReducer
});

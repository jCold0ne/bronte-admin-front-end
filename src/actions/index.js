import axios from "axios";

export const fetchPosts = () => {
  return async (dispatch, getState) => {
    let response = await axios.get("http://localhost:3000/posts");

    return dispatch({
      type: "SET_POSTS",
      payload: response.data
    });
  };
};
